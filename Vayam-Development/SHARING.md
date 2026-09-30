# Share the four Vayam designs

Published on 30 September 2026 through Sites hosting. Access is public: anyone with the link can open the review, without an account or a running local computer. Development pages carry `noindex,nofollow` and the published review's robots.txt disallows crawling; those directives request search exclusion rather than providing access control.

- Review gallery: https://vayam-four-design-review.nandish072.chatgpt.site
- Desktop / phone comparison: https://vayam-four-design-review.nandish072.chatgpt.site/responsive.html
- Classic: https://vayam-four-design-review.nandish072.chatgpt.site/classic/
- Refined: https://vayam-four-design-review.nandish072.chatgpt.site/refined/
- Signature: https://vayam-four-design-review.nandish072.chatgpt.site/signature/
- Trade: https://vayam-four-design-review.nandish072.chatgpt.site/trade/
- Image gallery: https://vayam-four-design-review.nandish072.chatgpt.site/image-review.html

Friends can select two versions and a preview width on the comparison page. The notes controls save only in their own browser. They can use **Download all notes** and send that text file back; the website does not automatically submit feedback. On a phone, the full-version links are easier to explore than two large frames.

This review is a published snapshot. Further edits here do not update it automatically. The live business website and GitHub deployment are unchanged. The optional dashboard on this review contains clearly labelled fictional figures; no real visitor data or account/API credentials are included. External analytics is disabled in all four versions.

## Publishing source for later updates

The single development repository remains `C:\Github Repos\Vayam-Global-Exim`. `tools/export-review.cjs` exports only the public review pages, four versions, comparison baseline, required assets and fictional dashboard. The generated publishing cache is `C:\Users\NANDISH\.codex\site-cache\vayam-design-review`; it is not another active development checkout and is never pushed to the GitHub repository.

From this development folder, export updates with:

```powershell
node tools/export-review.cjs 'C:\Users\NANDISH\.codex\site-cache\vayam-design-review'
```

Reuse Site project ID `appgprj_6abc9cb73d4c8191acf4c268cbb581a3`, persisted in the publishing cache's `.openai/hosting.json`. Do not register another Site for later updates. Use a fresh native source credential when needed; credentials stay in session memory and the workflow's hidden stdin, never in this repository. Follow the Sites hosting workflow to push the publishing source, package it, save a version and deploy it. Windows packaging uses the bundled Git Bash executable through the local `C:\Users\NANDISH\.codex\site-cache\vayam-packager-bin` alias, with the bundled Git `usr\bin` directory on the process PATH.

Initial published Site version: 1. Published source commit: `c87090a69e7588cf05117ad2db98652828f0368f`. This source commit belongs to the generated publishing cache; the editable website source stays in the original Vayam repository.
