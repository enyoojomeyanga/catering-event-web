import { expect, test, type Page } from '@playwright/test';

const routes = [
  ['Home', '/'], ['All services', '/services'], ['Catering', '/services/catering'],
  ['Event decoration', '/services/decoration'], ['Baking & cakes', '/services/baking'],
  ['Small chops & confectionery', '/services/confectionery'], ['About', '/about'], ['Contact', '/contact'],
] as const;

const mobileMenu = (page: Page) => page.locator('.mobile-nav');
const nestedMenu = (page: Page) => mobileMenu(page).locator('nav details');

for (const [label, route] of routes) {
  test(`touch navigation: ${label}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true,
    });
    try {
      const page = await context.newPage();
      // Start on a different page so a Home tap must actually navigate.
      await page.goto(`http://127.0.0.1:4322${route === '/' ? '/about' : '/'}`);
      const menu = mobileMenu(page);
      await menu.locator(':scope > summary').tap();
      await expect(menu).toHaveAttribute('open', '');
      if (route.startsWith('/services')) {
        await nestedMenu(page).locator('summary').tap();
        await expect(nestedMenu(page)).toHaveAttribute('open', '');
      }
      const link = menu.getByRole('link', { name: label, exact: true });
      await expect(link).toBeVisible();
      await link.tap();
      await expect(page).toHaveURL(url => url.pathname.replace(/\/$/, '') === route.replace(/\/$/, ''));
      await expect(mobileMenu(page)).not.toHaveAttribute('open', '');
    } finally { await context.close(); }
  });
}

test('nested escape, outside dismissal and reopening', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = mobileMenu(page);
  const summary = menu.locator(':scope > summary');
  const nested = nestedMenu(page);
  const nestedSummary = nested.locator('summary');
  await summary.click(); await nestedSummary.click();
  await expect(nested).toHaveAttribute('open', '');
  await nestedSummary.focus(); await page.keyboard.press('Escape');
  await expect(nested).not.toHaveAttribute('open', '');
  await expect(menu).toHaveAttribute('open', '');
  await expect(nestedSummary).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
  await summary.click(); await nestedSummary.click();
  // Brand is outside both disclosures; click a non-navigating surface instead.
  await page.locator('.header-row').click({ position: { x: 2, y: 2 } });
  await expect(menu).not.toHaveAttribute('open', '');
  await summary.click();
  await expect(nested).not.toHaveAttribute('open', '');
  await expect(menu.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.locator('.desktop-nav')).toBeVisible();
});

for (const width of [320, 375, 1440]) {
  test(`sticky header stable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const header = page.locator('[data-header]');
    const surface = header.locator('.header-surface');
    const initial = await header.evaluate(el => el.getBoundingClientRect().height);
    const expanded = await surface.evaluate(el => el.getBoundingClientRect().height);
    const scrollTo = async (y: number) => {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(y);
    };
    await scrollTo(120);
    await expect(header).toHaveClass(/\bcompact\b/);
    expect(await surface.evaluate(el => el.getBoundingClientRect().height)).toBeLessThanOrEqual(expanded);
    for (const y of [100, 81, 79, 80, 100, 60]) {
      await scrollTo(y);
      await expect(header).toHaveClass(/\bcompact\b/);
      expect(await header.evaluate(el => el.getBoundingClientRect().height)).toBeCloseTo(initial, 0);
    }
    await scrollTo(50);
    await expect(header).not.toHaveClass(/\bcompact\b/);
    for (const y of [79, 81, 100, 111]) {
      await scrollTo(y);
      await expect(header).not.toHaveClass(/\bcompact\b/);
      expect(await header.evaluate(el => el.getBoundingClientRect().height)).toBeCloseTo(initial, 0);
    }
    await scrollTo(120);
    await expect(header).toHaveClass(/\bcompact\b/);
    // Verify a stationary scroll position and class across several rendered frames.
    const frames = await page.evaluate(async () => {
      const header = document.querySelector<HTMLElement>('[data-header]')!;
      const readings: { y: number; height: number; compact: boolean }[] = [];
      for (let i = 0; i < 12; i++) {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        readings.push({ y: scrollY, height: header.getBoundingClientRect().height, compact: header.classList.contains('compact') });
      }
      return readings;
    });
    expect(frames.every(frame => frame.y === 120 && frame.compact && Math.abs(frame.height - initial) < 1)).toBeTruthy();
  });
}
