# Vayam Analytics Studio

Open [Vayam Analytics Studio](https://vayam-global.com/Vayam-Analytics-Dashboard/) in your browser. No desktop app is needed. This folder holds the dashboard, the existing production measurement integration, setup instructions and checks. It stays beside `Vayam-Development/` in the working repository; production releases include the analytics folder without the trial designs.

## Start with your live figures

The custom dashboard's direct Google Analytics connection was verified on **30 October 2026**. You do not need an imported file to view GA4 data.

1. Open the dashboard and choose **Custom analysis tools**.
2. Click **Connect Google**. The configured public client identifier is already filled in.
3. Click **Continue to Google**, select the authorised owner account and complete Google's read-only approval when requested. The dashboard then retrieves the GA4 report.

After loading, choose dates and **Apply dates**, select a metric card, or use **Explore data** to inspect breakdowns. **Refresh figures** retrieves the selected period again. Reconnect after a page reload or when Google access expires: figures and access tokens are held in memory only. The Google application remains in **Testing** for the authorised owner; this is not a general public sign-in service.

## Start with the connected report

Choose **Live connected report**, then **Open full screen**. Sign in with the authorised Google account; the existing report owner is `nandish072@gmail.com`. The [combined Website & Search Insights report](https://datastudio.google.com/u/0/reporting/8e538620-fcc2-482f-91c2-c09dce5f319a/page/Hqrp) reads its existing Google Analytics and Search Console connections automatically. Its five pages cover Home, Website interactions, Products & page attention, Contact & enquiry intent, and Audience & devices.

The optional **Show the live report inside this page** viewer depends on Google embedding and the browser's sign-in/cookie restrictions. If it is blank or asks for sign-in, use **Open full screen**. The report remains private; hosting this access page does not publish its data.

Use the report's own date selector. Home defaults to 30 complete days and the detail pages to 28, so align their dates before comparing figures. Early verification traffic is included. A missing comparison can mean collection had not started in the earlier period.

## Use the custom analysis tools

Choose **Custom analysis tools** for the editable Vayam interface. Use **Connect Google** for real GA4 data without imports. Saved reports and a clearly labelled fictional demo remain optional ways to use the same tools. The custom interface does not silently copy data from the embedded Google report.

1. **Load data:** use the three-step Google connection above, or choose **Import saved report** for a Vayam JSON file or **Paste report** for the same JSON text. Imported reports are validated before replacing the display and appear in **Reports loaded in this tab**, allowing you to switch between them during that session. A generic CSV or a Google export in another format is not automatically converted.
2. **Inspect a period:** select the full loaded period, a 7/14/28-day preset, or custom dates and press **Apply dates**. A connected GA4 report requests the selected dates from Google. Imported date subsets recalculate only complete, available additive daily figures. Unique users and full-period breakdown tables become unavailable for an imported subset because they cannot be recalculated correctly from those aggregates. **Reset** restores the loaded period.
3. **Choose a measurement:** click a metric card to change the trend. Select **Line** or **Bars** and open **View exact daily values** for the numerical table. Missing values appear as a dash; a recorded zero remains zero.
4. **Explore details:** choose countries, cities, traffic sources, devices, product interest, sections reached, website actions, Google search terms or landing pages. Availability depends on the loaded source. Search rows, sort them, choose Top 5/10/25 or all available rows, and show a chart, a table or both. The measure column identifies whether a value counts sessions, users, events or search activity. Available top rows need not add up to the site total.
5. **Compare:** use **Load comparison**, or select Comparison report in **Paste report**. Changes are calculated only for the same source/property/time zone and equal-length, non-overlapping periods. A missing baseline is explained rather than shown as an infinite percentage. Fictional and real data cannot be compared.
6. **Customise and keep evidence:** **Customise** selects metric cards, comfortable/compact spacing, and whether unavailable cards are hidden. Available cards are shown by default after loading a report. **Export table CSV** saves the currently displayed table rows; **Save report JSON** saves the selected report; **Print / PDF** uses the browser's print dialog. Exported files are private local copies and must stay outside public Git assets.

The **Insights & actions** area explains available signals and suggests a next check. It flags small samples and distinguishes contact intent from received enquiries. Suggestions support investigation; they do not prove what caused a change or recommend a redesign from a handful of visits. The reading guide provides a short weekly review routine.

Only display preferences are remembered on this device. Imported reports, the report library and Google access tokens stay in tab memory and clear on reload. **Clear data** clears the loaded reports and connection from this tab. **Try fictional demo** is for learning controls; it does not show actual Vayam statistics.

## Direct Google connection status

The direct connector is **live and verified as of 30 October 2026**. The owner's Google sign-in and read-only approval succeeded on the deployed dashboard, and a real GA4 report for **2–29 October 2026** loaded without errors. No private counts or report contents are included in the public source.

The connector uses the free GA4 Analytics Data API, Google's browser sign-in library and the `analytics.readonly` scope for property **560596894**. The owner-approved `vayam-analytics` Cloud project, Data API and web client are configured, and the public client identifier is prefilled. The Google application remains in Testing for the authorised owner. Billing was left untouched; no paid trial or billing activation was used. See [the 30 October checkpoint](CHECKPOINT-2026-10-30.md) for the verification record and [GOOGLE-CONNECTION.md](GOOGLE-CONNECTION.md) for setup and maintenance instructions.

Use the public OAuth Client ID only. Never enter or commit a client secret, service-account key, password or access token. The connector holds short-lived access in memory and requests data directly from Google's API. It does not require a paid server, a paid trial or billing activation; Google API quotas apply.

The direct connector retrieves GA4 users, sessions, views, engagement and relevant event/breakdown reports. Search Console data continues to be available in the existing combined Google report; the GA4 connector does not fetch it. Search Console and GA4 have different reporting definitions and day boundaries. Private dated snapshots of either source may be loaded locally, but are not bundled in the public dashboard and do not refresh automatically.

## Individual tools

- [Google Analytics — Vayam Live Website](https://analytics.google.com/analytics/web/?authuser=info%40vayam-global.com#/a413315442p560596894/reports/intelligenthome): property **560596894**, stream **16192169327**, measurement ID **G-SB6RL77QJ4**. Use the authorised business Google account for administration.
- [Google Search Console — Vayam domain](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Avayam-global.com): discovery, search performance and indexing, using the verified domain owner's account.
- [Microsoft Clarity](https://clarity.microsoft.com/projects/view/z2xvqfy55k/dashboard): available heatmaps and session recordings, protected by the business account.

Analytics records measured activity after installation and visitor consent; older untracked visits cannot be recovered. Cities and countries are approximate. Email, phone and WhatsApp handoffs measure contact intent, not delivered messages, qualified leads or sales. Keep the count of actual received enquiries in private business records.

## Files and local review

- `index.html`, `dashboard.js`, `style.css`: the two dashboard modes, controls and responsive interface.
- `report-engine.js`: schema-version-2 validation, date selection, compatible comparisons, insights and CSV export. Older version-1 reports are accepted as undated/unverified imports; their dates are not invented.
- `google-connector.js`: direct GA4 read-only connector and in-memory access handling.
- `report-schema.js`, `sample-data.js`: retained legacy validation and explicitly fictional sample source.
- `integration/`: existing production consent, configuration, sanitized events and Clarity integration. Trial designs and the dashboard remain excluded from production tracking.
- `tools/preview-main.cjs`: local preview. From the repository root run `node Vayam-Analytics-Dashboard/tools/preview-main.cjs`, then open `http://127.0.0.1:8771/Vayam-Analytics-Dashboard/`.
- `tests/report-engine.cjs`, `tests/google-connector.cjs`: reporting and connector checks. Provider/production checks remain in `tests/analytics-gates.cjs` and `tests/site-readiness.cjs`; browser checks require their documented environment.
- `SETUP.md`, `GOOGLE-CONNECTION.md`: account steps and measurement definitions. The [30 October checkpoint](CHECKPOINT-2026-10-30.md) records the verified direct connection. The [28 October checkpoint](CHECKPOINT-2026-10-28.md) and [25 October checkpoint](CHECKPOINT-2026-10-25.md) preserve earlier release history; their progress statements describe those dates.

Private snapshots, report exports and screenshots belong in ignored `.local/` or `private-reports/` storage, or outside the repository. They must never be pushed as public assets. No private report is embedded in the committed source.
