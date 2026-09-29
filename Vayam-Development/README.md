# Vayam development — four active designs

Only **Classic**, **Refined**, **Signature** and **Trade** are in this review collection as of 30 September 2026. The deployed main site is unchanged. Earlier Origin, Atlas, Pulse, Astra and Edition work remains recoverable from Git history or the untouched older checkout.

| Candidate | Direction |
|---|---|
| Classic | Evolution of the live forest-green split hero and familiar business story |
| Refined | Lighter ivory composition, photographic category navigation and a clearer route to an enquiry |
| Signature | Editorial typography, large spice photography and a category gallery |
| Trade | Rich forest-green editorial opening, four photographic category tiles and product comparison |

Run `node preview.cjs` in this folder, then open http://127.0.0.1:8770/. The review studio links all four designs, the preserved live baseline, a two-up comparison with selectable widths and locally saved notes, and the separate dashboard prototype. Stop the server with Ctrl+C. VS Code Live Server can also open this folder's index.html; use the custom preview server for the dashboard link.

The separate [analytics dashboard](../Vayam-Analytics-Dashboard/README.md) is available at http://127.0.0.1:8770/dashboard/ while this preview server runs. Its figures are explicitly fictional until a verified report is imported.

All four share the complete 32-entry catalogue, business information, product search, comparison, shortlist, quantity/sample/destination fields, reviewed email/WhatsApp handoffs and consent-aware analytics. Phone and WhatsApp have separate labelled contact links. The Google map displays the registered office complex, with a separate directions link to the existing business listing. Messages are only prepared; visitors send them from their chosen app.

Edit the sources listed in SOURCE-MAP.md. Run `node tools/build.cjs` and `node tests/verify.cjs` afterwards. No package installation or framework service is required. The builder is self-contained within this folder and does not rebuild the live baseline or historical designs.

Analytics remains disabled with no measurement ID. The local inspector is for verification, not a visitor dashboard. See MEASUREMENT-AND-DISCOVERY.md for account activation and worldwide discovery work. Development pages intentionally use noindex; the local server binds only to 127.0.0.1.

See QA-RESULTS.md for verified behaviour and limitations. Image credits are available at credits.html; image-review.html shows all 32 catalogue images together for review. These photographs illustrate a sourcing direction; they are not Vayam inventory or proof of a particular supplier lot. The current revision uses no AI-generated imagery.
