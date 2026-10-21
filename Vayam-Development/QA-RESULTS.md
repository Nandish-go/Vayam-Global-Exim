# Verification

## Current checkpoint — 21 October 2026

The four-design build and 16 verification groups passed. Edge browser checks covered all four designs at 320, 390, 768 and 1440 px, quantity restoration, category navigation after search, prepared enquiry messages and dashboard import failures. The main-site technical preparation and disabled analytics were also checked. See [the full checkpoint](../Vayam-Analytics-Dashboard/CHECKPOINT-2026-10-21.md). Production `main` remains unchanged; the working branch is now published on GitHub. The root homepage is the proposed technical update, while `baseline/` remains the frozen live-site reference.

## Historical verification — 30 September 2026

Active review set: Classic, Refined, Signature and Trade. The public main branch and personal site are unchanged.

## Completed

- `node tools/build.cjs` rebuilt the four active designs, credits and 32-image contact sheet. `node tests/verify.cjs` passed all 15 verification groups, including catalogue integrity, enquiry validation, safe analytics payloads, consent gating, local assets, contact channels and the map.
- A fresh browser pass checked each design at 320, 390, 768 and 1280 pixel preview widths: 16/16 layouts had one main heading, visible phone/email/GST, loaded hero photography, no horizontal document overflow, a map iframe, and no unwanted floating enquiry pill. The iframe scrollbar uses about 15 pixels of the selected width.
- The image-review page loaded all 32 local catalogue images without a broken asset. The four Trade category photographs also loaded. Its packaged-food tile opened a four-result catalogue filter by keyboard.
- The embedded Google map visibly rendered the DS-MAX Splendid location during the annotated-feedback review. A visible reload control and separate directions link remain available if Google fails to load for a visitor.
- In the clean review branch, the root live `index.html`, `assets/` and `CNAME` still match `main`. The older redesign checkout, its staged files and its stash remain untouched. The previous detailed preservation checks remain in Git history and external QA evidence.

## Image review and boundaries

The revision uses no AI-generated image assets. Replacements were selected from credited Commons and Pexels photographs, inspected individually and matched to the relevant ingredient or format. We rejected visibly unsuitable search candidates, including a seed photo that did not match the listed mustard type and branded packaging that could imply another company's product was Vayam stock. Older catalogue references also carry source and author links, although third-party provenance alone cannot prove the creation method of every earlier stock image. All pictured goods and packaging remain illustrative until Vayam approves actual product and facility photographs.

No push, deployment, external enquiry submission or GA4 property creation occurred. Analytics is prepared but disabled without a measurement ID, and real Google ingestion remains unverified. The current checks are browser preview checks, not physical-device, Safari or Firefox certification. Google's embedded map can fail because of network or provider restrictions; the directions link is the fallback. The 62 earlier browser checks and original review screenshots remain in `revision-20260929` evidence; the new responsive results, image contact sheet and screenshots are in `feedback-20260929` outside this repository. In this review tree, inactive pages, one-time migration scripts and unused photo candidates have been removed; their previous committed contents remain recoverable.
