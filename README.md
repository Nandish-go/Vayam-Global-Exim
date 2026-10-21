# Vayam Global Exim — development review

Open **`C:\Github Repos\Vayam-Global-Exim`** as the one working folder in VS Code. The active **`vayam-dev-four-candidates`** branch keeps development and analytics in two folders in this same repository and is now published to GitHub. **`main`** remains the live business-site branch at `f868a21`; **`backup-live-v4-5`** is the existing remote backup.

The working branch's root `index.html` now contains the proposed technical update for the original business website: the same design and photographs, responsive local images, search/social metadata, a privacy link and a disabled analytics integration. `robots.txt` and `sitemap.xml` are prepared for release. These changes are **not deployed to vayam-global.com**. The frozen baseline remains in `Vayam-Development/baseline/`; `CNAME` is unchanged.

| Folder | Purpose |
|---|---|
| [`Vayam-Development/`](Vayam-Development/README.md) | The only four active design candidates: Classic, Refined, Signature and Trade; shared catalogue and assets; comparison studio; local preview server. |
| [`Vayam-Analytics-Dashboard/`](Vayam-Analytics-Dashboard/README.md) | Dashboard prototype, main-site integration, validation and account/discovery setup guide. Figures remain fictional until a real provider is connected. |

The public [four-design review](https://vayam-four-design-review.nandish072.chatgpt.site) and [desktop/phone comparison](https://vayam-four-design-review.nandish072.chatgpt.site/responsive.html) are hosted snapshots for sharing with friends. They work without a running local server. See [sharing and publishing notes](Vayam-Development/SHARING.md); changes in this repository appear online only after republishing that review.

In VS Code use **Terminal → Run Task → Vayam: preview websites**, or run `node Vayam-Development/preview.cjs` from the repository root. Open the four-design studio at http://127.0.0.1:8770/, the original-site technical preview at http://127.0.0.1:8770/current/, or the dashboard at http://127.0.0.1:8770/dashboard/. `/current/` serves the root files directly; it is not an extra design folder. Stop the preview server with Ctrl+C. Ordinary preview/build/checks require Node.js and no dependency installation.

Use **Vayam: build and verify everything** before committing. Then inspect changes in GitHub Desktop, commit on `vayam-dev-four-candidates`, and **Push origin**. Desktop is configured to this same folder. Pushing this branch does not deploy the business website. Release selected main-site changes to `main` only after review; keep the four experiments out of that release. The review link is a separate hosted snapshot, so it needs republishing when its code changes.

Earlier Astra, Origin, Atlas, Pulse and Edition experiments, one-time migration scripts and unused image candidates are absent from the active branch. The named local stash `Pre-consolidation Vayam-Global-Exim staged designs and local files 2026-09-30` and the `archive/vayam-original-before-consolidation-20260930` tag preserve the former working files for later review or removal. An earlier cleaned development snapshot is also preserved by `archive/vayam-dev-before-clean`. These local recovery refs are not part of the branch for publication. The old `redesign-v1` branch and existing live backup branch remain available.

Development pages and the dashboard are marked `noindex`; no real analytics service is enabled. The earlier `analytics-main-prep` draft remains recoverable in local Git history; its updated implementation is now consolidated in `Vayam-Analytics-Dashboard/integration/` on this working branch. Read [SETUP.md](Vayam-Analytics-Dashboard/SETUP.md) for the account connection and Search Console steps, and [the technical checkpoint](Vayam-Analytics-Dashboard/CHECKPOINT-2026-10-21.md) for validation. The static dashboard has no authentication; keep real visitor data and API secrets outside public hosting and Git.
