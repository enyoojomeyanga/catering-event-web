# Flourish — v1.4.2 typography stability

This corrective release preserves the entire v1.4.1 website and TY-05 visual design. The typography regression test now uses independent attached DOM probes for each CSS token, with route, viewport, token name, expected and measured values in failure diagnostics. All existing H1, heading overflow, document width and landscape checks remain active; the original 0.1px tolerance is unchanged.

Run `npm install && npm run test:typography` first, then `PUBLIC_ENABLE_INDEXING=false npm run qa`. Each Playwright run retains the fresh validated build gate. No dependencies, website source, imagery or configuration changed. Full Astro QA must be run locally.

---

# Flourish — v1.4.0 layout, typography and mobile refinement

## Current release

- PH-05: integrated page titles in the first content section. Services, Portfolio, category and project pages use left-aligned titles; About integrates its title into the introduction; Contact and FAQs use centred titles without a separate banner. The 404 title is integrated too.
- SP-B: adjacent sections each receive half the intended gap (20px mobile, 24px tablet, 32px desktop). Major service rows use 40/48/64px spacing. Heading-to-copy spacing is 12px, paragraph spacing is 16px, and primary content groups use 24px. First content starts 24/28/32px below the navbar.
- TY-02: fluid Playfair Display heading sizes (hero 38–64px; page 30–40px; sections 26–30px; subheadings 21–24px), Inter body 16px mobile / 17px desktop, 15px controls and 13px captions. Fonts and palette unchanged. Long headings may wrap naturally.
- Adaptive hero: lighter left-to-right desktop shading, bottom text scrim on mobile, and a separate top scrim for the transparent navigation. Short landscape screens use a directional overlay. Hero asset, readable fallback, overlaid text and full-screen composition retained; narrow screens stack the two hero actions.
- Footer: removes the entire direct contact column; retains business introduction and quick links (including Home and Contact). Copyright centred on every screen. Contact details remain on Contact.
- Mobile: form pairs respond to the available form width, gallery controls fit narrow viewports, photo hover effects apply only to fine pointers, and back-to-top avoids an open mobile menu, lightbox or connection notice. No change to actual enquiry submission configuration.
- Portfolio: dedicated aspect-ratio image frame clips the hover scale independently of its caption. Tests check loaded image state, filter, frame geometry and pseudo-element overlays for all four cards on both pages, with a separate animated hover test. The exact original failing assertion was not supplied, so this addresses a confirmed structural risk rather than claiming a verified reproduction of the previous failure.
- Fresh-build gate, all routes, existing high-resolution images, redirects, caching, navigation behaviour and dependencies preserved. The unfinished v1.3.2 working copy was identical to v1.3.1; this release is cumulative from that source.

## Install and test

Stop all development/preview servers, back up local changes, preserve `.env`, `.git`, local lockfile and custom deployment configuration. Extract the ZIP into the existing project root. Run:

```sh
npm install && PUBLIC_ENABLE_INDEXING=false npm run qa
```

For focused layout and portfolio validation:

```sh
PUBLIC_ENABLE_INDEXING=false npm run test:layout
PUBLIC_ENABLE_INDEXING=false npx playwright test tests/usability.spec.ts
```

Each Playwright run requires a fresh validated build. Use `npm run test:report` for the last report, and `npm run dev` for visual inspection. Test the hero on actual phones, including text contrast over the photograph; inspect all pages and contact actions before deployment. Configured Formspree response tests are mocked, and may skip if the endpoint is absent.

## Packaging verification

62 script fragments and 28 CSS fragments passed syntax parsing. 11 isolated Chromium scenarios passed using representative HTML, the actual updated component CSS and the header script: ten viewport sizes (320×568 through 1440×900, including 844×390 landscape), and desktop hover clipping. The full Astro build and browser QA remain pending because the registry DNS probe returned EAI_AGAIN. The isolated harness uses fallback fonts, not compiled Astro markup; actual font rendering, visual contrast and complete page/interaction coverage must be verified locally. The archive does not contain .env, node_modules, dist or generated test reports. No deployment changes were made.

