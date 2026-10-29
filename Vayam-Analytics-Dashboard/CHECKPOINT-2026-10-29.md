# Analytics Studio upgrade — 29 October 2026

This continues the existing Vayam dashboard in place. The live business website and the four trial designs are outside this release scope.

## What changed

- Live connected report is the starting view, with a clear full-screen Google report link and an optional private embedded viewer. Embedded sign-in/loading is browser-dependent; the full-screen link remains available.
- Custom analysis has selectable metric cards, one-metric line/bar trends, exact daily tables, full/custom/7/14/28-day date selections, searchable and sortable breakdowns, configurable row limits and chart/table display.
- Display settings include compact spacing and visible metric cards. Only these preferences are saved on the device; reports and tokens remain in tab memory.
- Multiple imported/pasted reports can be switched within the tab. JSON report export, displayed-table CSV export, print/PDF and compatible period comparisons are available.
- The new calculation engine distinguishes unavailable values from zero; does not sum daily unique users; checks source, property, time zone, duration and overlap before comparisons; and hides full-period tables when only an imported date subset is selected.
- Chart dates use calendar spacing, gaps remain gaps, zero bars have zero width, and activity counts are never presented as confirmed leads.
- Insights explain small samples, product interest, geographic reach, search visibility and contact intent, with suggested next checks.
- A free browser-based GA4 connector uses only analytics.readonly and short-lived in-memory access. It requires a separate approved Google OAuth Web client; the existing Data Studio report's authorisation is not reused.

## Data handling

Real GA4 and Search Console figures visible in the private report were transcribed into two dated local snapshots in the ignored .local folder. These are private local copies, not public site assets and not live API exports. The two sources retain their own reporting time zones. Missing daily values and unavailable event totals were left unknown. Early traffic includes verification visits.

Search Console data continues in the existing Google report; the custom Google connector initially retrieves GA4 only. Optional embedded reports retain the report's existing Google access rules. No sharing permission was expanded.

## Validation

Run tests/report-engine.cjs, tests/google-connector.cjs, tests/analytics-gates.cjs and tests/site-readiness.cjs. Browser acceptance checks cover card selection, chart switching, date subsets, real snapshot loading, source switching, search/sort/table display, customisation, invalid input preservation and narrow-screen layout. See the final conversation handoff for the actual completed publication and account-setup status.

Verified browser results: custom metric selection, line/bar switching, partial-date warnings, actual GA4 snapshot values, traffic-source search and ascending sort, rejected cross-source comparison, invalid paste preserving existing data, card visibility and compact spacing. The responsive harness verified visible navigation and no page overflow at 320px, 390px and 768px. The browser viewport override did not resize this Chrome session, so narrow checks used an explicit-width iframe rendering the same application.

Cloud setup: owner explicitly approved a free dedicated project after the initial automatic review block. Project vayam-analytics was created under the existing report-owner account; owner clicked Enable for the Analytics Data API terms. OAuth web client with analytics.readonly and origins https://vayam-global.com, http://127.0.0.1:8771 and :8772 was created. The owner account is one test user. Client ID is public and prefilled; no secret/downloaded credential file was used. Initial sign-in timed out; timeout increased to five minutes. Final live authorisation is still pending verification. No billing/trial activation was performed.
