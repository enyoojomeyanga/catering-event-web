import { test, expect } from '@playwright/test';
for (const width of [320, 375, 1440]) {
 test(`refined layout at ${width}`, async ({page})=>{
  await page.setViewportSize({width,height:900});
  for (const path of ['/', '/services/catering','/services/decoration','/services/baking','/services/confectionery','/about','/contact','/faq','/gallery']) {
   await page.goto(path);
   await expect(page.locator('body')).not.toContainText('Integrity is our pride');
   await expect(page.locator('body')).not.toContainText('↗');
   await expect(page.locator('footer .copyright')).toHaveCSS('text-align','center');
   await expect(page.locator('footer a[href^="tel:"],footer a[href^="mailto:"]')).toHaveCount(0);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
   if(path.startsWith('/services/')) await expect(page.locator('main [data-lightbox-photo]').first()).toBeVisible();
  }
 });
}

test('illustrative gallery is disclosed and filters images', async ({page})=>{
 await page.goto('/gallery');
 const gallery=page.locator('[data-gallery]');
 const projectCards=gallery.locator('.project-card');
 if(await projectCards.count()===0){
  await expect(page.getByText('AI-generated illustrations for inspiration.',{exact:false})).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  await gallery.getByRole('button',{name:'Catering',exact:true}).click();
  await expect(gallery.locator('figure[data-categories="catering"]:not([hidden])')).toHaveCount(3);
  await expect(gallery.locator('figure[data-filter-item]:not([hidden])')).toHaveCount(3);
 }
});
