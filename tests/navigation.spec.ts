import { expect, test, type Page } from '@playwright/test';

const routes = [['Home','/'],['About','/about'],['Services','/services'],['Portfolio','/gallery'],['FAQs','/faq'],['Contact','/contact']] as const;

const mobileMenu = (page: Page) => page.locator('.mobile-nav');

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
      await expect(menu.locator('nav details')).toHaveCount(0);
      const link = menu.getByRole('link', { name: label, exact: true });
      await expect(link).toBeVisible();
      await link.tap();
      await expect(page).toHaveURL(url => (url.pathname.replace(/\/$/, '') || '/') === route);
      await expect(mobileMenu(page)).not.toHaveAttribute('open', '');
    } finally { await context.close(); }
  });
}

test('flat mobile menu: escape, outside dismissal and resize', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = mobileMenu(page);
  const summary = menu.locator(':scope > summary');
  await summary.click();
  await expect(menu.locator('nav details')).toHaveCount(0);
  await menu.getByRole('link', { name: 'Services', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
  await summary.click();
  await page.locator('.header-row').click({ position: { x: 2, y: 2 } });
  await expect(menu).not.toHaveAttribute('open', '');
  await summary.click();
  await expect(menu.getByRole('link', { name: 'Services', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.locator('.desktop-nav')).toBeVisible();
});

for (const [label, route] of routes) {
  test(`desktop direct navigation: ${label}`,async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.goto(route === '/' ? '/about' : '/');
    const nav=page.locator('.desktop-nav');
    await expect(nav.locator('details')).toHaveCount(0);
    await nav.getByRole('link',{name:label,exact:true}).click();
    await expect(page).toHaveURL(url=>(url.pathname.replace(/\/$/,'')||'/')===route);
    await expect(nav.getByRole('link',{name:label,exact:true})).toHaveAttribute('aria-current','page');
  });
}
for (const [label,slug] of [['Catering','catering'],['Event decoration','decoration'],['Baking & cakes','baking'],['Small chops & confectionery','confectionery']]) {
  test(`service directory access: ${slug}`,async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.goto('/');
    await page.locator('main .service-grid').getByRole('link',{name:label,exact:true}).click();
    await expect(page).toHaveURL(url=>url.pathname.replace(/\/$/,'')==='/services'&&url.hash===`#${slug}`);
    await expect(page.locator(`main article#${slug} h2`)).toHaveText(label);
    await expect(page.locator('.desktop-nav a[href="/services"]')).toHaveAttribute('aria-current','page');
  });
}

for (const width of [320, 375]) {
  test(`flat mobile panel stays within viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 568 });
    await page.goto('/');
    const header = page.locator('[data-header]');
    const initial = await header.boundingBox();
    await mobileMenu(page).locator('summary').click();
    const panel = await page.locator('.mobile-panel').boundingBox();
    expect(panel).not.toBeNull();
    expect(panel!.x).toBeGreaterThanOrEqual(0);
    expect(panel!.x + panel!.width).toBeLessThanOrEqual(width + 1);
    expect(panel!.y + panel!.height).toBeLessThanOrEqual(569);
    expect((await header.boundingBox())?.height).toBe(initial?.height);
    await mobileMenu(page).getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(/\/contact\/?$/);
  });
}

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
