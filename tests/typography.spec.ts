import { test, expect } from '@playwright/test';
const routes = ['/', '/about', '/services', '/gallery', '/gallery/category/catering', '/gallery/category/decoration', '/gallery/category/baking', '/gallery/category/confectionery', '/faq', '/contact', '/404'];
for (const {width,height,hero,h1,h2,h3,body} of [
  {width:320,height:568,hero:44,h1:38,h2:30,h3:24,body:16},
  {width:375,height:812,hero:44,h1:38,h2:30,h3:24,body:16},
  {width:768,height:1024,hero:64,h1:48,h2:36,h3:26,body:17},
  {width:1440,height:900,hero:80,h1:56,h2:42,h3:30,body:18},
]) {
  test(`TY-05 computed scale and wrapping at ${width}px`, async ({page}) => {
    test.setTimeout(120000);
    await page.setViewportSize({width,height});
    await page.emulateMedia({reducedMotion:'reduce'});
    for (const path of routes) {
      await test.step(`${width}px · ${path}`, async () => {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        const title = page.locator('main h1');
        await expect(title, `${path}: exactly one main H1`).toHaveCount(1);
        await expect(title, `${path}: H1 visible`).toBeVisible();
        const size = await title.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        const expectedTitle = path === '/' ? hero : h1;
        expect(Math.abs(size - expectedTitle), `${path}: H1 expected ${expectedTitle}px, measured ${size}px`).toBeLessThan(.1);
        const measured = await page.evaluate(() => {
          const tokens = ['--type-h2', '--type-h3', '--type-body', '--type-link'];
          // Use one fresh, attached probe per token. Never mutate and reuse a probe.
          return tokens.map(token => {
            const probe = document.createElement('div');
            probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
            probe.style.fontSize = `var(${token})`;
            document.body.append(probe);
            try {
              return { token, size: parseFloat(getComputedStyle(probe).fontSize) };
            } finally {
              probe.remove();
            }
          });
        });
        [h2, h3, body, 16].forEach((expected, i) => {
          const { token, size } = measured[i];
          expect(Number.isFinite(size), `${path}: ${token} must resolve to a finite size`).toBeTruthy();
          expect(Math.abs(size - expected), `${path}: ${token} expected ${expected}px, measured ${size}px`).toBeLessThan(.1);
        });
        const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth }));
        expect(dimensions.scrollWidth, `${path}: document width ${dimensions.scrollWidth}px exceeds viewport ${dimensions.viewport}px`).toBeLessThanOrEqual(dimensions.viewport + 1);
        const overflow = await page.locator('main :is(h1,h2,h3)').evaluateAll(nodes => nodes.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => ({ heading: el.textContent?.trim(), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth })));
        expect(overflow, `${path}: heading overflow`).toEqual([]);
      });
    }
  });
}
test('short landscape hero keeps title and both actions accessible',async({page})=>{
  await page.setViewportSize({width:844,height:390});
  await page.goto('/');
  const hero=page.locator('.home-hero');
  await expect(hero.locator('h1')).toBeVisible();
  for(const name of ['Book on WhatsApp','Explore services']){
    const link=hero.getByRole('link',{name,exact:true});await link.scrollIntoViewIfNeeded();await expect(link).toBeInViewport();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});
