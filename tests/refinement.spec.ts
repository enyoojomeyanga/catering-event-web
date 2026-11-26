import { test, expect, type Page } from '@playwright/test';
const slugs=['catering','decoration','baking','confectionery'] as const;
for(const slug of slugs){
 test(`legacy service URL redirects to ${slug}`,async({page})=>{
  await page.goto(`/services/${slug}`);
  await expect(page).toHaveURL(url=>url.pathname.replace(/\/$/,'')==='/services'&&url.hash===`#${slug}`);
  await expect(page.locator(`main article#${slug}`)).toBeVisible();
 });
}
test('services are explained in a single page',async({page})=>{
 await page.goto('/services');
 for(const slug of slugs){
  const section=page.locator(`main article#${slug}`);
  await expect(section.locator('h2')).toBeVisible();
  expect(await section.locator('li').count()).toBeGreaterThan(0);
 }
 await expect(page.locator('main a[href^="/services/"]')).toHaveCount(0);
 await expect(page.locator('main')).not.toContainText('AI-generated illustration');
});
for(const width of [320,375,1440]){
 test(`full viewport hero at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:812}); await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  const hero=page.locator('.home-hero'); const box=await hero.boundingBox();
  expect(box).not.toBeNull(); expect(box!.x).toBeCloseTo(0,0); expect(box!.width).toBeCloseTo(width,0);
  expect(box!.y+box!.height).toBeGreaterThanOrEqual(811);
  await expect(hero.locator('h1')).toBeVisible();
  await expect(hero.locator('img')).toHaveCSS('object-fit','cover');
  await expect(hero.locator('img')).toHaveAttribute('fetchpriority','high');
  await expect.poll(()=>hero.locator('img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBeTruthy();
 });
}
test('About contains substantive sections and no coverage block',async({page})=>{
 await page.goto('/about');
 await expect(page.getByRole('heading',{name:'Who we are'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Our approach'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Planning ahead'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Where we operate'})).toHaveCount(0);
});
test('no per-image illustration captions or lightbox labels',async({page})=>{
 await page.goto('/gallery/category/catering');
 const first=page.locator('[data-lightbox-photo]').first(); await first.click();
 await expect(page.locator('dialog[data-lightbox]')).toBeVisible();
 await expect(page.locator('dialog[data-lightbox]')).not.toContainText('AI-generated illustration');
 await expect(page.locator('main')).not.toContainText('AI-generated illustration');
});
const getForm=(page:Page)=>page.locator('[data-contact-form]');
async function fillForm(page:Page){
 await page.getByLabel('Full name').fill('Local QA test');
 await page.getByLabel('Email address').fill('qa@example.com');
 await page.getByLabel('Service required').selectOption('Catering');
 await page.getByLabel('Message',{exact:false}).fill('Local intercepted enquiry, not a real submission.');
}
// No actual email is sent by any automated test. Network requests are intercepted.
test('contact form configuration and WhatsApp fallback',async({page})=>{
 await page.goto('/contact'); const form=getForm(page);
 await expect(form).toBeVisible();
 await expect(page.getByRole('link',{name:'Chat on WhatsApp'})).toHaveAttribute('href',/^https:\/\/wa\.me\/2347052153205/);
 if(await form.getAttribute('data-configured')==='false'){
  await expect(form.getByRole('button',{name:'Send message'})).toBeDisabled();
  await expect(page.locator('#form-unavailable')).toBeVisible();
 }else{
  await expect(form.getByRole('button',{name:'Send message'})).toBeEnabled();
  await expect(form).toHaveAttribute('action',/^https:\/\/formspree\.io\/f\//);
 }
});
for(const code of [200,422,429]){
 test(`configured form handles HTTP ${code} without sending email`,async({page})=>{
  await page.goto('/contact'); const form=getForm(page);
  test.skip(await form.getAttribute('data-configured')!=='true','Configure PUBLIC_FORMSPREE_ENDPOINT and rebuild to test submission states.');
  let requests=0;
  await page.route('https://formspree.io/f/**',async route=>{
   requests++;
   expect(route.request().method()).toBe('POST');
   await route.fulfill({status:code,json:code===200?{ok:true}:{ok:false,errors:[{message:'Test rejection'}]},headers:{'Access-Control-Allow-Origin':'*'}});
  });
  await fillForm(page);
  await form.getByRole('button',{name:'Send message'}).click();
  const status=form.locator('[data-form-status]');
  await expect(status).toHaveAttribute('data-state',code===200?'success':'error');
  expect(requests).toBe(1);
  await expect(form.getByRole('button',{name:'Send message'})).toBeEnabled();
  if(code===200) await expect(page.getByLabel('Full name')).toHaveValue('');
  else await expect(page.getByLabel('Full name')).toHaveValue('Local QA test');
 });
}
