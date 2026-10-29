/* Vayam Analytics Studio: data stays in memory; only display preferences are saved. */
(() => {
  "use strict";
  const E = window.VayamAnalytics,
    G = window.VayamGoogle,
    $ = (id) => document.getElementById(id);
  const labels = {
    users: "Measured users",
    sessions: "Site visits",
    views: "Page views",
    engagedSessions: "Engaged visits",
    productInterest: "Product interest",
    handoffs: "Contact handoffs",
    searchClicks: "Google search clicks",
    searchImpressions: "Search impressions",
    events: "Recorded actions",
  };
  const help = {
    users:
      "Distinct users measured by the provider across this period. Daily user counts cannot be added to calculate this total.",
    sessions:
      "Sessions recorded in the selected period. One person can visit more than once.",
    views:
      "Recorded page views, including repeat views. This is different from the number of people.",
    engagedSessions:
      "Sessions that meet GA4’s engagement definition. Use engagement rate with the session total for context.",
    productInterest:
      "Recorded product_interest actions. Repeat interactions are possible; this does not confirm an order.",
    handoffs:
      "Recorded contact_handoff actions opening a contact channel. A click is not proof that a message was sent or received.",
    searchClicks:
      "Clicks from Google Search. Search Console uses its own reporting dates and can update after a delay.",
    searchImpressions:
      "Appearances in Google Search results. An impression does not necessarily become a website visit.",
  };
  const short = {
    users: "Distinct in this period",
    sessions: "One person can visit again",
    views: "Includes repeated page views",
    engagedSessions: "GA4 engagement definition",
    productInterest: "Product actions, repeatable",
    handoffs: "Intent to contact, repeatable",
    searchClicks: "From Search Console",
    searchImpressions: "Appearances in Google Search",
  };
  const names = {
    countries: "Countries",
    cities: "Cities",
    sources: "Traffic sources",
    products: "Product interest",
    sections: "Sections reached",
    events: "Website actions",
    devices: "Devices",
    queries: "Google search terms",
    pages: "Landing pages",
  };
  const num = (v) =>
    v === null || v === undefined ? "—" : new Intl.NumberFormat("en").format(v);
  const day = (s) =>
    s
      ? new Date(s + "T12:00:00Z").toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })
      : "Unknown dates";
  const yesterday = () => {
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(Date.now() - 86400000));
    return ["year", "month", "day"]
      .map((k) => parts.find((p) => p.type === k).value)
      .join("-");
  };
  const el = (tag, value, cls) => {
    const n = document.createElement(tag);
    if (value !== undefined) n.textContent = value;
    if (cls) n.className = cls;
    return n;
  };
  const defaults = {
    density: "comfortable",
    metric: "sessions",
    chart: "line",
    limit: "10",
    sort: "desc",
    tableStyle: "both",
    hideUnavailable: true,
    visible: [
      "users",
      "sessions",
      "productInterest",
      "handoffs",
      "views",
      "engagedSessions",
      "searchClicks",
      "searchImpressions",
    ],
  };
  let activeMode = "live";
  function analysisMode(mode) {
    activeMode = mode;
    const custom = mode === "custom";
    $("live-workspace").hidden = custom;
    $("custom-workspace").hidden = !custom;
    $("live-mode").setAttribute("aria-pressed", String(!custom));
    $("custom-mode").setAttribute("aria-pressed", String(custom));
    $("rail-status").textContent = custom
      ? current
        ? "Analysis report loaded"
        : "Choose a data source"
      : "Live Google report";
  }
  $("live-mode").onclick = () => analysisMode("live");
  $("custom-mode").onclick = () => analysisMode("custom");
  document.querySelectorAll(".rail nav a").forEach((a) =>
    a.addEventListener("click", () => {
      if (["#explore", "#insights"].includes(a.hash)) analysisMode("custom");
    }),
  );
  let prefs = { ...defaults, visible: [...defaults.visible] },
    full = null,
    current = null,
    previous = null,
    loadOrigin = null,
    connectionBusy = false;
  const library = [];
  $("report-library").onchange = () => {
    const entry = library[Number($("report-library").value)];
    if (entry) setReport(entry, "library");
  };
  try {
    const p = JSON.parse(
      localStorage.getItem("vayam-studio-display") || "null",
    );
    if (p && typeof p === "object") {
      for (const k of [
        "density",
        "metric",
        "chart",
        "limit",
        "sort",
        "tableStyle",
      ])
        if (typeof p[k] === "string") prefs[k] = p[k];
      if (Array.isArray(p.visible) && p.visible.length)
        prefs.visible = p.visible.filter((k) => E.metricKeys.includes(k));
      if (typeof p.hideUnavailable === "boolean")
        prefs.hideUnavailable = p.hideUnavailable;
    }
  } catch (_) {}
  if (!E.metricKeys.includes(prefs.metric)) prefs.metric = "sessions";
  if (!["comfortable", "compact"].includes(prefs.density))
    prefs.density = "comfortable";
  if (!["line", "bars"].includes(prefs.chart)) prefs.chart = "line";
  if (!["5", "10", "25", "500"].includes(prefs.limit)) prefs.limit = "10";
  if (!["desc", "asc", "name"].includes(prefs.sort)) prefs.sort = "desc";
  if (!["both", "chart", "table"].includes(prefs.tableStyle))
    prefs.tableStyle = "both";
  if (!prefs.visible.length) prefs.visible = [...defaults.visible];
  function savePrefs() {
    try {
      localStorage.setItem("vayam-studio-display", JSON.stringify(prefs));
    } catch (_) {}
  }
  function message(s) {
    $("message").textContent = s;
    $("message").hidden = !s;
  }
  function applyPrefs() {
    $("hide-unavailable").checked = prefs.hideUnavailable;
    document.body.classList.toggle("compact", prefs.density === "compact");
    $("density").value = prefs.density;
    $("chart-style").value = prefs.chart;
    $("row-limit").value = prefs.limit;
    $("row-sort").value = prefs.sort;
    $("table-style").value = prefs.tableStyle;
  }
  function setReport(data, origin = "import") {
    const validated = E.validate(data);
    if (origin === "import") {
      library.push(validated);
      const o = el("option", validated.label);
      o.value = String(library.length - 1);
      $("report-library").append(o);
      $("report-library").value = o.value;
    }
    if (["google", "sample"].includes(origin))
      $("report-library").selectedIndex = -1;
    $("library-label").hidden = !library.length;
    full = validated;
    current = validated;
    if (current.metrics[prefs.metric] === null) {
      const available = E.metricKeys.filter(
        (k) => prefs.visible.includes(k) && current.metrics[k] !== null,
      );
      prefs.metric =
        available.find((k) =>
          current.daily.some((r) => r[k] !== null && r[k] !== undefined),
        ) ||
        available[0] ||
        prefs.metric;
    }
    previous = null;
    loadOrigin = origin;
    $("connection-status").textContent = "";
    if (origin !== "google") G.disconnect();
    $("period-preset").value = "full";
    $("row-search").value = "";
    setupDates();
    render();
    message("");
  }
  function setupDates() {
    const p = full?.period;
    for (const id of ["date-start", "date-end"]) {
      const i = $(id);
      i.disabled = !p;
      if (p) {
        i.min = loadOrigin === "google" ? "2000-01-01" : p.start;
        i.max = loadOrigin === "google" ? yesterday() : p.end;
        i.value = id === "date-start" ? p.start : p.end;
      } else i.value = "";
    }
    for (const id of ["apply-dates", "reset-dates", "period-preset"])
      $(id).disabled = !p;
  }
  function render() {
    const sample = current?.source.kind === "sample";
    $("data-badge").textContent = !current
      ? "AWAITING DATA"
      : sample
        ? "FICTIONAL DEMO"
        : loadOrigin === "google"
          ? "GOOGLE · LAST FETCH"
          : "SAVED REPORT";
    $("data-badge").classList.toggle("sample", sample);
    $("rail-status").textContent =
      activeMode === "live"
        ? "Live Google report"
        : !current
          ? "Choose a data source"
          : sample
            ? "Fictional demo"
            : loadOrigin === "google"
              ? "Google data loaded"
              : "Saved data loaded";
    $("source-title").textContent = current
      ? current.label
      : "Connect your figures. Keep the context.";
    $("source-description").textContent = !current
      ? "Your live Google report is available above. Connect Google below or load a saved report to use these custom charts."
      : sample
        ? "Synthetic figures for trying the controls. They are not Vayam’s real visitors."
        : current.source.kind === "snapshot"
          ? "A dated snapshot of figures observed in the private report. Refresh or import a newer report when needed."
          : "Figures supplied by this report. Check source, dates and reporting notes before interpreting them.";
    $("source-meta").textContent = current
      ? current.source.name +
        " · Property: " +
        current.source.property +
        " · " +
        (current.period
          ? day(current.period.start) +
            " – " +
            day(current.period.end) +
            " · " +
            current.period.timeZone
          : "Dates not supplied") +
        (current.source.capturedAt
          ? " · Captured " +
            new Date(current.source.capturedAt).toLocaleString("en-GB")
          : "")
      : "No report loaded · Missing figures appear as —, never as invented zeroes.";
    $("period-label").textContent = current?.period
      ? E.days(current.period) +
        " calendar days" +
        (current.selection?.isSubset ? " · subset of saved report" : "")
      : "Load a dated report to filter";
    $("scope-note").textContent = current?.selection?.isSubset
      ? "Date subset: only available additive daily counts are recalculated. Unique users and full-period breakdowns are unavailable."
      : "Select a metric card to change the trend. The selected card turns green; all cards are interactive.";
    for (const id of ["compare-button", "export-report", "export-table"])
      $(id).disabled = !current;
    $("clear-button").hidden = !current;
    renderMetrics();
    renderTrend();
    renderBreakdown();
    renderComparison();
    renderInsights();
    renderConnection();
  }
  function renderMetrics() {
    const target = $("metrics");
    target.replaceChildren();
    if (
      current &&
      prefs.hideUnavailable &&
      current.metrics[prefs.metric] === null
    ) {
      prefs.metric =
        E.metricKeys.find(
          (k) => prefs.visible.includes(k) && current.metrics[k] !== null,
        ) || prefs.metric;
    }
    for (const key of E.metricKeys) {
      if (!prefs.visible.includes(key)) continue;
      if (current && prefs.hideUnavailable && current.metrics[key] === null)
        continue;
      const b = el("button", undefined, "metric");
      b.type = "button";
      b.dataset.metric = key;
      b.setAttribute("aria-pressed", String(prefs.metric === key));
      b.setAttribute(
        "aria-label",
        labels[key] + ": " + num(current?.metrics[key]) + ". Select trend",
      );
      const top = el("span", undefined, "metric-label");
      top.append(el("span", labels[key]), el("i", "↗"));
      b.append(
        top,
        el("strong", num(current?.metrics[key])),
        el(
          "small",
          current?.metrics[key] === null
            ? "Unavailable in this report"
            : short[key],
        ),
      );
      b.addEventListener("click", () => {
        prefs.metric = key;
        savePrefs();
        renderMetrics();
        renderTrend();
        $("trend-panel").scrollIntoView({ block: "nearest" });
      });
      target.append(b);
    }
    if (!target.children.length)
      target.append(
        el(
          "p",
          "No selected metrics were supplied. Open Customise to show unavailable cards, choose another report, or check the reporting notes.",
          "empty",
        ),
      );
  }
  function svg(tag, attrs = {}) {
    const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    return n;
  }
  function renderTrend() {
    const key = prefs.metric,
      rows = current?.daily || [],
      available = rows.some((r) => r[key] !== null && r[key] !== undefined),
      chart = $("trend-chart");
    $("trend-title").textContent = labels[key] + " over time";
    $("metric-explanation").textContent = help[key];
    $("daily-metric-name").textContent = labels[key];
    chart.replaceChildren();
    $("daily-body").replaceChildren();
    $("chart-empty").hidden = available;
    chart.hidden = !available;
    $("daily-details").hidden = !available;
    if (!available) {
      $("chart-empty").querySelector("strong").textContent = current
        ? "Daily " + labels[key].toLowerCase() + " were not supplied."
        : "Your trend will appear here.";
      $("chart-empty").querySelector("span").textContent = current
        ? "The period total may still be available above. Choose another metric or load a report with daily detail."
        : "Connect Google or import a report with daily figures. Try the fictional demo to test the controls.";
      return;
    }
    chart.setAttribute(
      "aria-label",
      labels[key] + " by date; exact values are in the daily table.",
    );
    const W = 960,
      L = 49,
      R = 942,
      T = 20,
      B = 222,
      max = Math.max(1, ...rows.map((r) => r[key] ?? 0)),
      scaleMax = Math.ceil(max * 1.12),
      first = Date.parse(rows[0].date),
      last = Date.parse(rows.at(-1).date),
      x = (i) =>
        L +
        ((R - L) * (Date.parse(rows[i].date) - first)) /
          Math.max(86400000, last - first),
      y = (v) => B - ((B - T) * v) / scaleMax;
    for (let i = 0; i <= 4; i++) {
      const gy = T + ((B - T) * i) / 4;
      chart.append(
        svg("line", { x1: L, x2: R, y1: gy, y2: gy, stroke: "#dce4d7" }),
      );
      const t = svg("text", {
        x: L - 9,
        y: gy + 4,
        "text-anchor": "end",
        fill: "#52665c",
        "font-size": 11,
      });
      t.textContent = num(Math.round(scaleMax * (1 - i / 4)));
      chart.append(t);
    }
    let path = "";
    rows.forEach((r, i) => {
      const v = r[key];
      const tr = el("tr");
      tr.append(el("td", day(r.date)), el("td", num(v)));
      $("daily-body").append(tr);
      if (v === null || v === undefined) {
        path += "|";
        return;
      }
      if (prefs.chart === "bars") {
        const bw = Math.max(2, Math.min(28, ((R - L) / rows.length) * 0.65));
        const bar = svg("rect", {
          x: x(i) - bw / 2,
          y: y(v),
          width: bw,
          height: B - y(v),
          rx: 2,
          fill: "#24583f",
        });
        const hint = svg("title");
        hint.textContent = day(r.date) + ": " + num(v);
        bar.append(hint);
        chart.append(bar);
      } else {
        path +=
          (i === 0 ||
          rows[i - 1]?.[key] === null ||
          rows[i - 1]?.[key] === undefined ||
          Date.parse(r.date) - Date.parse(rows[i - 1].date) > 86400000
            ? "M"
            : "L") +
          x(i) +
          " " +
          y(v) +
          " ";
        const dot = svg("circle", {
          cx: x(i),
          cy: y(v),
          r: 3.5,
          fill: "#24583f",
          tabindex: 0,
        });
        const hint = svg("title");
        hint.textContent = day(r.date) + ": " + num(v);
        dot.append(hint);
        chart.append(dot);
      }
      if (
        i === 0 ||
        i === rows.length - 1 ||
        i % Math.max(1, Math.ceil(rows.length / 5)) === 0
      ) {
        const t = svg("text", {
          x: x(i),
          y: 248,
          "text-anchor":
            i === 0 ? "start" : i === rows.length - 1 ? "end" : "middle",
          fill: "#52665c",
          "font-size": 11,
        });
        t.textContent = r.date.slice(5);
        chart.append(t);
      }
    });
    if (prefs.chart === "line")
      chart.append(
        svg("path", {
          d: path.replaceAll("|", ""),
          fill: "none",
          stroke: "#24583f",
          "stroke-width": 2.5,
          "stroke-linejoin": "round",
        }),
      );
  }
  function visibleRows() {
    let rows = (current?.breakdowns[$("breakdown").value] || []).filter((r) =>
      r.name.toLowerCase().includes($("row-search").value.trim().toLowerCase()),
    );
    rows = [...rows].sort((a, b) =>
      prefs.sort === "name"
        ? a.name.localeCompare(b.name)
        : a.value === null
          ? 1
          : b.value === null
            ? -1
            : prefs.sort === "asc"
              ? a.value - b.value
              : b.value - a.value,
    );
    return rows.slice(0, Number(prefs.limit));
  }
  function renderBreakdown() {
    const key = $("breakdown").value,
      all = current?.breakdowns[key] || [],
      rows = visibleRows(),
      has = rows.length > 0,
      mixedMeasures = new Set(rows.map((r) => r.metric)).size > 1;
    $("breakdown-title").textContent = names[key];
    $("row-count").textContent =
      rows.length + " OF " + all.length + " AVAILABLE ROWS";
    $("breakdown-caption").textContent =
      names[key] + " · counts for the loaded period";
    $("breakdown-note").textContent =
      (key === "cities" || key === "countries"
        ? "Locations are approximate. "
        : "") +
      (key === "events" || key === "products" || key === "sections"
        ? "Actions may repeat; these are not unique buyers. "
        : "") +
      "The measure column identifies what is counted. Available rows may be a top subset; do not treat their sum as the site total.";
    $("breakdown-body").replaceChildren();
    $("breakdown-bars").replaceChildren();
    $("breakdown-empty").hidden = has;
    $("breakdown-table-wrap").hidden =
      !has || (prefs.tableStyle === "chart" && !mixedMeasures);
    $("breakdown-bars").hidden =
      !has || prefs.tableStyle === "table" || mixedMeasures;
    if (mixedMeasures)
      $("breakdown-note").textContent +=
        " These rows use different measures, so they are shown as a table without comparing bar lengths.";
    if (!has) {
      $("breakdown-empty").querySelector("strong").textContent = all.length
        ? "No rows match your search."
        : current?.selection?.isSubset
          ? "Full-period table hidden for this date subset."
          : "No " + names[key].toLowerCase() + " supplied.";
      $("breakdown-empty").querySelector("span").textContent = all.length
        ? "Clear the search or choose another view."
        : current?.selection?.isSubset
          ? "Reset to the full report or fetch/import the selected dates to see a correctly scoped breakdown."
          : "Choose another view, refresh connected Google data, or use the live provider report for this detail.";
      return;
    }
    const max = Math.max(1, ...rows.map((r) => r.value ?? 0));
    for (const r of rows) {
      const tr = el("tr");
      tr.append(
        el("td", r.name + (r.country ? " · " + r.country : "")),
        el("td", labels[r.metric] || r.metric),
        el("td", num(r.value)),
      );
      $("breakdown-body").append(tr);
      const row = el("div", undefined, "bar-row"),
        track = el("div", undefined, "track"),
        fill = el("i");
      fill.style.width = (r.value === null ? 0 : (r.value / max) * 100) + "%";
      track.append(fill);
      row.append(
        el("span", r.name, "label"),
        track,
        el("span", num(r.value), "count"),
      );
      $("breakdown-bars").append(row);
    }
  }
  function renderComparison() {
    const panel = $("comparison-panel");
    panel.hidden = !previous || !current;
    $("comparison-results").replaceChildren();
    if (panel.hidden) return;
    const c = E.compare(current, previous);
    $("comparison-status").textContent = c.compatible
      ? "Compared with " +
        previous.label +
        " · " +
        day(previous.period.start) +
        " – " +
        day(previous.period.end) +
        ". Equal-length periods; a change is not proof of a cause."
      : c.reasons.join(" ");
    if (!c.compatible) return;
    for (const k of E.metricKeys) {
      const m = c.metrics[k],
        card = el("div", undefined, "comparison-card");
      let delta =
        m.delta === null
          ? "Unavailable"
          : m.delta === 0
            ? "No change"
            : (m.delta > 0 ? "+" : "−") + num(Math.abs(m.delta));
      let percent =
        m.percent === null
          ? m.status === "no-baseline"
            ? "No prior baseline"
            : m.status === "unchanged-zero"
              ? "Both periods recorded zero"
              : "Metric unavailable"
          : (m.percent > 0 ? "+" : "") + m.percent.toFixed(1) + "%";
      card.append(el("strong", labels[k]), el("b", delta), el("span", percent));
      $("comparison-results").append(card);
    }
  }
  function renderInsights() {
    const target = $("insight-grid");
    target.replaceChildren();
    const items = current
      ? E.insights(current, previous ? E.compare(current, previous) : undefined)
      : [
          {
            tone: "notice",
            title: "Start with your actual figures",
            detail:
              "The Google report is connected already. These custom views need a Google connection or saved report.",
            action:
              "Open the live report above, or try the demo to learn the controls before importing your data.",
          },
        ];
    for (const item of items) {
      const card = el("article", undefined, "insight-card " + item.tone);
      card.append(
        el("h3", item.title),
        el("p", item.detail),
        el("p", "Next step: " + item.action, "next"),
      );
      target.append(card);
    }
    const list = $("quality-notes");
    list.replaceChildren();
    const notes = current
      ? [
          ...current.notes,
          ...(current.selection?.notes || []),
          "Counts depend on provider coverage and visitor choices; early testing traffic can affect results.",
          "Contact handoffs are repeated actions, not confirmed messages or orders.",
        ]
      : [
          "No private report is bundled with this public page.",
          "Imported reports and Google tokens stay in memory and clear when this page reloads.",
        ];
    if (current?.source.kind === "snapshot")
      notes.unshift(
        "Snapshot only: these figures do not refresh automatically.",
      );
    const d = current ? E.derived(current) : null;
    if (d?.engagementRate !== null && d?.engagementRate !== undefined)
      notes.push(
        "Engagement rate: " +
          d.engagementRate.toFixed(1) +
          "% of recorded sessions.",
      );
    if (d?.searchCTR !== null && d?.searchCTR !== undefined)
      notes.push("Search click-through rate: " + d.searchCTR.toFixed(1) + "%.");
    for (const n of [...new Set(notes)]) list.append(el("li", n));
  }
  function renderConnection() {
    const yes = G.isConnected();
    $("connect-button").hidden = yes;
    $("refresh-button").hidden = !yes || loadOrigin !== "google";
    $("disconnect-button").hidden = !yes;
  }
  function download(content, name, type) {
    const url = URL.createObjectURL(new Blob([content], { type })),
      a = el("a");
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function sampleReport() {
    const old = window.VAYAM_DASHBOARD_SAMPLE,
      base = "2026-09-",
      daily = old.trend.map((r) => ({
        date: base + String(r[0]).padStart(2, "0"),
        users: r[1],
        sessions: Math.round(r[1] * 1.4),
        views: r[1] * 2,
        engagedSessions: Math.round(r[1]),
        handoffs: r[2],
      })),
      total = (k) => daily.reduce((s, r) => s + (r[k] || 0), 0),
      breakdowns = Object.fromEntries(E.breakdownKeys.map((k) => [k, []]));
    for (const k of ["countries", "cities", "sources", "products", "sections"])
      breakdowns[k] = old[k].map(({ name, value, country, code }) => ({
        name,
        value,
        metric:
          k === "sources"
            ? "sessions"
            : k === "products"
              ? "productInterest"
              : k === "sections"
                ? "events"
                : "users",
        ...(country ? { country } : {}),
        ...(code ? { code } : {}),
      }));
    return {
      schemaVersion: 2,
      label: "Fictional demonstration · September",
      source: {
        name: "Fictional demo",
        property: "demo-only",
        kind: "sample",
        capturedAt: null,
      },
      period: {
        start: "2026-09-01",
        end: "2026-09-28",
        timeZone: "Asia/Kolkata",
      },
      metrics: {
        users: 1120,
        sessions: total("sessions"),
        views: total("views"),
        engagedSessions: total("engagedSessions"),
        productInterest: 438,
        handoffs: total("handoffs"),
        searchClicks: null,
        searchImpressions: null,
      },
      daily,
      breakdowns,
      notes: [
        "All figures are fictional and are included only to demonstrate interaction.",
        "Demo breakdowns show illustrative rows; they do not describe Vayam traffic.",
      ],
    };
  }
  async function importFile(event, compare) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1500000)
        throw Error("Choose a JSON report below 1.5 MB.");
      const report = E.validate(JSON.parse(await file.text()));
      if (compare) {
        if (!current) throw Error("Load the current report first.");
        previous = report;
        renderComparison();
        renderInsights();
        message(
          "Comparison loaded; compatibility is checked before any changes are calculated.",
        );
      } else setReport(report);
    } catch (err) {
      message(err.message + " Your previous display has been kept.");
    }
    event.target.value = "";
  }
  $("import-button").onclick = () => $("import-file").click();
  $("compare-button").onclick = () => $("compare-file").click();
  $("import-file").onchange = (e) => importFile(e, false);
  $("compare-file").onchange = (e) => importFile(e, true);
  $("sample-button").onclick = () => setReport(sampleReport(), "sample");
  $("clear-button").onclick = () => {
    G.disconnect();
    library.length = 0;
    $("report-library").replaceChildren();
    $("library-label").hidden = true;
    $("connection-status").textContent = "";
    full = current = previous = null;
    loadOrigin = null;
    setupDates();
    render();
    message("Report data cleared from this tab.");
  };
  $("clear-comparison").onclick = () => {
    previous = null;
    renderComparison();
    renderInsights();
  };
  $("paste-button").onclick = () => {
    $("paste-status").textContent = "";
    $("paste-dialog").showModal();
  };
  $("load-pasted").onclick = () => {
    try {
      const report = E.validate(JSON.parse($("paste-json").value));
      if ($("paste-purpose").value === "comparison") {
        if (!current) throw Error("Load the current report first.");
        previous = report;
        renderComparison();
        renderInsights();
      } else setReport(report);
      $("paste-json").value = "";
      $("paste-dialog").close();
      message(
        "Saved report loaded in this tab. Check its source and date range.",
      );
    } catch (err) {
      $("paste-status").textContent =
        err.message + " Your previous display is unchanged.";
    }
  };
  $("date-form").onsubmit = async (e) => {
    e.preventDefault();
    if (!full) return;
    try {
      const start = $("date-start").value,
        end = $("date-end").value;
      if (loadOrigin === "google") {
        if (!G.isConnected())
          throw Error(
            "Your Google session expired. Connect Google again to request these dates.",
          );
        await fetchGoogle(start, end);
      } else {
        current = E.selectPeriod(full, start, end);
        render();
        message(
          current.selection?.isSubset
            ? "Applied the date subset. Tables from the original period are hidden to keep their scope clear."
            : "Showing the full report.",
        );
      }
    } catch (err) {
      message(err.message);
    }
  };
  $("reset-dates").onclick = () => {
    if (full) {
      current = full;
      setupDates();
      $("period-preset").value = "full";
      render();
      message("Full report restored.");
    }
  };
  $("period-preset").onchange = () => {
    if (!full?.period) return;
    const value = $("period-preset").value;
    $("date-end").value = full.period.end;
    if (value === "full") $("date-start").value = full.period.start;
    else if (value !== "custom") {
      const dt = new Date(full.period.end + "T12:00:00Z");
      dt.setUTCDate(dt.getUTCDate() - Number(value) + 1);
      $("date-start").value = [full.period.start, dt.toISOString().slice(0, 10)]
        .sort()
        .at(-1);
    }
  };
  $("chart-style").onchange = () => {
    prefs.chart = $("chart-style").value;
    savePrefs();
    renderTrend();
  };
  for (const id of [
    "breakdown",
    "row-search",
    "row-sort",
    "row-limit",
    "table-style",
  ])
    $(id).addEventListener(id === "row-search" ? "input" : "change", () => {
      prefs.sort = $("row-sort").value;
      prefs.limit = $("row-limit").value;
      prefs.tableStyle = $("table-style").value;
      savePrefs();
      renderBreakdown();
    });
  $("export-report").onclick = () => {
    if (current)
      download(
        JSON.stringify(current, null, 2),
        "vayam-report-" + (current.period?.end || "undated") + ".json",
        "application/json",
      );
  };
  $("export-table").onclick = () => {
    if (!current) return;
    const key = $("breakdown").value;
    const report = {
      ...current,
      breakdowns: { ...current.breakdowns, [key]: visibleRows() },
    };
    download(
      E.toCSV(report, { type: key }),
      "vayam-" + key + ".csv",
      "text/csv;charset=utf-8",
    );
  };
  $("print-button").onclick = () => window.print();
  $("settings-button").onclick = () => {
    analysisMode("custom");
    $("settings-dialog").showModal();
  };
  $("density").onchange = () => {
    prefs.density = $("density").value;
    savePrefs();
    applyPrefs();
  };
  $("hide-unavailable").onchange = () => {
    prefs.hideUnavailable = $("hide-unavailable").checked;
    savePrefs();
    renderMetrics();
  };
  function metricOptions() {
    const target = $("metric-options");
    target.replaceChildren();
    for (const k of E.metricKeys) {
      const l = el("label"),
        i = el("input");
      i.type = "checkbox";
      i.value = k;
      i.checked = prefs.visible.includes(k);
      i.onchange = () => {
        const selected = [...target.querySelectorAll("input:checked")].map(
          (n) => n.value,
        );
        if (!selected.length) {
          i.checked = true;
          return;
        }
        prefs.visible = selected;
        if (!selected.includes(prefs.metric)) prefs.metric = selected[0];
        savePrefs();
        renderMetrics();
        renderTrend();
      };
      l.append(i, el("span", labels[k]));
      target.append(l);
    }
  }
  $("reset-settings").onclick = () => {
    prefs = { ...defaults, visible: [...defaults.visible] };
    savePrefs();
    applyPrefs();
    metricOptions();
    render();
  };
  $("connect-button").onclick = async () => {
    $("connect-dialog").showModal();
    $("google-authorise").disabled = true;
    $("google-status").textContent = "Preparing Google sign-in…";
    try {
      await G.prepare();
      $("google-status").textContent =
        "Ready. Continue to Google to choose your account.";
    } catch (err) {
      $("google-status").textContent = err.message;
    } finally {
      $("google-authorise").disabled = false;
    }
  };
  $("google-authorise").onclick = async () => {
    if (connectionBusy) return;
    connectionBusy = true;
    $("google-authorise").disabled = true;
    $("google-status").textContent =
      "Waiting for Google account selection and read-only approval…";
    try {
      await G.connect($("client-id").value.trim());
      $("connect-dialog").close();
      const end = yesterday(),
        d = new Date(end + "T12:00:00Z");
      d.setUTCDate(d.getUTCDate() - 27);
      await fetchGoogle(d.toISOString().slice(0, 10), end);
    } catch (err) {
      $("google-status").textContent = err.message;
      message(err.message);
    } finally {
      connectionBusy = false;
      $("google-authorise").disabled = false;
      renderConnection();
    }
  };
  async function fetchGoogle(start, end) {
    $("refresh-button").disabled = true;
    $("connection-status").textContent = "Fetching GA4 reports…";
    try {
      const report = await G.fetchReport({ start, end });
      setReport(report, "google");
      $("connection-status").textContent =
        "Google figures refreshed. Search Console is available in the linked live report.";
    } catch (err) {
      message(err.message + " Existing data is unchanged.");
      $("connection-status").textContent = "Refresh did not complete.";
      throw err;
    } finally {
      $("refresh-button").disabled = false;
      renderConnection();
    }
  }
  $("refresh-button").onclick = () => {
    if (full?.period)
      fetchGoogle(full.period.start, full.period.end).catch(() => {});
  };
  $("disconnect-button").onclick = () => {
    G.disconnect();
    library.length = 0;
    $("report-library").replaceChildren();
    $("library-label").hidden = true;
    full = current = previous = null;
    loadOrigin = null;
    setupDates();
    render();
    message(
      "Disconnected. Google token and displayed report cleared from this tab.",
    );
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          document.querySelectorAll(".rail nav a").forEach((a) => {
            const active = a.hash === "#" + entry.target.id;
            a.classList.toggle("active", active);
            if (active) a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
          });
        }
    },
    { rootMargin: "-10% 0px -65% 0px" },
  );
  for (const id of ["overview", "explore", "insights", "guide"])
    observer.observe($(id));
  applyPrefs();
  metricOptions();
  setupDates();
  render();
})();
