# Vayam Global Exim — one repository

Open `C:\Github Repos\Vayam-Global-Exim` in VS Code and GitHub Desktop.

| Location | Purpose |
|---|---|
| `main` branch | The deployed business website at https://vayam-global.com/. Only business-site and analytics files belong in its release. |
| `vayam-dev-four-candidates` branch | Everyday working branch: the business-site source plus the four trial designs and analytics workspace. Pushing this branch does not deploy the business website. |
| Root `index.html`, `assets/`, `products/` | Original homepage, real photographs and five crawlable product-category pages. |
| `Vayam-Development/` | Exactly four active design candidates: Classic, Refined, Signature and Trade, with comparison tools and shared assets. |
| `Vayam-Analytics-Dashboard/` | Website measurement, dashboard interface, setup instructions and validation tools. No credentials or private reports in Git. |
| `backup-live-v4-5` | Existing remote backup. Earlier local experiments remain in archive refs/stashes. |

## Open the websites

- Live business website: https://vayam-global.com/
- Four-design public review: https://vayam-four-design-review.nandish072.chatgpt.site/
- Phone/desktop comparison: https://vayam-four-design-review.nandish072.chatgpt.site/responsive.html
- The review site is a hosted snapshot; pushing GitHub does not update that snapshot.

From this repository run `node Vayam-Development/preview.cjs`: development studio http://127.0.0.1:8770/, original-site preview http://127.0.0.1:8770/current/, dashboard http://127.0.0.1:8770/dashboard/.

For the complete business site including its new category pages, run `node Vayam-Analytics-Dashboard/tools/preview-main.cjs` and open http://127.0.0.1:8771/. This second preview reads the same source files; it is not another repository or design version.

## Analytics and search

The production integration is configured for GA4 property **Vayam — Live Website**, measurement ID **G-SB6RL77QJ4**. It activates only on the approved HTTPS business domains after the visitor allows analytics. Local previews, four-design review hosts, development paths and dashboard paths do not send production analytics. Microsoft Clarity project `z2xvqfy55k` is configured through the same analytics choice, with enquiry forms masked.

Open [the analytics workspace guide](Vayam-Analytics-Dashboard/README.md) for direct report access, account status and remaining setup. The static dashboard starts empty; illustrative figures require an explicit click. Imported JSON reports and comparisons remain in the current browser tab. No public static page contains your real visitor data.

The website includes canonical/social metadata, structured data, responsive local photographs, `robots.txt`, a seven-page `sitemap.xml`, a privacy page and a custom 404. Search Console already has the verified domain property `sc-domain:vayam-global.com`. Submission and deployment status are recorded in the analytics checkpoint; prepared files alone do not prove indexing.

## Everyday GitHub Desktop workflow

1. Open this repository and choose `vayam-dev-four-candidates`.
2. Edit in VS Code, preview and run **Vayam: build and verify everything**.
3. Review changed files in GitHub Desktop, commit, then **Push origin**.
4. Release selected business-site changes to `main` when ready. Keep `Vayam-Development/` out of production.
5. Republish the separate review snapshot only when the four designs change.

Keep the frozen original in `Vayam-Development/baseline/`. Previous experiments remain recoverable through the local stash `Pre-consolidation Vayam-Global-Exim staged designs and local files 2026-09-30`, tag `archive/vayam-original-before-consolidation-20260930`, branch `archive/vayam-dev-before-clean` and old `redesign-v1`. They are not additional active designs.