---

## Historical release notes (superseded where applicable)

# Flourish — v1.3.1 build stability and QA correction

This corrective release preserves the v1.3.0 design, dependencies, photographs, routes, caching and Formspree configuration. It fixes the reported TS18047 nullability errors in `GalleryGrid.astro` by passing the checked dialog to a typed initializer, guarding its controls and using scoped callbacks. Lightbox requests now cancel old listeners and timers when changing images or closing, with recovery and focus restoration retained. TypeScript uses an explicit source/test include list and excludes generated reports, output, dependencies and coverage.

Every Playwright run (including direct `npx playwright test`) now starts its preview server with `npm run validate`, which removes old `dist`, type-checks and builds, in that order. A failed prerequisite prevents preview startup and browser tests. `npm run build` also removes previous output. `npm run qa` runs the browser suite with this fresh-build gate and then inventories its assets. Preview startup timeout is 180 seconds to account for the build. No dependency upgrades.

## Installation and testing (current release)

Stop all local servers (especially port 4322). Back up local changes and keep `.env`, `.git`, local package-lock.json and deployment settings. Extract the root-level ZIP into your existing project and run:

```sh
npm install && PUBLIC_ENABLE_INDEXING=false npm run qa
```

For focused runs, `npm run test:navigation` and `npm run test:performance` each perform their own validated fresh build. For type checking/build alone use `npm run validate`. The revised performance suite verifies elements actually exist, deterministic slow-loading and loader timeout, recovery after an enlarged-image failure, mobile booking placement and higher-resolution portfolio source dimensions. The full build and browser suite must run locally; the packaging environment has no Astro dependencies and registry DNS is unavailable. Generated reports remain available for inspection with `npm run test:report` but are not part of type checking. Existing conditional form tests may skip if the Formspree endpoint is unconfigured. Keep preview indexing disabled for QA.

---

Packaging verification for v1.3.1: strict standalone TypeScript check of the actual lightbox client script passed; 61 script fragments and 28 CSS fragments parsed; 10 isolated Chromium component checks passed, including recovery to a healthy next photograph; a deliberate stale-output marker was removed even when validation failed. Full Astro checking/build and the complete Playwright suite remain unverified. Registry probe returned EAI_AGAIN.

## Previous releases (historical notes)

# Flourish — v1.3.0 performance and interaction refinement

- Corrects the desktop Home assertion (normalizes `/` correctly); no application link was changed for this test bug.
- Replaces all 12 former 356px illustration sources with separate native-resolution WebP photographs (1024–1672px wide, 941–1536px tall). The existing 1672×941 hero is retained for its overlay composition. Some gallery subjects and names have changed; descriptions and category mappings match the new photographs. Generated photos remain illustrative, not completed client work. Responsive output widths extend up to 1440px for service images and 1280px for gallery images, without upscaling. Genuine assets still take priority. The 4 obsolete illustration filenames may remain in an overwritten local project but are no longer imported; remove only if you have not repurposed them.
- Branded loader appears only after 350ms while the initial document is still loading, closes on DOM readiness/interaction or by a 3.5s timeout, and remains hidden without JS. Internal page navigation gets a delayed progress bar with an 8s cutoff. Offline notice has reload/dismiss actions. Broken inline photos use a dimension-preserving SVG fallback; failed hero images leave the dark, readable hero. Lightbox loading, error and 15s timeout feedback allow closing or selecting another photo. Existing form validation and timeout handling are retained. Initial HTML/network failure before the website loads is handled by the browser; this is not an offline PWA.
- Vercel cache header is limited to hashed `/_astro/` assets (1 year, immutable); default HTML revalidation remains managed by Vercel. No service worker or persistent cached form data. Explicit hover/focus prefetch for selected internal navigation with Astro's native prefetch; contact requests use `no-store`. Existing redirects preserved. Verify deployment headers with `curl -I` on a real hashed asset and on an HTML page; local Astro preview does not apply Vercel rules.
- Motion: 800ms staggered hero, 700ms section reveal, 650ms image appearance, 450ms gallery hover, 400ms supported native page crossfade, 350ms menu, 300ms FAQ answer entrance/back-to-top, 250ms button. All are progressive enhancements; reduced motion supported, no scroll-dependent height change. Section text remains readable during reveals; no forced loading delays.
- Mobile booking action lives inside the menu; desktop CTA unchanged. No link underlines; colour, weight, interaction surfaces and keyboard focus differentiate links.

