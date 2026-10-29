/* Pure reporting calculations. Counts, unique users and missing data keep their own meanings. */
(function (root) {
  "use strict";
  const metricKeys = Object.freeze([
    "users",
    "sessions",
    "views",
    "engagedSessions",
    "productInterest",
    "handoffs",
    "searchClicks",
    "searchImpressions",
  ]);
  const breakdownKeys = Object.freeze([
    "countries",
    "cities",
    "sources",
    "products",
    "sections",
    "events",
    "devices",
    "queries",
    "pages",
  ]);
  const additive = metricKeys.filter((key) => key !== "users");
  const dayMs = 86400000;
  const fail = (message) => {
    throw new Error("Report not loaded: " + message);
  };
  const plain = (value) =>
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value));
  const count = (value) =>
    value === null ||
    (Number.isSafeInteger(value) && value >= 0 && value <= 1e12);

  function dateValue(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
      return null;
    const valueMs = Date.parse(value + "T00:00:00Z");
    if (
      !Number.isFinite(valueMs) ||
      new Date(valueMs).toISOString().slice(0, 10) !== value ||
      value.slice(0, 4) < "2000"
    )
      return null;
    return valueMs;
  }
  function days(period) {
    return period
      ? Math.round((dateValue(period.end) - dateValue(period.start)) / dayMs) +
          1
      : null;
  }
  function cleanText(value, label, max = 300, empty = false) {
    if (
      typeof value !== "string" ||
      value.length > max ||
      (!empty && !value.trim()) ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
    )
      fail(label + " must be readable text.");
    // Exports contain aggregate analytics only: do not accept emails or raw IP addresses.
    if (
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value) ||
      /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(value) ||
      /\b(?:[a-f\d]{1,4}:){3,}[a-f\d:]+\b/i.test(value)
    )
      fail(
        label +
          " contains an email or IP address. Use aggregated report labels.",
      );
    return value.trim();
  }
  function checkTree(value, depth = 0, ancestors = new Set()) {
    if (depth > 8) fail("nested data is too deep.");
    if (!value || typeof value !== "object") return;
    if (ancestors.has(value)) fail("circular data is unsupported.");
    ancestors.add(value);
    for (const key of Object.keys(value)) {
      if (
        ["__proto__", "prototype", "constructor"].includes(key) ||
        /^(?:email|ip|ipaddress|rawip|address|phone|password|token|apikey|userid|clientid)$/i.test(
          key.replace(/[_\s-]/g, ""),
        )
      )
        fail("personal identifiers or unsafe fields are unsupported.");
      checkTree(value[key], depth + 1, ancestors);
    }
    ancestors.delete(value);
  }
  function whitelist(value, keys, label) {
    if (!plain(value)) fail(label + " must be an object.");
    if (Object.keys(value).some((key) => !keys.includes(key)))
      fail(label + " has an unsupported field.");
  }
  function metricValues(value, partial = false) {
    whitelist(value, metricKeys, "metrics");
    const output = {};
    for (const key of metricKeys) {
      const candidate = value[key] === undefined ? null : value[key];
      if (!count(candidate))
        fail(key + " must be a non-negative whole number or null.");
      if (!partial || value[key] !== undefined) output[key] = candidate;
    }
    if (
      output.engagedSessions !== null &&
      output.engagedSessions !== undefined &&
      output.sessions !== null &&
      output.sessions !== undefined &&
      output.engagedSessions > output.sessions
    )
      fail("engaged sessions cannot exceed sessions.");
    if (
      output.searchClicks !== null &&
      output.searchClicks !== undefined &&
      output.searchImpressions !== null &&
      output.searchImpressions !== undefined &&
      output.searchClicks > output.searchImpressions
    )
      fail("search clicks cannot exceed search impressions.");
    return output;
  }

  function validate(input) {
    if (!plain(input)) fail("choose a JSON report object.");
    checkTree(input);
    let size;
    try {
      size = JSON.stringify(input).length;
    } catch (_) {
      fail("the report cannot be read.");
    }
    if (size > 1500000) fail("the report exceeds the 1.5 MB limit.");
    if (input.schemaVersion === 1) return legacy(input);
    whitelist(
      input,
      [
        "schemaVersion",
        "label",
        "source",
        "period",
        "metrics",
        "daily",
        "breakdowns",
        "notes",
        "selection",
      ],
      "report",
    );
    if (input.schemaVersion !== 2)
      fail("supported schema versions are 1 and 2.");
    whitelist(
      input.source,
      ["name", "property", "kind", "capturedAt"],
      "source",
    );
    if (!["snapshot", "sample", "import"].includes(input.source.kind))
      fail("source kind must be snapshot, sample or import.");
    const output = {
      schemaVersion: 2,
      label: cleanText(input.label, "Report label", 160),
      source: {
        name: cleanText(input.source.name, "Source name", 120),
        property: cleanText(input.source.property, "Property", 180),
        kind: input.source.kind,
        capturedAt: null,
      },
      period: null,
      metrics: metricValues(input.metrics),
      daily: [],
      breakdowns: {},
      notes: [],
    };
    if (input.source.capturedAt != null) {
      if (
        typeof input.source.capturedAt !== "string" ||
        input.source.capturedAt.length > 40 ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(
          input.source.capturedAt,
        ) ||
        dateValue(input.source.capturedAt.slice(0, 10)) === null ||
        !Number.isFinite(Date.parse(input.source.capturedAt))
      )
        fail("capture time must be an ISO timestamp.");
      output.source.capturedAt = input.source.capturedAt;
    }
    if (input.period !== null) {
      whitelist(input.period, ["start", "end", "timeZone"], "period");
      if (
        dateValue(input.period.start) === null ||
        dateValue(input.period.end) === null ||
        input.period.start > input.period.end
      )
        fail("choose a valid start and end date.");
      output.period = {
        start: input.period.start,
        end: input.period.end,
        timeZone: cleanText(input.period.timeZone, "Time zone", 80),
      };
      try {
        new Intl.DateTimeFormat("en", { timeZone: output.period.timeZone });
      } catch (_) {
        fail("the time zone is not recognised.");
      }
      if (days(output.period) > 1096)
        fail("a report can cover at most three years.");
    }
    if (!Array.isArray(input.daily) || input.daily.length > 1096)
      fail("daily data must have at most 1096 rows.");
    for (const row of input.daily) {
      whitelist(row, ["date", ...metricKeys], "daily row");
      if (
        !output.period ||
        dateValue(row.date) === null ||
        row.date < output.period.start ||
        row.date > output.period.end ||
        (output.daily.length &&
          row.date <= output.daily[output.daily.length - 1].date)
      )
        fail(
          "daily dates must be unique, chronological and within the report period.",
        );
      const { date, ...counts } = row;
      output.daily.push({ date, ...metricValues(counts, true) });
    }
    whitelist(input.breakdowns, breakdownKeys, "breakdowns");
    for (const key of breakdownKeys) {
      const rows =
        input.breakdowns[key] === undefined ? [] : input.breakdowns[key];
      if (!Array.isArray(rows) || rows.length > 500)
        fail(key + " can have at most 500 rows.");
      output.breakdowns[key] = rows.map((row) => {
        whitelist(
          row,
          ["name", "value", "metric", "country", "code"],
          key + " row",
        );
        if (!count(row.value) || row.value === undefined)
          fail(key + " counts must be a whole number or null.");
        if (![...metricKeys, "events"].includes(row.metric))
          fail(key + " rows need an explicit metric.");
        const result = {
          name: cleanText(row.name, key + " label", 500),
          value: row.value,
          metric: row.metric,
        };
        if (row.country !== undefined)
          result.country = cleanText(row.country, "Country", 120, true);
        if (row.code !== undefined)
          result.code = cleanText(row.code, "Code", 12, true);
        return result;
      });
    }
    if (!Array.isArray(input.notes) || input.notes.length > 30)
      fail("notes must contain at most 30 entries.");
    output.notes = input.notes.map((note) => cleanText(note, "Note", 1200));
    if (input.selection) {
      whitelist(
        input.selection,
        ["start", "end", "isSubset", "notes"],
        "selection",
      );
      if (
        !output.period ||
        input.selection.start !== output.period.start ||
        input.selection.end !== output.period.end ||
        typeof input.selection.isSubset !== "boolean" ||
        !Array.isArray(input.selection.notes) ||
        input.selection.notes.length > 10
      )
        fail("selection is invalid.");
      output.selection = {
        start: input.selection.start,
        end: input.selection.end,
        isSubset: input.selection.isSubset,
        notes: input.selection.notes.map((note) =>
          cleanText(note, "Selection note", 1200),
        ),
      };
    }
    return output;
  }

  function legacy(input) {
    // Old files have no reliable dates or source identifiers. Do not invent them.
    whitelist(
      input,
      [
        "schemaVersion",
        "label",
        "summary",
        "trend",
        "countries",
        "sources",
        "cities",
        "products",
        "sections",
        "funnel",
      ],
      "legacy report",
    );
    whitelist(
      input.summary,
      ["visitors", "visits", "productInterest", "handoffs"],
      "legacy summary",
    );
    const output = {
      schemaVersion: 2,
      label: cleanText(input.label, "Report label", 160),
      source: {
        name: "Legacy report import",
        property: "unverified",
        kind: "import",
        capturedAt: null,
      },
      period: null,
      metrics: metricValues({
        users: input.summary.visitors,
        sessions: input.summary.visits,
        productInterest: input.summary.productInterest,
        handoffs: input.summary.handoffs,
      }),
      daily: [],
      breakdowns: {},
      notes: [
        "Legacy report: source and calendar dates are unknown. Date filters and period comparisons are unavailable.",
      ],
    };
    for (const key of ["visitors", "visits", "productInterest", "handoffs"])
      if (!Number.isSafeInteger(input.summary[key]) || input.summary[key] < 0)
        fail("legacy summary contains invalid counts.");
    if (
      !Array.isArray(input.trend) ||
      input.trend.length > 366 ||
      input.trend.some(
        (r, i) =>
          !Array.isArray(r) ||
          r.length !== 3 ||
          r.some((n) => !Number.isSafeInteger(n) || n < 0) ||
          r[0] < 1 ||
          (i > 0 && r[0] <= input.trend[i - 1][0]),
      )
    )
      fail("legacy trend contains invalid rows.");
    const metrics = {
      countries: "users",
      cities: "users",
      sources: "sessions",
      products: "productInterest",
      sections: "events",
    };
    for (const key of breakdownKeys) {
      const rows = input[key] === undefined ? [] : input[key];
      if (!Array.isArray(rows) || rows.length > 500)
        fail("legacy " + key + " has invalid rows.");
      output.breakdowns[key] = rows.map((row) => {
        whitelist(
          row,
          ["name", "value", "country", "code", "color"],
          "legacy row",
        );
        if (!Number.isSafeInteger(row.value) || row.value < 0)
          fail("legacy breakdown has invalid counts.");
        const result = {
          name: cleanText(row.name, "Legacy label", 500),
          value: row.value,
          metric: metrics[key] || "events",
        };
        if (row.country !== undefined)
          result.country = cleanText(row.country, "Country", 120);
        if (row.code !== undefined)
          result.code = cleanText(row.code, "Code", 12);
        return result;
      });
    }
    if (
      !Array.isArray(input.funnel) ||
      input.funnel.length > 30 ||
      input.funnel.some(
        (row) =>
          !plain(row) || !Number.isSafeInteger(row.count) || row.count < 0,
      )
    )
      fail("legacy intent stages are invalid.");
    for (const row of input.funnel) {
      cleanText(row.name, "Legacy stage");
      if (row.detail !== undefined)
        cleanText(row.detail, "Legacy stage detail", 500, true);
    }
    return validate(output);
  }

  function selectPeriod(input, start, end) {
    const report = validate(input);
    if (!report.period)
      fail("this report has no calendar dates. Use the full report.");
    if (
      dateValue(start) === null ||
      dateValue(end) === null ||
      start > end ||
      start < report.period.start ||
      end > report.period.end
    )
      fail("choose dates inside the report period.");
    const isSubset = start !== report.period.start || end !== report.period.end;
    const notes = [];
    if (!isSubset)
      return { ...report, selection: { start, end, isSubset: false, notes } };
    const daily = report.daily.filter(
      (row) => row.date >= start && row.date <= end,
    );
    const selectedDays = days({ start, end });
    const complete = daily.length === selectedDays;
    const metrics = {};
    for (const key of metricKeys) {
      const available =
        complete &&
        key !== "users" &&
        daily.every((row) => row[key] !== null && row[key] !== undefined);
      metrics[key] = available
        ? daily.reduce((sum, row) => sum + row[key], 0)
        : null;
    }
    notes.push(
      "Unique users cannot be added across days; the selected-period user total is unavailable.",
    );
    notes.push(
      "Breakdown tables cover the original full report only and are hidden for this date selection. Import a report for the selected dates to view them.",
    );
    if (!complete)
      notes.push(
        "Some selected dates have no daily row. Totals are unavailable rather than treating missing days as zero.",
      );
    return {
      ...report,
      period: { ...report.period, start, end },
      metrics,
      daily,
      breakdowns: Object.fromEntries(breakdownKeys.map((key) => [key, []])),
      selection: { start, end, isSubset, notes },
    };
  }

  function ratio(numerator, denominator) {
    return Number.isFinite(numerator) &&
      Number.isFinite(denominator) &&
      denominator > 0
      ? (numerator / denominator) * 100
      : null;
  }
  function derived(input) {
    const report = validate(input);
    return {
      engagementRate: ratio(
        report.metrics.engagedSessions,
        report.metrics.sessions,
      ),
      searchCTR: ratio(
        report.metrics.searchClicks,
        report.metrics.searchImpressions,
      ),
      handoffsPer100Sessions: ratio(
        report.metrics.handoffs,
        report.metrics.sessions,
      ),
    };
  }
  function compare(currentInput, previousInput) {
    const current = validate(currentInput),
      previous = validate(previousInput),
      reasons = [];
    if (!current.period || !previous.period)
      reasons.push("Both reports need calendar dates.");
    if (current.source.kind === "sample" || previous.source.kind === "sample") {
      if (current.source.kind !== previous.source.kind)
        reasons.push("Sample figures cannot be compared with real reports.");
    }
    if (
      current.source.name !== previous.source.name ||
      current.source.property !== previous.source.property ||
      current.source.property === "unverified"
    )
      reasons.push("Choose reports from the same named source and property.");
    if (current.period && previous.period) {
      if (current.period.timeZone !== previous.period.timeZone)
        reasons.push("Choose reports using the same time zone.");
      if (days(current.period) !== days(previous.period))
        reasons.push("Choose periods with the same number of calendar days.");
      if (
        current.period.start <= previous.period.end &&
        previous.period.start <= current.period.end
      )
        reasons.push("Choose non-overlapping periods.");
    }
    const compatible = reasons.length === 0,
      metrics = {};
    for (const key of metricKeys) {
      const now = current.metrics[key],
        before = previous.metrics[key];
      const available = compatible && now !== null && before !== null;
      metrics[key] = {
        current: now,
        previous: before,
        delta: available ? now - before : null,
        percent:
          available && before > 0 ? ((now - before) / before) * 100 : null,
        status: !compatible
          ? "incompatible"
          : !available
            ? "unavailable"
            : before === 0
              ? now === 0
                ? "unchanged-zero"
                : "no-baseline"
              : "comparable",
      };
    }
    return {
      compatible,
      reasons,
      periodDays: current.period ? days(current.period) : null,
      metrics,
    };
  }

  function insights(input, comparison) {
    const report = validate(input),
      rows = [],
      m = report.metrics,
      rates = derived(report);
    const add = (id, tone, title, detail, action) =>
      rows.push({ id, tone, title, detail, action });
    if (report.source.kind === "sample")
      add(
        "sample",
        "notice",
        "Demonstration figures",
        "These are fictional examples, so the observations below are not findings about Vayam.",
        "Load an exported real report before making business decisions.",
      );
    if (m.sessions !== null && m.sessions < 50)
      add(
        "small-sample",
        "notice",
        "Build a larger baseline",
        m.sessions +
          " sessions is a small sample. Testing visits can noticeably change the results.",
        "Review several complete weeks and record your own test dates before choosing a redesign.",
      );
    if (m.searchImpressions !== null && m.searchClicks !== null)
      add(
        "search",
        "info",
        "Search visibility and clicks",
        "The report records " +
          m.searchImpressions +
          " Google Search impressions and " +
          m.searchClicks +
          " clicks" +
          (rates.searchCTR === null
            ? "."
            : " (" + rates.searchCTR.toFixed(1) + "% CTR)."),
        "Review search queries and landing pages together. Compare the same period length before changing titles or descriptions.",
      );
    if (m.handoffs === 0)
      add(
        "no-handoffs",
        "info",
        "No recorded contact handoffs",
        "No contact handoffs were recorded in this report. Consent, blockers and people contacting you directly can affect coverage.",
        "Test the contact buttons once, then compare the website report with the messages actually received.",
      );
    else if (m.handoffs !== null)
      add(
        "handoffs",
        "info",
        "Contact intent needs follow-up",
        m.handoffs +
          " contact handoffs were recorded. Repeated clicks are possible; they do not confirm delivered enquiries.",
        "Keep a private count of received enquiries and qualified leads, then compare their trend with website intent.",
      );
    const products = report.breakdowns.products
      .filter((row) => row.value !== null)
      .sort((a, b) => b.value - a.value);
    if (products.length)
      add(
        "products",
        "info",
        "A product group to investigate",
        products[0].name +
          " has the highest recorded value in the available product rows (" +
          products[0].value +
          ").",
        "Check whether received enquiries show the same interest before giving the group more space.",
      );
    const countries = report.breakdowns.countries
      .filter((row) => row.value !== null)
      .sort((a, b) => b.value - a.value);
    if (countries.length)
      add(
        "geography",
        "info",
        "Look at the source of reach",
        countries[0].name +
          " leads the available country rows. Location is approximate and may include your own testing.",
        "Compare countries with traffic sources and actual buyer enquiries before investing in a market.",
      );
    if (comparison && !comparison.compatible)
      add(
        "comparison",
        "notice",
        "Comparison needs matching reports",
        comparison.reasons.join(" "),
        "Use the same source, property, time zone and equal-length, non-overlapping periods.",
      );
    if (!rows.length)
      add(
        "coverage",
        "info",
        "Start with reporting coverage",
        "There is not enough information in this report for a useful observation.",
        "Open the connected Google report or import a complete aggregate report with dates and source details.",
      );
    return rows;
  }

  function csvCell(value) {
    let out = value === null || value === undefined ? "" : String(value);
    // A quotation alone does not prevent spreadsheet formula execution.
    if (/^[\s\uFEFF]*[=+\-@]/.test(out)) out = "'" + out;
    return '"' + out.replace(/"/g, '""') + '"';
  }
  function toCSV(input, options = {}) {
    const report = validate(input),
      type = options.type || "summary";
    let rows;
    if (type === "summary")
      rows = [
        ["metric", "value", "period_start", "period_end", "source", "property"],
        ...metricKeys.map((key) => [
          key,
          report.metrics[key],
          report.period?.start,
          report.period?.end,
          report.source.name,
          report.source.property,
        ]),
      ];
    else if (type === "daily")
      rows = [
        ["date", ...metricKeys],
        ...report.daily.map((row) => [
          row.date,
          ...metricKeys.map((key) => row[key]),
        ]),
      ];
    else if (breakdownKeys.includes(type))
      rows = [
        ["name", "value", "metric", "country", "period_start", "period_end"],
        ...report.breakdowns[type].map((row) => [
          row.name,
          row.value,
          row.metric,
          row.country,
          report.period?.start,
          report.period?.end,
        ]),
      ];
    else fail("choose a supported export table.");
    return rows.map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
  }
  const api = Object.freeze({
    validate,
    selectPeriod,
    compare,
    derived,
    insights,
    toCSV,
    metricKeys,
    breakdownKeys,
    days,
  });
  root.VayamAnalytics = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
