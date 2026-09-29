# Measurement and worldwide discovery

Prepared 28 September 2026 for review before account setup or production release.

The objective is worldwide visibility: buyers in any country should be able to discover Vayam, understand the range and make a useful enquiry. Regional examples in the previews are enquiry aids. They do not limit the audience or establish import eligibility. The destination field accepts any country, with an “Another market” region option.

## What is implemented

All four active candidates use `shared/analytics.js`, one consent-aware GA4 adapter and one event vocabulary. Tracking is disabled in `shared/config.js`; the measurement ID is empty. Localhost, unapproved hosts and disabled configurations never load the Google tag, including after an “Allow analytics” choice. The preview event inspector shows an ephemeral, sanitised trace of real interactions, capped at 200 entries and cleared on reload.

In the enabled production path, the Google tag loads only after acceptance. Advertising storage, advertising user data, advertising personalisation and Google Signals are disabled in the implementation. Declining stops further custom collection and attempts to clear GA cookies for the domain. This does not erase data already processed by Google. This is a tested technical foundation, not a claim that the future deployment meets every legal or service requirement.

No GA4 property or GTM container was created, connected or published during this work. The current public main site remains uninstrumented. Google Analytics showed no accessible property in the three signed-in accounts inspected during the audit; another account could own an unknown property. Source inspection found no existing GA4/GTM IDs in the inspected website code. Confirm ownership before creating a duplicate account.

## Recommended architecture

