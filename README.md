# Vayam Global Exim — live business website

This is the **main** branch deployed to https://vayam-global.com/ through GitHub Pages.

The homepage retains the established business design. This release adds consent-based Google Analytics, responsive local photographs, five useful product-category pages, structured search metadata, robots.txt, sitemap.xml, privacy information and a 404 page.

## Where everything belongs

- Root index.html: the business homepage.
- assets/: business-site images and styles.
- products/: five crawlable category pages.
- Vayam-Analytics-Dashboard/: measurement integration, editable reporting interface, setup guide and tests. Private Google reports require sign-in. This folder contains no secret or real visitor export.
- The **vayam-dev-four-candidates** branch contains these source files plus **Vayam-Development/** with Classic, Refined, Signature and Trade. Those experiments are excluded from this production branch.
- Existing remote backup: **backup-live-v4-5**. Previous main commit **f868a2113abfd971a291223ebee90d82008dce8c** remains the immediate parent of this release.

## Preview and verify

Run `node Vayam-Analytics-Dashboard/tools/preview-main.cjs`, then visit http://127.0.0.1:8771/ and http://127.0.0.1:8771/Vayam-Analytics-Dashboard/.

Run `node Vayam-Analytics-Dashboard/tests/analytics-gates.cjs` and `node Vayam-Analytics-Dashboard/tests/site-readiness.cjs`. The production-browser test requires Playwright and Microsoft Edge.

Read [analytics setup](Vayam-Analytics-Dashboard/SETUP.md) and [report access](Vayam-Analytics-Dashboard/README.md). GA4 measurement ID: **G-SB6RL77QJ4**. Tracking starts only after visitor consent on the production domain. The dashboard starts empty; sample figures are explicitly optional. Clarity project **z2xvqfy55k** is configured through the same consent choice, with enquiry forms masked.

The four-design review at https://vayam-four-design-review.nandish072.chatgpt.site/ is a separate hosted snapshot, not the deployed business website.

Source release: 4c33aa88d47cfead78377bc8948b7fc6b3e07011. Do everyday editing on the development branch in the same local repository, then release selected business changes to main.
