# Flourish Catering and Events Services — v0.6.1

Navigation refinement release, cumulative from v0.6.0. Desktop Services is a 280px text-only dropdown; the mobile menu exposes all service links without nested disclosures. Astro, TypeScript and custom CSS; approved brand colours and Manrope/Newsreader retained. No new npm dependencies. The sticky-header layout reserve and hysteresis thresholds (112px/56px) are unchanged; obsolete nested disclosure handling was removed.

## Local installation and testing

Use the already validated Node/npm environment (Node 26 recommended). Extract the ZIP into a clean directory or back up the current project before overwriting. Keep the locally generated package-lock.json; the archive does not contain node_modules, dist or a lockfile.

```sh
npm install
npm run validate
npm run test:navigation
npm run qa
npm run test:report
npm run dev
```

If the Chromium test browser is missing, run `npm run test:install`. For Linux browser system dependencies use `npx playwright install --with-deps chromium` if required. Stop the dev server before running tests. Preview indexing remains disabled. Do not push, deploy or enable indexing without authorization.

## Temporary content

All twelve illustrative WebP photographs are AI-generated, not real client work. They are separately stored in `src/assets/images/illustrations/` and registered in `src/data/illustrations.ts`. No fictional projects, ratings or testimonials are included. The homepage uses a temporary gallery image as its hero; its resolution is intentionally limited and it should be replaced with a high-resolution approved photograph. All illustrative imagery is labelled in the public UI. When genuine projects are published, the gallery and matching service proof sections use the actual records instead; service cards and the featured homepage hero also prefer eligible project covers. Services without approved photos retain labelled illustrations. The illustration-only gallery remains noindex and excluded from the production sitemap.

Edit service copy in `src/data/services.ts`, business/contact details in `src/data/business.ts`, and booking questions in `src/data/faqs.ts`. The copy is provisional, based on the confirmed general offerings; verify against client information before launch. To replace illustrative images directly, update the imported file and associated alt text/caption in `src/data/illustrations.ts`. For genuine proof, use a project record instead of merely swapping pixels, to ensure attribution and permissions are handled accurately.

## Add genuine projects

Put approved photographs in `src/assets/images/projects/<project-slug>/` and create `src/content/projects/<project-slug>.json` following the schema in `src/content.config.ts`. The cover uses a relative path such as `../../assets/images/projects/<project-slug>/cover.jpg`. Supply a verified title, eventType, description, services (catering, decoration, baking, confectionery), cover `{src,alt}`, optional photos with alt text and captions, and publication/permission flags. Set `published` and `permission` to true only after approval. Set `featured` true for homepage eligibility. Testimonials require their own permission flag and verified quote/attribution. The `setup.json` record is excluded. Do not add private client material to a public repository. Genuine video content is deferred.

## Acceptance

Review the homepage, every service, gallery, about, FAQ, contact and error page on mobile and desktop. Confirm proof precedes offers, generated images are labelled, footer copyright is centred, no old motto or decorative arrows remain, gallery filtering and lightbox work, and navbar does not vibrate. Run the whole suite including `tests/editorial.spec.ts`. Repeat Lighthouse and manual keyboard/touch testing. See `docs/launch-checklist.md` for production requirements.

Packaging checks are not a substitute for the Astro build or browser QA. The packaging runtime lacks installed Astro dependencies; full validation is pending on the local machine.

## Navigation release checks

Run `npm run validate` before `npm run test:navigation`, then `npm run qa`. Test desktop click/keyboard navigation, active service links, outside dismissal, flat mobile touch navigation and small-height scrolling. Existing deployment configuration and indexing safeguards are unchanged. Back up local changes and test before pushing to GitHub; this archive does not deploy anything.
