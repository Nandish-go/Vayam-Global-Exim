# Vayam Global Exim — development review

Open **`C:\Github Repos\Vayam-Global-Exim`** as the one working folder in VS Code. The active `vayam-dev-four-candidates` branch keeps development and analytics in two folders in this same repository. The root `index.html`, `assets/` and `CNAME` exactly match the current live baseline from `main`; this branch does not change the deployed site.

| Folder | Purpose |
|---|---|
| [`Vayam-Development/`](Vayam-Development/README.md) | The only four active design candidates: Classic, Refined, Signature and Trade; shared catalogue and assets; comparison studio; local preview server. |
| [`Vayam-Analytics-Dashboard/`](Vayam-Analytics-Dashboard/README.md) | Separate responsive analytics dashboard prototype with clearly fictional data. It is not connected to real visitors. |

Open this checkout as a folder in VS Code. In a terminal, run `cd Vayam-Development` and `node preview.cjs`, then open http://127.0.0.1:8770/. The studio links the four full websites, a live-site baseline snapshot, a desktop/phone comparison and the separate dashboard at http://127.0.0.1:8770/dashboard/. Stop the preview server with Ctrl+C. No dependency installation is required.

These two folders are the only new site content relative to `main`; this README adds review instructions. Earlier Astra, Origin, Atlas, Pulse and Edition experiments, one-time migration scripts and unused image candidates are absent from the active branch. The named local stash `Pre-consolidation Vayam-Global-Exim staged designs and local files 2026-09-30` and the `archive/vayam-original-before-consolidation-20260930` tag preserve the former working files for later review or removal. An earlier cleaned development snapshot is also preserved by `archive/vayam-dev-before-clean`. These local recovery refs are not part of the branch for publication. The old `redesign-v1` branch and existing live backup branch remain available.

Development pages and the dashboard are marked `noindex`; no real analytics service is enabled. The disabled main-site analytics integration draft remains in local Git history on `analytics-main-prep`, without another checkout folder. It can be reviewed when the real analytics account is ready. Do not publish the dashboard on a public static host with real visitor data because it has no authentication.
