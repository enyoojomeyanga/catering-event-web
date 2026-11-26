import { expect, test } from '@playwright/test';

for (const width of [320, 375, 1024, 1440]) {
  test(`booking is in the appropriate navbar location at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/');
    const header = page.locator('[data-header]');
    const booking = header.getByRole('link', { name: 'Book on WhatsApp', exact: true });
    const desktop = header.locator('.desktop-book');
    const mobile = header.locator('.mobile-panel .mobile-book');
    await expect(desktop).toHaveCount(1);
    await expect(mobile).toHaveCount(1);
    if (width < 1216) {
      await expect(desktop).toBeHidden();
      await expect(mobile).toBeHidden();
      await expect(booking).toHaveCount(0);
      await header.locator('summary').click();
      await expect(booking).toHaveCount(1);
      await expect(header.locator('.mobile-panel .mobile-book')).toBeVisible();
      await expect(booking).toHaveAttribute('href', /^https:\/\/wa\.me\/2347052153205/);
      await page.keyboard.press('Escape');
      await expect(booking).toHaveCount(0);
    } else {
      await expect(booking).toHaveCount(1);
      await expect(desktop).toBeVisible();
      await expect(mobile).toBeHidden();
    }
  });
}

test('fast loads do not retain a loader and reduced motion is respected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-initial-loader]')).toHaveCount(1);
  await expect(page.locator('[data-navigation-progress]')).toHaveCount(1);
  await expect(page.locator('[data-initial-loader]')).toBeHidden();
  await expect(page.locator('[data-navigation-progress]')).toBeHidden();
  await expect(page.locator('main h1')).toBeVisible();
  const duration = await page.locator('.hero-copy h1').evaluate(el => parseFloat(getComputedStyle(el).animationDuration));
  expect(duration).toBeLessThanOrEqual(0.01);
});

// Hold a deferred script deterministically, even if Astro inlines its own small scripts.
// The actual application loader is not replaced or mocked.
for (const mode of ['ready', 'timeout'] as const) {
  test(`slow document loading dismisses branded loader on ${mode}`, async ({ page }) => {
    let release: () => void = () => {};
    const hold = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/__qa-loader-hold.js', async route => {
      await hold;
      await route.fulfill({ contentType: 'application/javascript', body: '/* QA hold released */' });
    });
    await page.route(url => url.pathname === '/', async route => {
      const response = await route.fetch();
      const body = (await response.text()).replace('</head>', '<script defer src="/__qa-loader-hold.js"></script></head>');
      await route.fulfill({ response, body });
    });
    try {
      await page.goto('/', { waitUntil: 'commit' });
      const loader = page.locator('[data-initial-loader]');
      await expect(loader).toHaveCount(1);
      await expect(loader).toBeVisible({ timeout: 2500 });
      if (mode === 'ready') release();
      await expect(loader).toBeHidden({ timeout: 5000 });
      await expect(page.locator('main h1')).toBeVisible();
    } finally {
      release();
    }
  });
}

test('network failure shows a dismissible offline notice', async ({ page, context }) => {
  await page.goto('/about');
  await context.setOffline(true);
  await expect(page.locator('[data-connection-notice]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reload page' })).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss connection notice' }).click();
  await expect(page.locator('[data-connection-notice]')).toBeHidden();
  await context.setOffline(false);
  await expect(page.locator('[data-connection-notice]')).toBeHidden();
});

test('broken hero keeps text readable', async ({ page }) => {
  await page.route(/\/_astro\/[^/]+\.(?:webp|avif|png|jpe?g)(?:\?.*)?$/, route => route.abort());
  await page.goto('/');
  await expect(page.locator('.hero-image')).toHaveAttribute('data-image-state', 'error');
  await expect(page.locator('.hero-image')).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('.hero-copy h1')).toBeVisible();
  await expect(page.locator('.hero-copy').getByRole('link', { name: 'Explore services' })).toBeVisible();
});

test('broken portfolio photo receives a dimension-preserving fallback', async ({ page }) => {
  await page.route(/\/_astro\/[^/]+\.(?:webp|avif|png|jpe?g)(?:\?.*)?$/, route => route.abort());
  await page.goto('/gallery');
  const image = page.locator('.category-link img').first();
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute('data-image-state', 'error');
  await expect(image).toHaveAttribute('src', /^data:image\/svg\+xml,/);
  await expect(image).toHaveAttribute('alt', /^Image unavailable:/);
  await expect(page.locator('.category-link').first()).toBeVisible();
});

test('failed enlarged image gives a recoverable lightbox error', async ({ page }) => {
  await page.goto('/gallery/category/catering');
  const first = page.locator('[data-lightbox-photo]').first();
  const large = await first.evaluate((link: HTMLAnchorElement) => link.href);
  await page.route(large, route => route.abort());
  await first.click();
  const dialog = page.locator('dialog[data-lightbox]');
  await expect(dialog.locator('[data-image-error]')).toBeVisible();
  await expect(dialog.locator('[data-image-loading]')).toBeHidden();
  await expect(dialog.locator('[data-full]')).toBeHidden();
  await expect(dialog.locator('[data-full]')).toHaveCount(1);
  // Navigate to another image: the error must clear and the new image must load.
  if (await page.locator('[data-lightbox-photo]').count() > 1) {
    await dialog.getByRole('button', { name: 'Next image' }).click();
    await expect(dialog.locator('[data-full]')).toBeVisible();
    await expect(dialog.locator('[data-image-error]')).toBeHidden();
    await expect.poll(() => dialog.locator('[data-full]').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
  }
  await dialog.getByRole('button', { name: 'Close image viewer' }).click();
  await expect(first).toBeFocused();
});

test('no underlines on visible links, including hover states', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of ['/', '/about', '/services', '/gallery', '/faq', '/contact']) {
    await page.goto(route);
    const underlined = await page.locator('a:visible').evaluateAll(links => links.filter(link => getComputedStyle(link).textDecorationLine.includes('underline')).map(link => link.textContent));
    expect(underlined).toEqual([]);
    const link = page.locator('.desktop-nav a').first();
    await link.hover();
    await expect(link).toHaveCSS('text-decoration-line', 'none');
  }
});

test('enhanced hero motion is present when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.hero-copy h1')).toHaveCSS('animation-duration', '0.8s');
});

test('no JavaScript: loader stays hidden and mobile booking works natively', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4322/');
    await expect(page.locator('[data-initial-loader]')).toHaveCount(1);
    await expect(page.locator('[data-initial-loader]')).toBeHidden();
    await expect(page.locator('.mobile-book')).toHaveCount(1);
    await expect(page.locator('.mobile-book')).toBeHidden();
    await page.locator('.mobile-nav summary').click();
    await expect(page.locator('.mobile-book')).toBeVisible();
    await expect(page.locator('.mobile-book')).toHaveAttribute('href', /^https:\/\/wa\.me\/2347052153205/);
  } finally { await context.close(); }
});

// Prevent a regression to the old 356px placeholder source files in the built site.
test('portfolio category photographs retain high-resolution source dimensions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/gallery');
  const images = page.locator('.category-link img');
  await expect(images).toHaveCount(4);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
    expect(Number(await image.getAttribute('width'))).toBeGreaterThanOrEqual(1024);
  }
});
