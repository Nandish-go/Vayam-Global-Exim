# Vayam Global Exim — development review

The root `index.html`, `assets/` and `CNAME` are the current live website baseline from `main`. This review branch does not change those files or the deployed site.

| Folder | Purpose |
|---|---|
| [`Vayam-Development/`](Vayam-Development/README.md) | The only four active design candidates: Classic, Refined, Signature and Trade; shared catalogue and assets; comparison studio; local preview server. |
| [`Vayam-Analytics-Dashboard/`](Vayam-Analytics-Dashboard/README.md) | Separate responsive analytics dashboard prototype with clearly fictional data. It is not connected to real visitors. |

Open this checkout as a folder in VS Code. In a terminal, run `cd Vayam-Development` and `node preview.cjs`, then open http://127.0.0.1:8770/. The studio links the four full websites, a live-site baseline snapshot, a desktop/phone comparison and the separate dashboard at http://127.0.0.1:8770/dashboard/. Stop the preview server with Ctrl+C. No dependency installation is required.

These two folders are the only new site content relative to `main`; this README adds review instructions. Earlier design experiments, migration scripts and unused image candidates were removed from this review tree; the older checkout and a local preservation tag retain them. Development pages and the dashboard are marked `noindex`; no real analytics service is enabled. The main-site analytics preparation is isolated in a separate local worktree and is not part of this design branch.
