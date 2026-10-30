(function (root) {
  "use strict";
  const PROPERTY = "560596894";
  const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
  const ENDPOINT =
    "https://analyticsdata.googleapis.com/v1beta/properties/" +
    PROPERTY +
    ":runReport";
  const METRICS = [
    "users",
    "sessions",
    "views",
    "engagedSessions",
    "productInterest",
    "handoffs",
    "searchClicks",
    "searchImpressions",
  ];
  const BREAKDOWNS = [
    "countries",
    "cities",
    "sources",
    "products",
    "sections",
    "events",
    "devices",
    "queries",
    "pages",
  ];

  function createConnector(options = {}) {
    const host = options.root || root;
    const request = options.fetch || (host.fetch && host.fetch.bind(host));
    const now = options.now || (() => Date.now());
    const later = options.setTimeout || setTimeout;
    const cancel = options.clearTimeout || clearTimeout;
    let token = null;
    let expiresAt = 0;
    let gisLoading = null;
    let connecting = false;
    let fetching = false;

    function disconnect() {
      token = null;
      expiresAt = 0;
    }
    function isConnected() {
      if (!token || expiresAt <= now() + 5000) {
        disconnect();
        return false;
      }
      return true;
    }
    function getState() {
      return { connected: isConnected(), expiresAt, property: PROPERTY };
    }

    function loadIdentity() {
      if (host.google?.accounts?.oauth2?.initTokenClient)
        return Promise.resolve();
      if (gisLoading) return gisLoading;
      gisLoading = new Promise((resolve, reject) => {
        const doc = host.document;
        if (!doc?.createElement || !doc.head) {
          reject(Error("Google sign-in is unavailable in this browser."));
          return;
        }
        const script = doc.createElement("script");
        const timer = later(
          () =>
            reject(
              Error(
                "Google sign-in took too long to load. Check your connection and try again.",
              ),
            ),
          30000,
        );
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
          cancel(timer);
          if (host.google?.accounts?.oauth2?.initTokenClient) resolve();
          else
            reject(
              Error(
                "Google sign-in did not initialise. Reload this page and try again.",
              ),
            );
        };
        script.onerror = () => {
          cancel(timer);
          reject(
            Error(
              "Google sign-in could not load. Check browser blocking or your connection.",
            ),
          );
        };
        doc.head.appendChild(script);
      }).catch((error) => {
        gisLoading = null;
        throw error;
      });
      return gisLoading;
    }

    async function connect(clientId) {
      if (connecting)
        throw Error(
          "Google sign-in is already open. Complete or close that window first.",
        );
      if (
        typeof clientId !== "string" ||
        !/^\d{6,}-[a-zA-Z0-9_-]+\.apps\.googleusercontent\.com$/.test(
          clientId.trim(),
        )
      ) {
        throw Error(
          "Enter a Google OAuth Web client ID ending in .apps.googleusercontent.com. Do not enter a client secret or API key.",
        );
      }
      const location = host.location;
      if (
        location &&
        !(
          (location.protocol === "https:" &&
            ["vayam-global.com", "www.vayam-global.com"].includes(
              location.hostname,
            )) ||
          (location.protocol === "http:" &&
            ["127.0.0.1", "localhost"].includes(location.hostname))
        )
      ) {
        throw Error(
          "Connect Google only from the Vayam website or its localhost preview.",
        );
      }
      disconnect();
      connecting = true;
      try {
        await loadIdentity();
        return await new Promise((resolve, reject) => {
          let settled = false;
          const finish = (error, response) => {
            if (settled) return;
            settled = true;
            cancel(timer);
            if (error) {
              disconnect();
              reject(Error(error));
              return;
            }
            const granted = String(response?.scope || "").split(/\s+/);
            if (
              !response?.access_token ||
              !granted.includes(SCOPE) ||
              !Number.isFinite(Number(response.expires_in)) ||
              Number(response.expires_in) <= 0
            ) {
              disconnect();
              reject(
                Error(
                  "Read-only Analytics access was not granted. No report was loaded.",
                ),
              );
              return;
            }
            token = response.access_token;
            expiresAt =
              now() + Math.min(Number(response.expires_in), 3600) * 1000;
            resolve({ property: PROPERTY, expiresAt });
          };
          const timer = later(
            () =>
              finish(
                "Google sign-in timed out. Close the old Google sign-in window, then click Continue to Google to start a fresh sign-in.",
              ),
            300000,
          );
          try {
            const client = host.google.accounts.oauth2.initTokenClient({
              client_id: clientId.trim(),
              scope: SCOPE,
              include_granted_scopes: false,
              callback: (response) =>
                finish(
                  response?.error
                    ? "Google access was declined or unavailable. You can continue using imported reports."
                    : null,
                  response,
                ),
              error_callback: (error) => {
                // Known categories are useful; raw OAuth descriptions and URLs may contain private data.
                const messages = {
                  popup_failed_to_open:
                    "Google sign-in window could not open. Allow pop-ups for this Vayam page, then click Continue to Google again.",
                  popup_closed:
                    "Google sign-in window was closed before approval. Click Continue to Google to start a fresh sign-in.",
                };
                finish(
                  Object.hasOwn(messages, error?.type)
                    ? messages[error.type]
                    : "Google sign-in could not finish. Close any older Google sign-in window, then click Continue to Google to try again.",
                );
              },
            });
            client.requestAccessToken({ prompt: "select_account" });
          } catch (_) {
            finish(
              "Google sign-in could not open. Check the OAuth client setup and try again.",
            );
          }
        });
      } finally {
        connecting = false;
      }
    }

    function validDate(value) {
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
        return false;
      const date = new Date(value + "T00:00:00Z");
      return (
        Number.isFinite(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    }
    function number(value) {
      if (value === undefined || value === null || value === "") return null;
      const n = Number(value);
      return Number.isSafeInteger(n) && n >= 0 ? n : null;
    }
    function emptyMetrics() {
      return Object.fromEntries(METRICS.map((key) => [key, null]));
    }
    function exactEvent(value) {
      return {
        filter: {
          fieldName: "eventName",
          stringFilter: { matchType: "EXACT", value },
        },
      };
    }

    async function fetchReport({ start, end } = {}) {
      if (!isConnected())
        throw Error(
          "Google access has expired or is not connected. Click Connect Google to sign in again.",
        );
      if (!request) throw Error("This browser cannot request Google reports.");
      if (fetching) throw Error("A Google report is already loading.");
      if (
        !validDate(start) ||
        !validDate(end) ||
        end < start ||
        (Date.parse(end) - Date.parse(start)) / 86400000 >= 366
      ) {
        throw Error(
          "Choose valid start and end dates covering at most 366 days.",
        );
      }
      fetching = true;
      const notes = [
        "Source: Google Analytics 4 property " +
          PROPERTY +
          ". Collected visits depend on visitor consent and blocking.",
        "Contact handoffs are action counts, not received messages or sales. Search Console metrics require their separate report.",
        "Early verification traffic may be included. Approximate city and country do not identify an individual visitor.",
      ];
      const report = {
        schemaVersion: 2,
        label: "Vayam GA4 · " + start + " to " + end,
        source: {
          name: "Google Analytics 4",
          property: PROPERTY,
          kind: "import",
          capturedAt: new Date(now()).toISOString(),
        },
        period: { start, end, timeZone: "Asia/Kolkata" },
        metrics: emptyMetrics(),
        daily: [],
        breakdowns: Object.fromEntries(BREAKDOWNS.map((key) => [key, []])),
        notes,
      };
      const mainMetrics = [
        "totalUsers",
        "sessions",
        "screenPageViews",
        "engagedSessions",
      ];
      const mappedMetrics = ["users", "sessions", "views", "engagedSessions"];
      const daily = new Map();
      let successes = 0;

      async function run(name, dimensions, metrics, filter, limit = 100) {
        if (!isConnected())
          throw Error(
            "Google access expired while loading. Connect Google again.",
          );
        const controller =
          typeof AbortController !== "undefined" ? new AbortController() : null;
        const timer = controller
          ? later(() => controller.abort(), 25000)
          : null;
        try {
          const response = await request(ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              dateRanges: [{ startDate: start, endDate: end }],
              dimensions: dimensions.map((name) => ({ name })),
              metrics: metrics.map((name) => ({ name })),
              ...(filter ? { dimensionFilter: filter } : {}),
              limit: String(limit),
              ...(dimensions.length
                ? {
                    orderBys:
                      dimensions[0] === "date"
                        ? [{ dimension: { dimensionName: "date" } }]
                        : [{ metric: { metricName: metrics[0] }, desc: true }],
                  }
                : {}),
            }),
            ...(controller ? { signal: controller.signal } : {}),
          });
          if (response.status === 401) {
            disconnect();
            throw Object.assign(
              Error(
                "Google access expired or was revoked. Connect Google again.",
              ),
              { fatal: true },
            );
          }
          if (!response.ok) {
            notes.push(
              name +
                " unavailable (" +
                response.status +
                "). Check Data API enablement, property access, custom dimensions or quota.",
            );
            return null;
          }
          const result = await response.json();
          if (!result || !Array.isArray(result.metricHeaders)) {
            notes.push(name + " returned no usable metrics.");
            return null;
          }
          successes++;
          const meta = result.metadata || {};
          if (meta.timeZone) report.period.timeZone = meta.timeZone;
          if (meta.subjectToThresholding)
            notes.push(
              "One or more reports are subject to Google privacy thresholding.",
            );
          if (meta.dataLossFromOtherRow)
            notes.push(
              "One or more reports contain grouped or omitted high-cardinality data.",
            );
          if (
            Array.isArray(meta.samplingMetadatas) &&
            meta.samplingMetadatas.length
          )
            notes.push("One or more reports may be sampled by Google.");
          if (number(result.rowCount) > limit)
            notes.push(
              name +
                " shows only the top " +
                limit +
                " rows; totals may include more.",
            );
          return result;
        } catch (error) {
          if (error?.fatal) throw error;
          notes.push(
            name +
              " could not load. Check your connection or try a shorter period.",
          );
          return null;
        } finally {
          if (timer !== null) cancel(timer);
        }
      }
      function value(row, result, metric) {
        const index = result?.metricHeaders?.findIndex(
          (header) => header.name === metric,
        );
        return index >= 0 ? number(row?.metricValues?.[index]?.value) : null;
      }
      function rowDate(row) {
        const compact = row?.dimensionValues?.[0]?.value;
        if (!/^\d{8}$/.test(compact || "")) return null;
        const date =
          compact.slice(0, 4) +
          "-" +
          compact.slice(4, 6) +
          "-" +
          compact.slice(6, 8);
        return validDate(date) && date >= start && date <= end ? date : null;
      }
      function eachDay(result, callback) {
        for (const row of result?.rows || []) {
          const date = rowDate(row);
          if (!date) continue;
          if (!daily.has(date)) daily.set(date, { date, ...emptyMetrics() });
          callback(daily.get(date), row);
        }
      }
      try {
        const total = await run("Overview", [], mainMetrics);
        mappedMetrics.forEach((key, i) => {
          report.metrics[key] = value(total?.rows?.[0], total, mainMetrics[i]);
        });
        if (total && !total.rows?.length)
          notes.push(
            "Overview returned no aggregate row; missing values are not assumed to be zero.",
          );
        const days = await run(
          "Daily activity",
          ["date"],
          mainMetrics,
          null,
          366,
        );
        eachDay(days, (target, row) =>
          mappedMetrics.forEach((key, i) => {
            target[key] = value(row, days, mainMetrics[i]);
          }),
        );
        for (const [event, key] of [
          ["product_interest", "productInterest"],
          ["contact_handoff", "handoffs"],
        ]) {
          const aggregate = await run(
            event + " total",
            [],
            ["eventCount"],
            exactEvent(event),
          );
          report.metrics[key] = value(
            aggregate?.rows?.[0],
            aggregate,
            "eventCount",
          );
          const trend = await run(
            event + " by day",
            ["date"],
            ["eventCount"],
            exactEvent(event),
            366,
          );
          eachDay(trend, (target, row) => {
            target[key] = value(row, trend, "eventCount");
          });
        }
        const specs = [
          ["countries", ["country"], "sessions", "sessions", null, 80],
          ["cities", ["city", "country"], "sessions", "sessions", null, 80],
          [
            "sources",
            ["sessionDefaultChannelGroup"],
            "sessions",
            "sessions",
            null,
            20,
          ],
          ["devices", ["deviceCategory"], "sessions", "sessions", null, 10],
          [
            "products",
            ["customEvent:group"],
            "eventCount",
            "productInterest",
            exactEvent("product_interest"),
            50,
          ],
          [
            "sections",
            ["customEvent:section"],
            "eventCount",
            "events",
            exactEvent("section_view"),
            30,
          ],
          ["events", ["eventName"], "eventCount", "events", null, 100],
        ];
        for (const [key, dimensions, metric, mapped, filter, limit] of specs) {
          const result = await run(key, dimensions, [metric], filter, limit);
          report.breakdowns[key] = (result?.rows || []).flatMap((row) => {
            const count = value(row, result, metric);
            const name = row?.dimensionValues?.[0]?.value;
            if (count === null || typeof name !== "string") return [];
            return [
              {
                name: name.slice(0, 120),
                value: count,
                metric: mapped,
                ...(key === "cities"
                  ? {
                      country: String(
                        row.dimensionValues?.[1]?.value || "",
                      ).slice(0, 120),
                    }
                  : {}),
              },
            ];
          });
        }
        if (!successes)
          throw Error(
            "No Google report could be loaded. Enable the Analytics Data API and confirm read access to Vayam property " +
              PROPERTY +
              ".",
          );
        report.daily = [...daily.values()].sort((a, b) =>
          a.date.localeCompare(b.date),
        );
        report.notes = [...new Set(notes)];
        return host.VayamAnalytics?.validate
          ? host.VayamAnalytics.validate(report)
          : report;
      } finally {
        fetching = false;
      }
    }
    return Object.freeze({
      prepare: loadIdentity,
      connect,
      fetchReport,
      disconnect,
      isConnected,
      getState,
    });
  }
  root.VayamGoogle = createConnector();
  if (typeof module !== "undefined")
    module.exports = { createConnector, PROPERTY, SCOPE };
})(typeof window !== "undefined" ? window : globalThis);
