# Catering & Events Website — Core Pages v0.3.0

Cumulative I03 release based on the locally validated I02 archive. Astro, TypeScript, custom CSS, Manrope and Newsreader; DS-03 Heritage Editorial. No new dependencies.

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
