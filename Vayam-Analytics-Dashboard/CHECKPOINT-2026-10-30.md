# Vayam Analytics Studio checkpoint — 30 October 2026

## Verified live connection

The owner completed Google sign-in and read-only approval from the deployed [Vayam Analytics Studio](https://vayam-global.com/Vayam-Analytics-Dashboard/). The custom dashboard retrieved a real GA4 report for **2–29 October 2026** without errors. This confirms the live account-to-dashboard data path, beyond the earlier local connector checks.

The dedicated `vayam-analytics` Google Cloud project, Analytics Data API and web OAuth client are configured. The public client identifier is prefilled in the dashboard. The application remains in **Testing** for the authorised owner; public visitors are not given access to Vayam's report data. Billing was left untouched. No paid trial or billing activation was used.

## Where to start

1. Open the dashboard and choose **Custom analysis tools**.
2. Click **Connect Google**.
3. Click **Continue to Google**, select the authorised owner account and complete Google's read-only approval when requested.

No file import is needed to load GA4 figures. Once connected, choose a metric card for its trend, select dates and **Apply dates**, or use **Explore data** to inspect the available country, city, source, device, product, section and action rows. **Refresh figures** retrieves the selected period again.

Reports and short-lived access tokens stay in tab memory. Reloading clears them, so reconnect after a reload or access expiry. Only display preferences are remembered on the device. A report JSON/CSV download is an optional private local copy, not an upload or public dashboard asset. Private counts, exported reports, credentials and screenshots are not included in this checkpoint or public source.

## Reporting scope

- The direct connection requests only GA4 read access for the existing Vayam property. Country, city, traffic source and device tables use sessions; product and section tables use their relevant event counts.
- Search Console is still accessed through the existing [combined Website & Search Insights report](https://datastudio.google.com/u/0/reporting/8e538620-fcc2-482f-91c2-c09dce5f319a/page/Hqrp), available under **Live connected report → Open full screen**. The direct GA4 connector does not fetch Search Console data.
- The combined report also remains useful for its five report pages and previous-period views. Its optional embedded viewer depends on browser sign-in restrictions.
- Saved JSON imports, Paste report, the in-tab report library and the clearly labelled fictional demo remain available as optional analysis paths. No real snapshot is bundled into the public page and snapshots do not refresh automatically.
- Missing values remain unavailable rather than fabricated zeroes. Daily unique users are not summed into period totals. Contact handoffs measure repeatable intent actions, not confirmed received enquiries or sales. Early testing traffic can affect results.

## Display and filter corrections

Live verification found that the daily SVG retained its initial `hidden` attribute even after receiving data. The renderer now explicitly toggles that attribute; both line and bar charts were visibly checked in the browser. Google date presets can also expand a previously fetched seven-day report back to 28 days, while imported reports remain limited to their supplied dates. Hiding unavailable metrics now refreshes the trend alongside the selected card.

The report-engine, Google-connector, analytics-gates and site-readiness checks passed after these corrections. Local browser checks covered actual SVG visibility and both chart styles. The live Google report also successfully refetched a selected seven-day period.

The dashboard stylesheet and scripts carry a release version in their URLs so returning browsers request the corrected files instead of keeping an older cached copy.

## Repository boundaries

Canonical working folder: `C:\Github Repos\Vayam-Global-Exim`. The working branch remains `vayam-dev-four-candidates`; `main` serves production. The analytics folder remains separate from the four trial designs. This documentation update does not delete, rename or rebuild the website designs, change report sharing, or publish private visitor data.

Use Git history and deployment results for exact published revisions. The [28 October checkpoint](CHECKPOINT-2026-10-28.md) and [25 October checkpoint](CHECKPOINT-2026-10-25.md) remain historical records. Their earlier pending-connection statements are superseded by the live verification above.
