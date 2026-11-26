import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const paths = ['/', '/services', '/services/catering', '/services/decoration', '/services/baking', '/services/confectionery', '/about', '/faq', '/contact', '/gallery'];
for (const path of paths) {
  test(`core page ${path}`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('head meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-NG');
    const links = await page.locator('a[href^="/"]').evaluateAll(elements => [...new Set(elements.map(el => (el as HTMLAnchorElement).href))]);
    for (const link of links) expect((await page.request.get(link)).ok(), link).toBeTruthy();
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    await info.attach('axe-results', { body: JSON.stringify(result.violations, null, 2), contentType: 'application/json' });
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
for (const width of [320, 375, 768, 1024, 1280, 1920, 2560]) {
  test(`responsive layout ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} at ${width}px`).toBeTruthy();
    }
  });
}
test('desktop disclosure and keyboard dismissal', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const menu = page.locator('.services-menu');
  const summary = menu.locator('summary');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
});
test('mobile navigation and FAQ', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = page.locator('.mobile-nav');
  await menu.locator(':scope > summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await expect(menu.locator('nav details')).toHaveCount(0);
  await expect(menu.getByRole('link', { name: 'Catering', exact: true })).toBeVisible();
  await menu.getByRole('link', { name: 'Catering', exact: true }).click();
  await expect(page).toHaveURL(/\/services\/catering\/?$/);
  await page.goto('/faq');
  const faq = page.locator('.faq-list details').first();
  await faq.locator('summary').click();
  await expect(faq).toHaveAttribute('open', '');
});
test('preview indexing safety and 404', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  expect(await (await page.request.get('/robots.txt')).text()).not.toContain('Sitemap:');
  expect(await (await page.request.get('/sitemap.xml')).text()).not.toContain('<loc>');
  const response = await page.goto('/missing-page-qa');
  expect(response?.status()).toBe(404);
  await expect(page.locator('main h1')).toBeVisible();
});
test('WhatsApp destination', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('a[href*="wa.me"]').evaluateAll(elements => elements.map(el => (el as HTMLAnchorElement).href));
  expect(links.length).toBeGreaterThan(0);
  for (const href of links) { const url = new URL(href); expect(url.origin).toBe('https://wa.me'); expect(url.pathname).toBe('/2347052153205'); }
});
test('native mobile menu without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  try { const page = await context.newPage(); await page.goto('http://127.0.0.1:4322/'); await page.locator('.mobile-nav > summary').click(); await expect(page.locator('.mobile-nav')).toHaveAttribute('open', ''); await expect(page.locator('.mobile-nav nav details')).toHaveCount(0); await expect(page.locator('.mobile-nav').getByRole('link', { name: 'Catering', exact: true })).toBeVisible(); } finally { await context.close(); }
});
test('illustrative or populated gallery lightbox', async ({ page }) => {
  await page.goto('/gallery');
  const photos = page.locator('[data-lightbox-photo]');
  expect(await photos.count()).toBeGreaterThan(0);
  const first = photos.first(); await first.click();
  await expect(page.locator('dialog[data-lightbox]')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.locator('dialog[data-lightbox]')).not.toBeVisible(); await expect(first).toBeFocused();
});
test('mobile accessibility with navigation open', async ({ page }, info) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.locator('.mobile-nav > summary').click();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  await info.attach('mobile-axe-results', { body: JSON.stringify(result.violations, null, 2), contentType: 'application/json' });
  expect(result.violations).toEqual([]);
});
test('initial mobile resource inventory', async ({ page }, info) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const inventory = await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const sum = (pattern: RegExp) => entries.filter(r => pattern.test(new URL(r.name).pathname)).reduce((total,r) => total + r.encodedBodySize, 0);
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return { javascriptBytes: sum(/\.m?js$/), cssBytes: sum(/\.css$/), fontBytes: sum(/\.woff2?$/), imageBytes: sum(/\.(webp|avif|png|jpe?g)$/), htmlBytes: nav?.encodedBodySize ?? 0, totalEncodedBytes: (nav?.encodedBodySize ?? 0) + entries.reduce((total,r)=>total+r.encodedBodySize,0) };
  });
  await info.attach('initial-mobile-resource-inventory', { body: JSON.stringify(inventory, null, 2), contentType: 'application/json' });
  // Local preview may serve assets uncompressed. Only the font budget is directly comparable.
  expect(inventory.fontBytes).toBeLessThanOrEqual(150 * 1024);
});
