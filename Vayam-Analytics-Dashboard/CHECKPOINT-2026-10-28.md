# Analytics continuation checkpoint — 28 October 2026

## Saved live dashboard

[Vayam — Website & Search Insights](https://datastudio.google.com/u/0/reporting/8e538620-fcc2-482f-91c2-c09dce5f319a/page/Hqrp) reads the authorised GA4 and Search Console connections. The existing report was extended in place; its working overview and interactions pages were preserved.

Five pages are available: Home, Website interactions, Products & page attention, Contact & enquiry intent, Audience & devices. Product attention uses Product group and Page section with an event filter. Contact intent uses Contact channel and Click placement with its own event filter. Audience combines city, country, device, browser and source/medium; column widths were fitted to make values readable. Each detail page explains what its figures mean.

The contact page returned no matching recorded events during verification. No demonstration figures were inserted. Contact clicks and prepared forms are not confirmed enquiries or sales. City locations are approximate; early verification traffic remains included.

The overview uses 30 complete days and detail pages use 28 complete days by default. Select the same dates when comparing pages. The overview includes previous-period comparisons. Missing comparisons can occur before tracking began. The report uses its existing restricted access; no sharing permissions were expanded.

The repository dashboard now links to the combined report, GA4, Search Console and Clarity. Its own custom charts still use validated local JSON imports. They do not automatically fetch Google data. Sample mode remains explicitly fictional; private data and screenshots stay in ignored local storage.

## Main website and search

- Homepage indexing was verified again: URL is on Google, page indexed, HTTPS.
- The spices category URL is discovered through the sitemap but was not indexed at inspection. The CAPTCHA connection failure was resolved by the owner; on 29 October Google displayed **Indexing requested** and confirmed that the URL was added to a priority crawl queue. Submission is successful; actual indexing is still pending Google's crawl and decision.
- The saved mobile PageSpeed test dated 25 October reports performance 97, accessibility 96, best practices 100, SEO 100. It is a lab result, not a ranking or complete accessibility guarantee.
- A narrow contrast correction uses darker copper for light-background labels/buttons, lighter copper on the dark snapshot strip, and darker contact introduction text. Structure, business content and photographs are preserved. The five affected small-text/button contrast checks meet 4.5:1 after the correction; this is not a new full Lighthouse audit.
- Image-delivery/cache recommendations remain possible performance follow-ups. Bing Webmaster Tools connection and the Business Profile campaign link remain unfinished account tasks.

## Repository structure and release scope

Canonical folder: `C:\Github Repos\Vayam-Global-Exim`.

- `main`: deployed business website, category pages and analytics folder.
- `vayam-dev-four-candidates`: daily working branch; also contains `Vayam-Development/` with Classic, Refined, Signature and Trade.
- `Vayam-Analytics-Dashboard/`: provider integration, custom import interface, access links, setup guides and checks.
- Existing baseline, backup and historical references are preserved. No design folders or assets were deleted in this continuation.
- The public four-design review remains a separate hosted snapshot; pushing Git does not automatically republish that snapshot.

Release only the analytics access/documentation changes and main-site contrast correction to both branches. Do not merge the whole development branch into main. This checkpoint describes content; use Git history and deployment status for the exact published commit.

Verification on 29 October: provider gates, dormant trial/dashboard checks, seven-page metadata/assets and report validation passed. The final five affected contrast ratios range from 5.23:1 to 7.40:1. The local dashboard access panel displayed all four provider/report links and the empty-report state correctly.
