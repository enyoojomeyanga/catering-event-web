# Launch acceptance checklist — v1.1.0

Do not deploy or enable indexing without separate approval. The build defaults to noindex; this is not access control. Private materials must never be placed in a public repository or public deployment.

## Local preview
- Node 26 (existing compatible runtime), `npm install`, inspect deprecation warnings and retain generated package-lock.json. Do not bypass peer dependency or engine checks.
- `npm run test:install` (on Linux, if browser system libraries are missing, run `npx playwright install --with-deps chromium`, which may require sudo).
- `npm run qa` builds, inventories assets and runs browser tests against the built static preview. Stop conflicting servers on port 4322. `npm run test:report` opens HTML test report. Tests assume indexing disabled.
- `npm audit` and `npm audit --omit=dev`; investigate advisories, do not apply forced upgrades blindly.
- Inspect each core page at 320, 375, 768, 1024, 1280, 1920 and 2560 CSS pixels. Check zoom 200% and reflow at 400%, visible keyboard focus, sticky header not obscuring focus, skip link, keyboard-only menus, FAQ, reduced motion, no-JS, high contrast and screen reader labels. Test actual touch device and other engines (Firefox, Safari) manually; default suite uses Chromium.
- Verify all service enquiries, phone/email details and addresses with business owner. Email form requires a configured Formspree endpoint; no payments are implemented.
- Inspect font rendering including Nigerian names and ₦; keep Fontsource license notices in distributed packages. Do not remove glyph subsets without confirming coverage.

## Performance
Run `npm run preview` then Chrome DevTools Lighthouse on localhost:4321 (mobile profile, fresh browser, production build). Repeat three times for home, service, gallery and project with real content; record median results. Measure Network initial transfer with disabled cache. Targets: initial JS and CSS each <50 KiB compressed; fonts <150 KiB; mobile initial transfer <600 KiB; hero mobile 100–200 KiB and desktop 200–400 KiB where quality permits. Asset inventory is aggregate emitted size, not per-page transfer. Browser test attaches resource inventory and checks the initial homepage font budget. Local uncompressed sizes are not production transfer sizes. Lighthouse lab LCP/CLS are useful but not field Core Web Vitals; target field 75th percentile LCP <=2.5s, INP <=200ms, CLS <=0.1. INP needs real interaction data. No scores have been measured in the packaging environment.

## Genuine portfolio validation — pending assets
Verify actual client permission, project titles, service categorization, captions and alt text. Use two different service categories to exercise category navigation; check project routes, hero cropping, responsive source sets, all images load, modal previous/next, Escape, focus return, keyboard trap, error recovery, no-JS image links and testimonials. Confirm private and setup records never appear in generated HTML or sitemap. Do not ship fake test records. Re-run accessibility and performance checks with real photos.

## Production authorization gate
- The display name is approved as Flourish Catering and Events Services. Confirm logo, production HTTPS origin, content permissions and commercial hosting plan. Replace illustrative assets with genuine approved work before launch, or obtain explicit approval for retaining contextually disclosed illustrations.
- Use `.env.example` as reference. With explicit deployment/indexing approval, configure `PUBLIC_SITE_URL` as confirmed HTTPS origin and `PUBLIC_ENABLE_INDEXING=true` in production build only. Preview builds must leave indexing disabled. Never commit private environment data. Invalid origin or missing approved display name blocks an indexing-enabled build.
- `npm run build` with production settings. Check output HTML canonical links and Open Graph metadata; homepage LocalBusiness JSON-LD, sitemap contains only indexable pages; 404 and illustration-only gallery/category pages noindex and absent from sitemap. Test final domain redirects, HTTPS, 404 status, robots.txt, sitemap and social previews. Social image requires real approved asset; not included yet.
- Deploy only after separate approval. This archive does not modify the existing GitHub repository or Vercel deployment. Submit sitemap in Search Console after launch; monitor actual field vitals and indexing.

## v1.1.0 refinement

- Confirm all four legacy service routes redirect to their matching `/services#...` section in the Vercel preview.
- Follow `docs/contact-form-setup.md`; confirm a real test email is received, verify spam protection and Reply-To.
- Check full-viewport hero cropping, contrast and layout at 320px, 375px and desktop widths.
- Replace illustrative photography with genuine authorized client assets before treating any gallery as completed work.
