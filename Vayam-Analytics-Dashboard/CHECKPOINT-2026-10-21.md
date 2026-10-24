# Technical checkpoint — 21 October 2026

The working branch is `vayam-dev-four-candidates` in `C:\Github Repos\Vayam-Global-Exim`. GitHub Desktop's obsolete `C:\Guthub Repos` location was repaired. The four-design checkpoint `395018d` was published through Desktop and independently verified on GitHub. Production `main` remains at `f868a2113abfd971a291223ebee90d82008dce8c`.

This update prepares production metadata, sitemap/crawler files, same-photo responsive WebP assets, an optional analytics integration and a privacy notice. It does not enable a provider or replace the live website. The current business site can be reviewed locally at `/current/`; the frozen comparison in `Vayam-Development/baseline/` is retained.

The four designs share fixes for quantity restoration, category navigation after searching, and keyboard focus when revealing more products. The dashboard now validates all report row types and rejects malformed/negative counts before rendering. Local preview routes refuse private-report and repository-internal paths. A static hosting service still must not receive private data; this route restriction is a local preview safeguard, not authentication.

Validation completed:

- Four-design build and 16 verification groups passed.
- Main integration provider/host/consent/payload gates passed, including DNT/GPC and rejection of contact fields.
- Production metadata, local links, sitemap and dashboard schema checks passed.
- Headless Microsoft Edge exercised the existing main enquiry handoff (intercepted, not sent), event trace, all four designs at 320/390/768/1440 px, reloaded quantities, search/category reset, draft preparation, report import errors and private-path rejection.
- No browser JavaScript errors or external analytics requests were observed in that test. External map requests were deliberately blocked by the test; this test does not validate Google Maps availability or actual analytics ingestion.
- Desktop and phone main-page screenshots were inspected. The visual identity and photographs are retained; only a small privacy footer link is added. Screenshot artifacts remain in the ignored `.local/` directory.

Pending service steps: select/create the business analytics property, configure its actual public ID, verify real provider requests and reports, verify Search Console ownership, then approve the production release and submit its sitemap. The dashboard still contains clearly labelled sample data. Historical visitors cannot be reconstructed by adding tracking now.