Use direct GA4 initially for this static site, with Search Console for Google organic discovery, Business Profile for the business listing and a separate private lead register for confirmed business outcomes. Keep the custom event schema in version control. The prepared adapter is the concrete direct-GA4 implementation. [Google's event documentation](https://developers.google.com/analytics/devguides/collection/ga4/events) describes the underlying collection mechanism.

| Choice | Benefits for Vayam | Tradeoff | Recommendation |
|---|---|---|---|
| Direct GA4, consent-gated code | Small integration, predictable payloads, changes reviewed with the website | Event changes require a code release; property settings still matter | Initial choice |
| Google Tag Manager | Useful when several approved vendors or a marketing team need managed tag changes | Extra publishing surface, permissions and consent rules; easy to duplicate tags or bypass the field whitelist | Reconsider when those needs exist |
| Host analytics | Useful for delivery/request trends and a broad operational view | Does not replace the custom product/enquiry funnel; definitions differ from GA4 | Optional supporting layer |
| Session replay / heatmaps | Can reveal some usability problems | A separate processor, masking and consent review; enquiry fields are particularly sensitive | Not enabled; decide after normal funnel evidence exists |

Do not install direct GA4 and a GTM GA4 tag simultaneously. A GTM migration should keep the same taxonomy and consent boundary, and retire the old sender in the same release.

## Event design

Every event carries an allowed variant value: `classic`, `refined`, `signature` or `trade`. These are development comparisons, not a live randomised A/B experiment. Product IDs must exist in the shared catalogue. Counts, durations and percentages are bounded. All string dimensions below are enumerations rather than unrestricted text.

| Events | Trigger and useful dimensions | What the result means |
|---|---|---|
| `page_view` | Initial measured view; broad source, medium, campaign and viewport bucket | A measured page view after consent |
| `navigation_click`, `cta_click` | Internal link or relevant buyer CTA; target and placement | A navigation choice, not completion of the next task |
| `section_view` | A section intersects the viewport; range, approach, brief or contact | Once per section per page instance; intersection is not proof that text was read |
| `scroll_depth` | 25, 50, 75 or 100 percent page depth | A page-length-dependent engagement signal |
| `engaged_time` | 30, 60, 120 or 300 seconds while the page is visible | Visible time milestones, not continuous attention |
| `catalogue_filter` | Family selection/reset; category and result count | Interest in a range |
| `search_results` | Debounced catalogue search; category and result count | Whether searches yield results; the search text is excluded |
| `product_view` | Product details opened; product ID and family | Interest in a particular product |
| `shortlist_change` | Add/remove; product ID, action and list count | Intent to include a product in an enquiry |
| `compare_change`, `compare_open` | Product comparison selection and opening; product ID, action/count | Use of the procurement comparison tool |
| `buyer_route` | Business type selected in the enquiry; importer, retailer, food service or manufacturer | Buyer context voluntarily selected in the interface |
| `market_select` | Region selected in a tool or form | Declared enquiry context; not the visitor's IP location |
| `packing_select` | Bulk, retail, own label or discussion option | Packing interest |
| `sample_interest` | Sample checkbox changed; complete/empty state | A sample discussion request, not a sample shipment |
| `brief_start` | First input in the brief form; shortlist count | Beginning of an enquiry form interaction |
| `brief_field_completed` | Field blur; field name and complete/empty state; product ID for quantity | A completion flag without the actual contact, destination or quantity text |
| `brief_error` | Native validation or invalid brief; constant error type | A point of friction; no error message or form text sent |
| `brief_prepared` | Valid message prepared; shortlist count, buyer and packing | An enquiry draft, **not a sent lead** |
| `contact_handoff` | Email or WhatsApp link activated; channel and list count | Handoff intent; the website cannot confirm that the message was sent |
| `brief_download`, `brief_copy` | Draft downloaded/copied; list count | A saved message, not a confirmed contact |
| `map_open` | Google Maps link activated | Interest in the business location |
| `consent_choice` | Analytics accepted/declined | In preview this is a local trace; a decline is not remotely transmitted in the production adapter |
| `technical_error` | Script/resource failure; fixed category only | A diagnostic count, without stack traces, URLs or message content |
| `web_vital` | Hidden-page diagnostic flush; metric, value and rating | Native LCP/CLS/FCP diagnostics; this is not a complete Core Web Vitals integration |

Parameters deliberately excluded: name, company name, email, telephone, precise address, free-text destination, requirements, quantity text, raw search terms, message body, full query strings, full referral URLs and arbitrary campaign values. The product shortlist persists only as product IDs in session storage; form fields are not saved as a draft. Sanitiser and consent tests exercise these boundaries.

## Reports to configure after activation

| Report | Dimensions and measures | Decision it supports |
|---|---|---|
| Worldwide acquisition | GA4 aggregate country/device/browser, source/medium/campaign, landing page; Search Console country/query/page separately | Where discoverability and engagement are improving |
| Product demand | Category, product views, shortlist additions, compare use and enquiry drafts | Which products deserve clearer content and sourcing attention |
| Enquiry funnel | Measured page/section view → product view or custom brief start → shortlist/form start → prepared draft → contact handoff | Where interested visitors hesitate; allow product-free custom enquiries as a separate path |
| Mobile usability | Viewport bucket/device × form starts, validation errors, draft preparation and handoffs | Whether a mobile flow needs simplification |
| Buyer and packing interest | Selected buyer type, packing and broad market context | Which programmes merit more explanation |
| Search friction | Zero-result search count, family and follow-on brief behaviour | Missing synonyms/range explanations without collecting private search text |
| Technical health | Sanitised error categories, field/lab performance evidence and hosting delivery trends | Whether failures or slow pages affect the journey |
| Business outcomes | Private lead register: received enquiry, qualified, quote, sample, order; aggregate channel/product/market | Whether website interest becomes meaningful business |

Use distinct sessions/users for funnel rates where available, rather than dividing raw repeat event counts. Date windows, timezone, consent coverage and denominators belong on every report. A visitor who declines analytics or blocks collection is absent from this measured funnel. Small numbers and privacy thresholds limit country-level interpretation. Country/device inferred by Analytics may differ from a buyer's declared destination.

The user's historical estimate of 12–14 contacts in four weeks cannot be retrospectively attributed by installing a tag now. Keep that estimate separate from verified records. A contact click is a useful micro-conversion; a confirmed received/qualified lead is a business outcome. Do not emit `generate_lead` for merely opening WhatsApp or email. A future server-backed form may emit it only after confirmed acceptance, with spam controls and duplicate handling. CRM data and analytics data should have separate access and retention rules.

## Activation sequence for an approved release

1. Confirm the business-controlled Google account and whether an existing property/container exists. Give named people the minimum necessary access. Do not use a developer's personal ownership as the only recovery route.
2. Confirm property name, reporting timezone/currency, website stream, owner and recovery details. Obtain a real `G-...` ID; this implementation has no placeholder production ID.
3. Configure the property to match the privacy design. Disable Enhanced Measurement automatic form interactions, outbound clicks and site search before enabling this adapter; start with Enhanced Measurement off to avoid automatic raw URLs/form parameters and duplicate events. Disable advertising integrations and Signals unless separately approved.
4. Review the public privacy/cookie notice, applicable consent requirements, Google service terms, processors, international transfers, retention, deletion request process and access rules. The supplied privacy page is a development draft. The implementation cannot by itself certify compliance. Prefer the shortest retention that supports the agreed reporting task; longer retention needs an explicit business reason.
5. Configure an approved test stream/host and inspect payloads using GA4 DebugView/network inspection. Test consent accepted, declined, reopened and withdrawn; blocked storage; ad blockers; no query/form leakage; no duplicate page views. The current mock tests confirm code behaviour, but no live Google ingestion was exercised.
6. Register useful low-cardinality custom dimensions from the event table, within current property quotas. Make `brief_prepared` and `contact_handoff` clearly labelled micro-conversions if desired. Keep received/qualified leads separate.
7. Set the real measurement ID, production hostname allowlist and `enabled:true` only in the selected release. Remove development tools from the public interface. The hostname allowlist and development noindex controls must remain for other candidates.
8. Verify real reports after launch, link Search Console if appropriate, exclude internal developer/testing traffic using the property's supported controls, and save a dated baseline. Optional export/reporting services require a separate cost/data decision.

The sender uses a strict consent gate: the Google script is absent until acceptance. This corresponds to the basic approach described in [Google's consent concepts](https://developers.google.com/tag-platform/security/concepts/consent-mode). [Google's privacy guidance](https://developers.google.com/tag-platform/security/guides/privacy) and [Analytics collection policy](https://developers.google.com/analytics/devguides/collection/protocol/ga4/policy) are relevant to release verification; do not send personal information in analytics.

## Campaign attribution

Allowed custom values are intentionally constrained. Example business-listing link for a later approved update: `https://vayam-global.com/?utm_source=google&utm_medium=organic&utm_campaign=business_profile`. Use campaign `catalogue` for an approved catalogue campaign and `launch` for a launch campaign. Sources include Google, Bing, LinkedIn, Instagram and newsletter, with broad referral/direct/other buckets. Unknown values become `other` instead of being copied verbatim.

Do not put a prospect's name, email, telephone, quote ID or message in a URL. The adapter sends a query-free page location and an empty raw referrer; it keeps only the broad acquisition classification. This makes detailed campaign reporting coarser by design. Agree new campaign labels in code before running them.

## Worldwide content and technical release plan

English is the initial worldwide site. It should remain accessible from every market; do not force language or destination redirects from IP location. Translations become useful when actual enquiries/search evidence justify professional localisation and ongoing maintenance. Use separate language URLs and reciprocal hreflang only when those complete translated pages exist. [Google's international-site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) supports this approach.

The four candidates currently explore the homepage, product tools and enquiry journey. Their product details are dialogs, without independent product URLs. They do not yet implement the final searchable content architecture. The next selected-site release should provide:

| Proposed URL/content | What the buyer needs | Evidence needed before publication |
|---|---|---|
| `/products/` and six category pages | A crawlable overview linking every approved product/programme | Accurate category membership and descriptions |
| `/products/black-pepper/`, `/products/green-cardamom/`, `/products/basmati-rice/` and other useful approved entries | Form/application, sourcing questions, packing possibilities, sample process and enquiry link | Product facts; any grade, test, certification, MOQ or availability claim explicitly confirmed |
| `/private-label/` | Scope, pack/artwork responsibilities, sample/approval steps and realistic constraints | Actual capabilities; no invented manufacturing or certification claims |
| `/how-sourcing-works/` | Brief → feasibility → evidence → commercial/shipment coordination | Actual company process and responsibility boundaries |
| `/buyer-questions/` | Useful answers about samples, specifications, packing and commercial next steps | Answers approved by the business; no fabricated guarantees |
| `/contact/`, `/privacy/` | Consistent real identity, location, contact routes and data notice | Confirmed company details and reviewed production policy |

Candidate search-intent phrases include “Indian whole spice sourcing”, “black pepper supplier India”, “Indian basmati rice sourcing” and “private label Indian food sourcing”. These are editorial hypotheses, not measured search-volume or ranking claims. Research query relevance and real business capability before commissioning many pages. Do not publish duplicated city/country doorway pages or unsupported claims about established exports to every country.

Give each real page a specific title, readable description, canonical URL, useful heading hierarchy and crawlable internal links. Use descriptive alt text, efficient local images/fonts, social preview metadata and truthful Organization/Product data where applicable. Product structured data must not invent offers, prices, ratings or certification. The production release needs an actual XML sitemap of canonical public pages and suitable robots.txt; submit the sitemap only after those URLs are deployed and indexable. The absence of a robots.txt or sitemap on a small site is not itself an indexing block. [Google's SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) explains the role of useful content and discovery.

“Hot words” in a hidden keyword tag are not a route to global rankings: Google ignores the meta-keyword tag. Product terms should naturally describe the real offering in useful page content. [Google's supported meta tags documentation](https://developers.google.com/search/docs/crawling-indexing/special-tags) states this explicitly.

Maintain the Business Profile's real name/address/phone/site, approved categories, hours and real photographs when owner access is available. The previously requested access is pending; do not send duplicate requests or replace the listing. Business Profile improves the business listing; it does not automatically establish worldwide product rankings. Its results should be read separately using [Google's Business Profile performance guidance](https://support.google.com/business/answer/9918094).

Use relevant buyer directories, genuine partners, useful catalogue materials and appropriate social/trade content to earn discovery beyond Google. Any outreach, paid campaigns, directory submission or listing edit needs a concrete business decision and accurate claims. Nothing of that kind was published in this development work.

## Release boundaries

Development remains noindex/nofollow and local. Launch only the selected coherent site; publishing all four candidates as indexed near-duplicates would split the content. The public site's current HTTPS redirects worked in the earlier audit. Preserve them during any future hosting move. Compare hosting and mail/DNS implications in `HOSTING-OPTIONS.md` before migration.

Full Core Web Vitals comprise LCP, INP and CLS. FCP is a supporting paint metric. The present native observers provide diagnostics and do not cover INP or replace representative field evidence. Add a reviewed measurement library and remote device/network tests in the selected release, following [the Core Web Vitals guidance](https://web.dev/articles/vitals).
