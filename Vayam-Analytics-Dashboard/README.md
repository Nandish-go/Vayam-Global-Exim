# Vayam analytics workspace

This folder contains the public website's measurement integration and the editable dashboard interface. It belongs beside `Vayam-Development/` in the same working repository; production releases include this folder without the trial designs.

See [the 28 October checkpoint](CHECKPOINT-2026-10-28.md) for the completed five-page live report, access instructions and remaining search tasks. The [25 October checkpoint](CHECKPOINT-2026-10-25.md) preserves the earlier release history.

## Open your reports

- [Website & Search Insights — combined live report](https://datastudio.google.com/u/0/reporting/8e538620-fcc2-482f-91c2-c09dce5f319a/page/Hqrp): sign in as the report owner or the authorised business account. Overview combines GA4 visits and Search Console performance; Website interactions lists measured events. This Google-hosted report reads connected data automatically. It is separate from the local-import interface in this folder.
- [Google Analytics — Vayam Live Website](https://analytics.google.com/analytics/web/?authuser=info%40vayam-global.com#/a413315442p560596894/reports/intelligenthome): business-account sign-in. Property **560596894**, stream **16192169327**, measurement ID **G-SB6RL77QJ4**.
- [Google Search Console — domain performance](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Avayam-global.com): use the Google account that owns the verified domain property.
- [Microsoft Clarity — Vayam Live Website](https://clarity.microsoft.com/projects/view/z2xvqfy55k/dashboard): business-account sign-in; production sessions and recordings were verified on 25 October. Early verification visits are not confirmed buyer activity.
- Custom interface: run `node Vayam-Analytics-Dashboard/tools/preview-main.cjs` from the repository root, then open http://127.0.0.1:8771/Vayam-Analytics-Dashboard/.

Google sign-in protects live reports. The custom interface provides links to those reports plus local JSON imports and period comparisons; it does **not yet automatically download Google data**. It starts with no report loaded. **Show sample design** loads explicitly labelled fictional figures. Importing does not upload a file, save it in browser storage or put it in Git. A report's source and date range must be checked before interpreting comparisons.

## Pages in the live combined report

| Page | What to inspect |
|---|---|
| Home | Sessions, engagement, views, search clicks/impressions, trends, acquisition channels, search queries, landing pages and countries |
| Website interactions | Recorded event totals, sorted by count |
| Products & page attention | Product-group interest and sections reached, filtered to the relevant events |
| Contact & enquiry intent | Form starts, validation, prepared enquiries and contact handoffs by channel and placement |
| Audience & devices | Approximate city/country, device, browser and session source/medium |

Use each page's date selector before comparing figures: Home defaults to the last 30 complete days; detail pages default to the last 28 complete days. Table headers allow sorting. Home includes previous-period comparisons; a missing comparison is expected where collection had not started. No data on the contact page means no matching recorded events for that period, not proof that nobody contacted the business. Early verification traffic is included. The report remains editable through its **Edit** button for authorised editors.

## Files

- `integration/`: production consent, GA4 configuration, sanitized events and consent-based Clarity adapter.
- `index.html`, `dashboard.js`, `style.css`: editable custom reporting interface.
- `report-schema.js`, `sample-data.js`: validated import format and illustrative sample.
- `tools/build-discovery.cjs`: rebuild the five public category pages and sitemap from existing business facts and real photographs.
- `tools/preview-main.cjs`: serve only allowed public files locally on port 8771.
- `tests/`: provider gates, site metadata, dashboard import validation and browser checks.
- `SETUP.md`: free-service setup, KPI definitions, limitations and remaining account tasks.

Expected imports: `schemaVersion: 1`, `label`, `summary` with `visitors`, `visits`, `productInterest`, `handoffs`, plus arrays `trend`, `countries`, `sources`, `cities`, `products`, `sections`, `funnel`. Trend rows are `[dayNumber,dailyVisitors,handoffs]`; bar rows have `name,value`; city rows can have `country`; funnel rows have `name,count,detail`. Use the sample only as a structural example. There is no general GA4/CSV converter in this release.

All reporting code is safe to keep in Git, but private report exports and access credentials must remain outside public hosting. `.local/`, `private-reports/`, `.env` and dependencies are ignored. Clicks to email, phone or WhatsApp measure **contact intent**, not delivered enquiries or orders. Record confirmed leads separately in your private business records.
