# Free analytics and worldwide search setup

Updated 25 October 2026. GA4 is deployed and production events have been verified in Realtime. Search Console accepted the seven-page sitemap. The earlier Umami answer was a mistake; Umami remains disabled. No paid service or billing project has been activated.

## Account and website configuration

- GA4 account: Vayam Global Exim, property Vayam — Live Website, property ID 560596894.
- Stream: https://vayam-global.com/, measurement ID G-SB6RL77QJ4.
- India reporting time zone, INR. Detailed event retention set to 14 months; user retention 14 months. Retention-setting changes may take 24 hours.
- Enhanced measurement disabled so the site's explicit events avoid duplicate interactions and sending complete email/WhatsApp URLs. Standard page views are sent explicitly once per document after consent.
- Registered event dimensions: product group (`group`), contact channel (`channel`), page section (`section`), click placement (`placement`). Further dimensions can be registered for `field`, `percent`, `seconds`, `question`, `state`, `kind` as needed.
- Search Console: existing verified Domain property `sc-domain:vayam-global.com`. Do not create another property or change DNS unnecessarily.
- Microsoft Clarity: project Vayam — Live Website, ID `z2xvqfy55k`, created after owner acceptance of terms. Configured for consent-based heatmaps and replays with form masking; production ingestion must be verified after deployment.

## What the website measures

| KPI | Source/event | Meaning |
|---|---|---|
| Users, sessions, page views, country, city, device, browser, acquisition source | GA4 | Measured consenting audience; locations are approximate |
| Product category interest | `product_interest`, `group` | Product enquiry links clicked |
| Sections reached and navigation | `section_view`, `navigation` | Visibility and navigation choices, not proof of reading |
| Scroll and visible time | `scroll_depth`, `visible_time` | 25/50/75/100 percent and 30/60/120/300 second milestones |
| Enquiry start and friction | `rfq_start`, `rfq_field`, `rfq_validation` | Field names and filled/empty state only |
| Contact intent | `rfq_prepared`, `contact_handoff` | Email, WhatsApp or phone handoff; not a confirmed lead |
| FAQs and directions | `faq_open`, `map_open` | Questions opened and map-link clicks |
| Campaign attribution | `campaign` and GA4 campaign fields | Allowlisted source, medium and campaign labels |
| Basic reliability | `technical_error` | Script/resource/promise failure category |
| Google discovery | Search Console | Impressions, clicks, CTR, position, queries, pages, countries, devices and indexing |
| Heatmaps and replays | Clarity | Form content masked; consent required; reports appear after processing |

GA4 does not expose a raw visitor IP list or identify people by name. Ad blockers, consent choices, privacy controls and provider thresholds mean this cannot measure every visit. The website does not send enquiry contents as analytics. No backfill of earlier untracked visits is possible.

## Open and customize reporting

1. Open Google Analytics from README.md using the business Google account. Realtime confirms new traffic; standard reports may take 24–48 hours after collection starts.
2. Use Reports for acquisition, engagement, pages, technology and geography. Use Explore for funnels and registered custom dimensions. Mark `contact_handoff` as a key event when events arrive; label it contact intent, not a sale.
3. Use the native free Google Data Studio connectors for GA4 and Search Console. A private report copy has been started; verify the two data sources and all charts before relying on it. The source template covers Google organic traffic only. Add a separate all-traffic page for sessions, users, engagement, pages, devices, countries and contact intent.
4. The approved report-owner account now has Viewer access to the GA4 property as well as ownership of Search Console. Data Studio's separate Google Analytics connector is authorised and the Vayam property is connected. Chart configuration is still in progress. Keep report sharing Restricted; verify its sharing dialog before handing out the report link.
5. The repository dashboard supports local JSON reports and comparisons today. It does not contain an API key or authenticated backend. A future private data connector can populate its validated schema; do not publish actual report JSON beside public assets.

## SEO release and indexing

The production bundle contains the original homepage, five useful category pages, privacy page, real local responsive photographs, canonical and social metadata, Organization/WebSite/Breadcrumb structured data, robots.txt and a seven-URL sitemap. English content is available worldwide without a country gate. No invented country offices, stock guarantees, reviews or certifications are included.

The production URLs return 200. Current account tasks:

1. Completed: submitted `https://vayam-global.com/sitemap.xml` in the existing domain property on 24 October. Search Console shows **Success**, **7 discovered pages**, 0 videos. Discovery is not proof that every page is indexed.
2. Inspect the homepage and category URLs. Request indexing when offered; review coverage after Google recrawls. A sitemap does not guarantee indexing or ranking.
3. In Business Profile, use the website campaign link `https://vayam-global.com/?utm_source=google&utm_medium=organic&utm_campaign=business_profile`. This listing change has not been made automatically.
4. Connect Bing Webmaster Tools and submit the same sitemap. Its optional Google import requires the owner's account permission. This remains an account task until verified.
5. Review queries, pages and countries monthly. Improve content using actual buyer questions and documented product specifications; translation should be genuine, not keyword-stuffed duplicate destination pages.

## Verification

Run `node Vayam-Analytics-Dashboard/tests/analytics-gates.cjs` and `node Vayam-Analytics-Dashboard/tests/site-readiness.cjs`. Browser checks require Playwright and Microsoft Edge. `tests/production-browser.cjs` intercepts provider requests and checks consent, single page views, field-data boundaries, category photos and responsive layouts without sending test enquiries. `tests/browser-smoke.cjs` uses the development preview on port 8770 and tests all four candidates plus dashboard imports and comparisons. Local tests do not prove Google received production events.

A separate, consented visit to the deployed website was visible in GA4 Realtime on 24 October: page_view, session_start, first_visit, section_view, scroll_depth and visible_time. That Germany visit was a verification visit, not a new buyer. No enquiry was submitted. Standard reports need processing time and will not recover visits from before installation.

## Sources

[Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [GA4 events](https://developers.google.com/analytics/devguides/collection/ga4/events), [GA4 retention](https://support.google.com/analytics/answer/7667196), [Search Console and Analytics](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console), [Clarity consent](https://learn.microsoft.com/en-gb/clarity/setup-and-installation/clarity-consent-api-v2).
