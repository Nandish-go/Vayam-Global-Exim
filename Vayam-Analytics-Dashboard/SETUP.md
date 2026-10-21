# Visitor measurement and search discovery

Checkpoint: 21 October 2026. There is no confirmed Vayam analytics account or measurement ID. The owner corrected the earlier Umami selection; do not treat it as an existing account. Google Business Profile is the known service. Its account access and Search Console ownership still need verification.

## What is ready in this branch

The original business homepage now loads the integration from this folder. Its visual design, contact information, map and enquiry workflow are retained. All providers are off in `integration/analytics-config.js`. No banner or tracking request appears in that default state. `privacy.html` at the repository root describes this disabled status and the optional services.

| Signal | Events or reporting source | Interpretation |
|---|---|---|
| Visits, countries, approximate cities, devices and sources | Connected analytics provider | Measured audience, subject to the provider's location accuracy and missing/blocked visits |
| Product interest | `product_interest` with five fixed category codes | Which product-group enquiry links were selected |
| Sections and navigation | `section_view`, `navigation` | Sections reached and navigation choices, not proof that copy was read |
| Engagement | `scroll_depth`, `visible_time` | Depth and visible-time milestones |
| Enquiry friction | `rfq_start`, `rfq_field`, `rfq_validation` | Form started, filled/empty flags, field validation failures |
| Enquiry intent | `rfq_prepared`, `contact_handoff` | WhatsApp/email preparation and contact-link clicks; not received leads |
| Buyer questions and directions | `faq_open`, `map_open` | Use of FAQ and directions links |
| Campaigns | `campaign` | Allowlisted source/medium/campaign labels; unknown values grouped as `other` |
| Reliability | `technical_error` | Script, resource or promise failure category; no stack trace or page contents |

`integration/measurement-schema.js` limits event fields to these enumerations and counts. Form values, email, phone, message contents, raw query strings and detailed referrers are excluded. It never identifies a visitor by name. The provider may derive approximate geography from a connection; this does not reveal who a visitor is.

## Connect a real account

Use a business-owned account. There are two prepared choices; neither has been provisioned or purchased in this work.

1. **Google Analytics 4:** create or locate the Vayam property and its web stream for `https://vayam-global.com`. Copy the public `G-...` measurement ID into `ga4MeasurementId`, then enable `ga4Enabled` in a reviewed release. The tag loads only after the visitor accepts the optional analytics panel. Declining keeps it unloaded. Turn off automatic enhanced measurement for forms, outbound links and search to avoid duplicate/custom text collection. Keep Google Signals and advertising features off for this setup. Register required custom dimensions from the event table. Validate actual requests and Realtime/DebugView before treating data as live.
2. **Umami:** an optional alternative requiring a separate website/account. The prepared adapter expects an Umami Cloud website UUID. Set `websiteId` and `enabled` only after confirming ownership, service terms and the deployment's measurement requirements. No `identify()` or persistent custom visitor ID is used. A self-hosted script address needs a reviewed code change; do not paste an arbitrary script URL into the site.

Both options require an enabled flag, a valid public ID, HTTPS and an exact approved production hostname. Development and shared review hosts never activate this integration. Browser Do Not Track and Global Privacy Control disable it. GA4 has a choice control only when enabled. Cookieless measurement is not a blanket exemption from all requirements; confirm the chosen service's deployment requirements before activation.

No passwords, API tokens, OAuth credentials or visitor-level exports belong in Git. `.env` and `private-reports/` are ignored. The dashboard is a public-code prototype with sample data and an in-tab JSON importer; it is not an authenticated analytics backend. Its validation rejects malformed or negative counts. Real report access needs a private provider dashboard or an authenticated export/backend. Do not make a private API key part of a static dashboard.

## Test without collecting visitors

From the repository root, run the VS Code task **Vayam: preview websites**. Open `http://127.0.0.1:8770/current/?analytics_preview=1`. Interactions appear in the browser console using `VayamAnalyticsPreview.events()`. Adding `&consent_preview=1` previews the optional panel without loading Google. Reloading clears the event trace.

Run **Vayam: build and verify everything** for the dependency-free checks. `tests/browser-smoke.cjs` adds browser QA when Playwright and Microsoft Edge are available, with the preview server running. It intercepts external requests and tests only local pages; it does not send an actual enquiry or prove provider ingestion. The image preparation helper requires Sharp only when regenerating image assets; normal preview/build uses the committed files.

## Search Console and worldwide visibility

The public homepage returned HTTP 200 on 21 October 2026. Its `robots.txt` and `sitemap.xml` returned 404. This branch prepares both files for a future production release. The sitemap contains only the canonical homepage and privacy notice; the four design previews and dashboard stay `noindex`.

After releasing the selected production files:

1. Verify ownership of `vayam-global.com` in [Google Search Console](https://search.google.com/search-console). A Domain property uses a DNS verification record; confirm the correct DNS account before any record change. Do not invent verification tokens.
2. Submit `https://vayam-global.com/sitemap.xml`. Use URL Inspection for the homepage, then review indexing reasons. A valid sitemap helps discovery but does not guarantee inclusion or rankings.
3. Use Search Console Performance to inspect queries, country, device, impressions, clicks and click-through rate. Read these separately from on-site visits and Business Profile interactions.
4. Verify the existing Business Profile's website link. A suitable campaign link is `https://vayam-global.com/?utm_source=google&utm_medium=organic&utm_campaign=business_profile`; this is prepared guidance, not a change made to the listing.
5. For other engines, verify the site in [Bing Webmaster Tools](https://www.bing.com/webmasters/) and submit the same sitemap. No submissions or verification records have been made in this work.

The current content already describes international sourcing. Real product/category pages with useful specifications can later expand that content. Avoid fabricated destination pages, keyword stuffing, invented stock, prices, ratings or certifications. Worldwide reach is not a guarantee of ranking in every market.

Sources checked for this implementation: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [GA4 events](https://developers.google.com/analytics/devguides/collection/ga4/events), [Umami tracker settings](https://docs.umami.is/docs/tracker-configuration). GA4 provides approximate location reporting, not a raw IP register; see [Google location/data guidance](https://support.google.com/analytics/answer/12017362).
