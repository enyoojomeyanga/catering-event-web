# Catering & Events Website — Navigation Stability v0.5.1

Cumulative I05 release based on the locally validated I04 archive. Astro, TypeScript, custom CSS, Manrope and Newsreader; DS-03 Heritage Editorial. Playwright and axe added as development-only dependencies.

## Setup
Use the same compatible Node.js runtime as I02. Extract the archive directly into a fresh directory (or back up your existing project before overwriting).

```sh
npm install
npm run validate
npm run dev
```

For production output: `npm run build`, then `npm run preview`.

## Scope
Homepage, services directory, four generated service pages, about, FAQ, contact and custom 404. Shared service definitions, native FAQ disclosures, breadcrumbs, contextual WhatsApp links and text-led editorial layouts. Header/footer retained from I02. Gallery, project routes, lightbox and testimonials are deferred to I04; no false portfolio or placeholder photography is displayed. The text-led hero and service cards will receive authentic photography when available. Registered name is retained from I02 as a provisional fallback; confirm final display name before publication. Development noindex remains in place until release approval.

## Verification
Archive integrity and source structure can be checked without installing dependencies. Run `npm run validate` on your compatible local runtime; the packaging environment cannot validate the Astro build. Review mobile layout at 320/375px, tablet and desktop, keyboard navigation, FAQ disclosure, all service links, phone/email/WhatsApp destinations and a missing route. Do not deploy before approval.

## I04 — Portfolio and media (0.4.0)

No client images or reviews are included. `/gallery` has an honest empty state; navigation and proof sections remain hidden until approved work exists. `setup.json` is a technical sentinel explicitly excluded from publication.

### Add verified work
1. Place genuine JPEG/PNG/WebP images in `src/assets/images/projects/<project-slug>/`.
2. Create `src/content/projects/<project-slug>.json` (lowercase hyphenated filename). Use the example below as a field guide, not real content. Image paths are relative to the JSON file. Do not publish until content and permission have been verified.

```json
{
  "title": "REPLACE with verified project title",
  "eventType": "REPLACE with actual event type",
  "services": ["catering", "decoration"],
  "description": "REPLACE with factual description",
  "published": false,
  "permission": false,
  "featured": false,
  "cover": { "src": "../../assets/images/projects/project-slug/cover.jpg", "alt": "REPLACE with visible details" },
  "photos": [],
  "testimonial": { "quote": "REPLACE with exact authorized quote", "attribution": "REPLACE with approved attribution", "permission": false }
}
```

Omit testimonial if unavailable; optional location and date (ISO YYYY-MM-DD recommended) should be factual. Add photos using the same object shape as cover; optional `caption` is supported. Valid service identifiers: catering, decoration, baking, confectionery. Set `published` and `permission` true only after verifying rights and facts; a cover is required to appear publicly. `featured` controls homepage selection. Testimonial permission is separate. Rebuild after edits. Never place private client media in a public repository.

### Test I04
Run `npm install`, `npm run validate`, `npm run dev`. Check `/gallery` empty state and absence of Gallery navigation with no published work. With a real authorized record, check gallery navigation, project detail, homepage featured work, matching service proof, filtering with two different service categories, image links without JS, modal keyboard navigation (Left/Right, Escape, Tab), focus restoration, and 320/375/768/1440 widths. Remove any temporary test data before deployment. `noindex` remains active. No deployment performed.

Optional photo `aspect` values: `landscape` (default), `portrait` (3:4), `square` (1:1). Hero images always use 16:9. Gallery images preserve the chosen frame; original aspect ratio is preserved in the lightbox.

## I05 — Quality assurance and launch preparation (0.5.0)

```sh
npm install
npm run test:install
npm run qa
npm audit
npm audit --omit=dev
```

See [launch checklist](docs/launch-checklist.md) for manual accessibility, Lighthouse, portfolio and launch checks. The test suite assumes default noindex settings and uses a built preview on port 4322. `npm run test:report` opens the report. No production domain or approved display name has been supplied; indexing remains off. The static robots endpoint permits crawling so noindex can be read. Sitemap is empty in preview; canonical and LocalBusiness schema are emitted only with explicit indexing configuration and confirmed name/domain. This is not access control. Do not deploy until authorized.

Packaging validation: source and archive checks only; npm registry DNS EAI_AGAIN and Node 22.16.0 prevent installation/build/browser tests in this environment. No generated lockfile included; retain the one generated by your local npm install.

## I05-R1 — Navigation stability (0.5.1)

The header reserves its normal flow height while its inner surface compacts. Collapse at 112px and expand at 56px; no focusout dismissal. Native disclosures remain operable without JavaScript. Outside clicks and keyboard focus movement dismiss menus, Escape restores focus, and nested state resets on closure. No dependency changes.

After extracting over a backed-up project, run `npm install`, `npm run validate`, `npm run test:navigation`, then `npm run qa`. The targeted test uses the built preview; rebuild after any edits. Check actual phone taps and slow scrolling around 56–112px, including scrolling with a menu open. Review Lighthouse SEO audit items separately; preview indexing remains disabled.
