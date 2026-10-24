# Analytics and search release checkpoint — 25 October 2026

## Published and verified

- Business release: `957809f10388922473859b42b6a8adc64ed125aa` on `main`, pushed to GitHub. The immediately preceding main commit is `f868a2113abfd971a291223ebee90d82008dce8c`.
- Working release: `4c33aa88d47cfead78377bc8948b7fc6b3e07011` on `vayam-dev-four-candidates`, pushed to GitHub.
- GitHub Pages [deployment 40108826084](https://github.com/Nandish-go/Vayam-Global-Exim/actions/runs/40108826084) succeeded for the main release. Subsequent documentation commits may have newer IDs.
- The live homepage, sitemap, robots file, category page and GA4 configuration responded successfully. The homepage retains its established design; the release adds measurement and crawlable category detail.
- GA4 `G-SB6RL77QJ4` received a consented production verification visit. Realtime showed page_view, session_start, first_visit, section_view, scroll_depth and visible_time. The Germany visit was testing, not a buyer enquiry.
- Search Console accepted the sitemap on 24 October: Success, seven discovered pages. Indexing and ranking remain Google's decisions.
- The approved report-owner account has Viewer access to the GA4 property. The business account remains Administrator.
- No paid service, billing project or paid connector has been activated.

## Dashboard status — not yet a finished combined report

- Google Analytics and Search Console are usable directly through the links in README.md.
- The saved Data Studio report is named **Vayam — Website & Search Insights**. Its real Search Console URL-impression source is connected, and the landing-page table returns real clicks and impressions.
- The report still has unconfigured template charts. Its Google Analytics connector is authorised and the live property appears as Working in data-source management. Do not use the unfinished report as a complete KPI dashboard yet.
- Before handoff: repair every chart and filter using the connected property 560596894, add an all-traffic page, rename the report and verify Restricted sharing.
- Clarity terms were accepted by the owner, and project **Vayam — Live Website** (`z2xvqfy55k`) was created. Its consent-based integration is configured and local provider/masking checks passed. Confirm production data receipt after the release; an installed script alone is not proof of recorded sessions.
- The custom repository dashboard starts empty. It supports validated local JSON imports and period comparisons, but does not automatically retrieve Google data. Its sample mode is explicitly fictional.

## Repository and access

Use one local repository: `C:\Github Repos\Vayam-Global-Exim`.

| Place | Purpose |
|---|---|
| `main` | Deployed website, product pages and analytics folder; no four-design development folder |
| `vayam-dev-four-candidates` | Everyday VS Code/GitHub Desktop working branch |
| Root `index.html`, `assets/`, `products/` | Business-site source, images and category pages |
| `Vayam-Development/` | Classic, Refined, Signature, Trade and browser comparison tools |
| `Vayam-Development/baseline/` | Preserved original reference |
| `Vayam-Analytics-Dashboard/` | Integration, custom dashboard, guides and checks |
| `backup-live-v4-5` and local archive refs | Recoverable historical work; not active design candidates |

- [Business website](https://vayam-global.com/)
- [Four-design review snapshot](https://vayam-four-design-review.nandish072.chatgpt.site/)
- [Desktop/phone comparison](https://vayam-four-design-review.nandish072.chatgpt.site/responsive.html)
- Local full business preview: run `node Vayam-Analytics-Dashboard/tools/preview-main.cjs`, then open http://127.0.0.1:8771/.
- Local four-design studio: run `node Vayam-Development/preview.cjs`, then open http://127.0.0.1:8770/.

Both preview servers read the same repository. The hosted four-design review is a snapshot; a GitHub push does not update it. Production tracking excludes local previews, trial-design paths and dashboard paths.

## Remaining search/account work

Inspect Google indexing after recrawl; add the documented campaign URL to Business Profile if desired; connect Bing Webmaster Tools with owner approval. There is no promise of worldwide ranking or complete visitor coverage. GA4 does not provide a raw visitor IP list, visitor names or historical data from before installation.

## Verification

Provider gates, static site readiness, responsive production checks and the four-design browser smoke checks passed for the release. The follow-up comparison check verifies positive/negative changes, a zero baseline, clearing the comparison and forgetting imports on reload. No test enquiry was sent. Test traffic is intercepted locally except the explicitly identified consented production visit.
