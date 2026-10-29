# Connect the custom dashboard to Google Analytics

The combined Google Data Studio report already has its own connection. The custom Vayam dashboard is a separate application: Google requires its own read-only permission before it can retrieve private GA4 figures. Viewing the public dashboard page does not expose analytics data.

The connector uses the free GA4 Analytics Data API and Google's current browser sign-in library. It requests only `analytics.readonly` for the existing Vayam property **560596894**. No paid database, server or billing-dependent export is used. API quotas still apply. It does not retrieve Search Console data: that remains in the separate connected Google report, with its own reporting dates and definitions.

## One-time owner setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) in the account you want to manage the connection. Select or create a project dedicated to Vayam analytics. Do not enable billing merely for this connector.
2. In APIs & Services, enable **Google Analytics Data API**.
3. Configure the Google Auth Platform consent screen for the Vayam dashboard. If the application is in testing, add the Google account that already has Viewer access to Vayam GA4 as a test user. Use the read-only Analytics scope when configuring data access. An external application may require Google verification before broader use; the owner can use the testing configuration within Google's current rules.
4. Create an OAuth client of type **Web application**. Set the authorised JavaScript origin to `https://vayam-global.com`. Add `https://www.vayam-global.com` only if you use that hostname. For local development add `http://127.0.0.1:8771` (or the actual preview port) and `http://localhost:8771` if used.
5. Copy the **Client ID** ending in `.apps.googleusercontent.com` into the dashboard connection field. A Client ID is a public application identifier; a client secret, service-account key, API key or password is not needed and must never be entered there.
6. Click **Connect Google**. Select the Google account that can view the existing Vayam property, review Google's read-only permission prompt yourself, and approve it if you agree. Creating this application and approving its new access must be done by or explicitly approved by the owner.
7. Choose dates and load the report. Google access expires after a short period; click Connect Google again when requested. Merely reloading the page drops this tab's token and report.

The origin must match exactly, including the preview port. If Google reports `origin_mismatch`, correct the client's authorised origins. If it reports an access-denied or unverified-app restriction, check the consent screen and test users; do not bypass a browser security warning.

## How the data is interpreted

- Visitors use GA4 `totalUsers`; visits use `sessions`; views use `screenPageViews`; engagement uses `engagedSessions / sessions` when both totals exist.
- Product interest counts only `product_interest`. Contact handoffs count only `contact_handoff`; prepared forms and handoffs are not added together as if they were unique leads.
- Country, city, traffic-source and device tables use sessions. The product and section tables use their relevant event counts. Daily users must not be summed to produce a period-wide unique visitor count.
- Report dates use the GA4 property's reporting time zone. A daily row missing from the API is not invented as zero. An unavailable metric displays unavailable instead of zero.
- Custom dimensions `group` and `section` must already be registered in GA4. New custom-dimension data cannot be recovered for periods before registration. If one table is unavailable, other successful reports remain usable and the dashboard shows a note.
- Google may apply thresholds, sampling or row limits. The connector records these conditions in report notes where the API provides them. Top-row tables need not add up to the full property total.
- Early testing traffic may be included. A WhatsApp/email handoff is an interaction, not proof of a received enquiry or sale.

## Where access and reports stay

The short-lived Google access token is held in JavaScript memory only. It is not placed in a URL, localStorage, cookies, a download, Git or an analytics event. **Disconnect Google** clears the tab's token; it does not change the Google account's persistent permission grant. To revoke that grant, use Google's account permissions page yourself.

Reports are fetched directly from Google's official Data API over HTTPS. A report-file import is processed only in the current tab. Export a report only when you want a private local copy; never commit that export to this public repository. Private snapshots belong in an ignored `.local/` folder or outside the repository.

Official references: [Google Identity Services token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model), [OAuth client setup](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid), [GA4 runReport API](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport), [GA4 reporting schema](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema).
