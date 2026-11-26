# Flourish Catering and Events Services — v1.1.0

Veez-inspired redesign with a full-viewport photographic hero, consolidated service directory, expanded About page and email enquiries. Existing visual identity, navigation stability, WhatsApp booking, project collection and SEO safeguards remain intact.

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

The 13 generated WebP photographs are illustrative, not real client work. They live in `src/assets/images/illustrations/` and are registered in `src/data/illustrations.ts`. A contextual notice appears on portfolio pages using illustrations; individual image badges and captions have been removed. No fictional projects or testimonials are included. The homepage uses the dedicated `reception-hero.webp`. Replace the file and update its description in `src/data/illustrations.ts` when an authorized real photo is available. Other service imagery prefers eligible project covers when available. Illustration-only galleries remain noindex and excluded from the production sitemap.

Edit service copy in `src/data/services.ts`, contact details in `src/data/business.ts` and FAQs in `src/data/faqs.ts`. Verify provisional offerings before publication. Use project records for genuine proofs of work.

## Add genuine projects

Put approved photographs in `src/assets/images/projects/<project-slug>/` and create `src/content/projects/<project-slug>.json` following the schema in `src/content.config.ts`. The cover uses a relative path such as `../../assets/images/projects/<project-slug>/cover.jpg`. Supply a verified title, eventType, description, services (catering, decoration, baking, confectionery), cover `{src,alt}`, optional photos with alt text and captions, and publication/permission flags. Set `published` and `permission` to true only after approval. Set `featured` true for homepage eligibility. Testimonials require their own permission flag and verified quote/attribution. The `setup.json` record is excluded. Do not add private client material to a public repository. Genuine video content is deferred.

## Acceptance

Run `PUBLIC_ENABLE_INDEXING=false npm run qa` (the preview-only SEO checks expect noindex). Check all pages, four legacy service redirects, hero cropping, form configuration, portfolio category links, image viewer, mobile navigation, keyboard focus and scroll stability. Repeat Lighthouse and manual testing on a physical mobile device. For email activation follow `docs/contact-form-setup.md`. Existing local `.env` and deployment settings should be preserved. Review and merge any existing `vercel.json` before overwriting. No GitHub push or deployment is made by this archive.

Packaging checks are not a substitute for the full Astro build or browser QA. The packaging environment lacks installed Astro dependencies; full validation remains pending. The original reference CSS and exact motion timings remain unverified. Genuine photographs, logo, staff profiles and social links are still pending.

## v1.1.0 — Website refinement

- Full-viewport homepage hero with responsive WebP photography and readable overlay. Replace `src/assets/images/illustrations/reception-hero.webp` with an authorized real photo when available.
- All four service descriptions now live at `/services`, with section IDs `catering`, `decoration`, `baking` and `confectionery`. Old service routes are redirects (Astro static fallback and Vercel permanent redirects); check after deploying. Homepage links target the sections; sitemap excludes old routes.
- About page includes who we are, booking approach and practical planning information. No invented history or team biographies.
- Repeated AI image captions removed; portfolio pages retain a single contextual notice where illustrative imagery is shown. Genuine photo captions are unchanged.
- Contact page includes an email enquiry form and WhatsApp. See `docs/contact-form-setup.md` for provider and Vercel configuration. The form is disabled until the endpoint is supplied. All existing contact and brand data are preserved.
- Existing dependency versions and stable navbar are unchanged. Run `PUBLIC_ENABLE_INDEXING=false npm run qa` before pushing, and test old URLs and actual email delivery on a preview deployment. Merge any existing local `vercel.json` rules with the included redirect rules instead of overwriting unrelated deployment settings.
