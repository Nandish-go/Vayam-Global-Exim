# Sources and editing guide

This folder contains exactly four active website candidates, a shared source set, and the tools needed to rebuild and verify them. The root `../index.html` is the unchanged live baseline. `baseline/index.html` and `templates/live-main.txt` are frozen comparison/build references; they are not alternate development designs.

| Purpose | Edit here |
|---|---|
| Four layouts and common main-derived content | `tools/build-active.cjs`, `tools/components.cjs` |
| Design styling | `classic/theme.css`, `refined/theme.css`, `signature/theme.css`, `trade/theme.css` |
| Shared styling | `shared/main.css`, `shared/evolution.css`, `shared/review-fixes.css`, `shared/base.css` |
| Product facts, image paths and source credits | `shared/catalogue-source.json`; current image files in `shared/images/` |
| Business contact and registrations | `shared/business.json` |
| Destination prompts | `shared/markets.json` |
| Enquiry/catalogue interactions | `shared/app.js`, `shared/core.js` |
| Development analytics | `shared/analytics.js`, `shared/config.js` — external measurement remains disabled |
| Review studio and comparison | `tools/review-build.cjs`, `shared/review.js`, `shared/review.css` |
| Attribution and image review | `tools/credits-build.cjs`, `tools/image-review.cjs`, `shared/main-image-sources.json` |
| Separate analytics prototype | `../Vayam-Analytics-Dashboard/` |

After source edits, run `node tools/build.cjs` and `node tests/verify.cjs` from this folder. The build generates the four candidate `index.html` files, `shared/catalogue.js`, `shared/business.js`, `shared/markets.js`, `shared/widgets.css`, and the studio/comparison/credit/image-review pages. Edit the sources, not those generated files. Runtime scripts and theme CSS are served directly. The privacy draft is maintained in `privacy.html`.

The shared catalogue has 32 entries with local illustrative photographs and source/author links. These images do not prove Vayam stock, suppliers, factories or a specific shipment. Selected weaker photo candidates were replaced with clearer ingredient references; unused trial photographs are absent from this clean tree. Source credits do not certify every older third-party image's creation method.

The earlier Origin/Atlas/Pulse pages, migration scripts, trial photos and previous builder are excluded from this active branch. They remain recoverable in the local `archive/vayam-dev-before-clean` tag and the pre-consolidation stash/tag described in the repository README; those recovery refs are not part of the branch for publication. Some internal component style tokens retain earlier names; the active output set is governed by the four-entry `variants` object in `tools/build-active.cjs` and checked by `tests/verify.cjs`.
