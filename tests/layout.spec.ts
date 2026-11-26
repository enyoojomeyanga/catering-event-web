import { test, expect } from '@playwright/test';
const routes=['/','/about','/services','/gallery','/gallery/category/catering','/gallery/category/decoration','/gallery/category/baking','/gallery/category/confectionery','/faq','/contact'];
for(const [width,height] of [[320,568],[360,640],[375,812],[390,844],[414,896],[430,932],[768,1024],[844,390],[1216,812],[1440,900]]){
 test(`layout and integrated page headers ${width}x${height}`,async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width,height});
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const path of routes){
   await page.goto(path);await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('main h1')).toHaveCount(1);
   const headerHeight=await page.locator('[data-header]').boundingBox();
   const surfaceHeight=await page.locator('.header-surface').boundingBox();
   expect(surfaceHeight!.height,`${path}: header footprint`).toBeCloseTo(headerHeight!.height,0);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${path}: horizontal overflow`).toBeTruthy();
   if(path!=='/'){
    const title=page.locator('.page-heading h1');
    await expect(title).toBeVisible();
    expect(await title.evaluate(el=>el.getBoundingClientRect().top-document.querySelector('[data-header]')!.getBoundingClientRect().bottom),`${path}: unnecessary title gap`).toBeLessThanOrEqual(40);
   }
   await expect(page.locator('footer .copyright')).toHaveCSS('text-align','center');
   await expect(page.locator('footer a[href^="tel:"],footer a[href^="mailto:"]')).toHaveCount(0);
  }
 });
}
for(const [width,height] of [[320,568],[390,844],[844,390]]){
 test(`mobile actions fit and work ${width}x${height}`,async({page})=>{
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const menu=page.locator('.mobile-nav');await menu.locator('summary').click();
  await expect(menu.locator('.mobile-book')).toBeVisible();
  await menu.getByRole('link',{name:'Portfolio',exact:true}).click();
  await expect(page).toHaveURL(/\/gallery\/?$/);
  await page.locator('.category-link').first().click();
  await page.locator('[data-lightbox-photo]').first().click();
  const dialog=page.locator('dialog[data-lightbox]');await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBeTruthy();
  await dialog.getByRole('button',{name:'Close image viewer'}).click();
  await expect(dialog).toBeHidden();
  await page.goto('/faq');const question=page.locator('.faq-list details').first();await question.locator('summary').click();await expect(question).toHaveAttribute('open','');
  await page.goto('/contact');await expect(page.getByRole('link',{name:'Chat on WhatsApp'})).toBeVisible();
  const fields=page.locator('.form-field :is(input,select,textarea)');
  for(const field of await fields.all()){
   const bounds=await field.boundingBox();expect(bounds).not.toBeNull();expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width+1);
   await expect(field).toHaveCSS('font-size','16px');
  }
 });
}
