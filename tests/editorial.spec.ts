import {test,expect} from '@playwright/test';
for(const width of [320,375,1440]){
 test(`reference redesign at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:900});
  for(const path of ['/','/services','/about','/contact','/faq','/gallery']){
   await page.goto(path);
   await expect(page.locator('body')).not.toContainText('Integrity is our pride');
   await expect(page.locator('body')).not.toContainText('↗');
   await expect(page.locator('footer .footer-contact')).toHaveCount(0);
   await expect(page.locator('footer .copyright')).toHaveCSS('text-align','center');
   await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(0);
   await expect(page.locator('footer a[href^="mailto:"]')).toHaveCount(0);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  }
 });
}
for(const slug of ['catering','decoration','baking','confectionery']){
 test(`portfolio category ${slug}`,async({page})=>{
  await page.goto('/gallery');
  await page.locator(`main a[href="/gallery/category/${slug}"]`).click();
  await expect(page).toHaveURL(new RegExp(`/gallery/category/${slug}/?$`));
  await expect(page.locator('main [data-lightbox-photo]').first()).toBeVisible();
  const projectCards=page.locator('main .project-card');
  if(await projectCards.count()===0){
   await expect(page.getByText('Illustrative imagery for inspiration, not photographs of completed client work.',{exact:false})).toBeVisible();
   await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  }
 });
}
test('reduced motion keeps content visible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'}); await page.goto('/');
 await expect(page.locator('main h1')).toBeVisible();
 expect(await page.locator('[data-reveal].revealed').count()).toBe(0);
});