## Validate locally

Back up local modifications; preserve `.env` and your existing deployment configuration. If overwriting, note that the 4 obsolete image files are not used. Run:

```sh
npm install
npm run validate
npm run test:navigation
npm run test:performance
PUBLIC_ENABLE_INDEXING=false npm run qa
```

Use `npm run test:install` if Chromium is missing; `npm run test:report` opens reports. Test slow 3G and offline in DevTools, test a broken image, physical mobile menu and keyboard navigation. Recheck Lighthouse and the resource inventory after the larger images. No email is sent by automated tests. Keep the local lockfile. Packaging checks: 60 TypeScript/JavaScript syntax fragments and 28 CSS fragments parsed successfully; 9 isolated Chromium component checks passed (header/booking at four widths, broken image and hero fallback, lightbox error/focus, offline notice, simulated loader readiness, and no-JS booking). Browser network navigation and npm registry DNS are blocked in the packaging environment; these checks do not use a built Astro website. Production cache behavior, real email delivery, full Astro build and browser QA must be confirmed locally or on Vercel.

# Flourish — v1.2.0 navigation and usability refinement

Transparent homepage navigation with solid scrolled/supporting-page header; fixed height at all scroll positions. Home is explicit on desktop and mobile. Active links show a lavender pill and dot; portfolio descendants identify the current section. Back-to-top appears after a viewport of scrolling, with a native footer fallback. Portfolio labels now sit below unshaded photographs. Shared page headings no longer contain script labels. Desktop navigation starts at 76rem to fit the added Home link. Existing Formspree configuration, deployment settings and routes are retained. The no-JavaScript header defaults to a solid white background. The existing compact threshold is retained for scroll state, but the physical header height no longer changes.

The portfolio overlay has been removed; existing 356×356 placeholder assets are still resolution-limited. Replace with higher-resolution genuine photographs for sharper large cards.

Validation in packaging environment: TypeScript syntax and CSS parse checks passed; isolated Chromium header/back-to-top tests at 320, 375, 1216 and 1440px and native no-JavaScript footer link passed. These tests used representative HTML and actual component styles/scripts, not a built Astro website. Full build unavailable (`astro: not found`).

Run `npm install`, `npm run validate`, `npm run test:navigation`, then `PUBLIC_ENABLE_INDEXING=false npm run qa`. Test on physical mobile and inspect photo sharpness.

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

## v1.4.1 — TY-05 Expressive Luxury

- Playfair Display titles: mobile/tablet/desktop hero 44/64/80px; page H1 38/48/56px; H2 30/36/42px; H3 24/26/30px. Body Inter 16/17/18px, links/actions 16px. Fluid rem/vw interpolation, 16px root assumed. H1 weight 700, other headings 600.
- Preserve navbar footprint and 15px navigation type; compact four-column portfolio cards use 24–28px headings and short landscape hero caps at 52px. Small form and utility text retain their functional sizes.
- Existing page arrangement, images, gradients, motion, booking and contact features remain intact. No dependencies changed.
- Run `npm run test:typography` for computed-size and wrapping regressions; run `PUBLIC_ENABLE_INDEXING=false npm run qa` for the complete fresh-build suite.
