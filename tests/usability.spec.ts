import { expect, test } from '@playwright/test';

for (const width of [320,375,1216,1440]) {
  test(`cinematic navbar stable at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:812});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/');
    const header=page.locator('[data-header]');
    const surface=header.locator('.header-surface');
    await expect(header).toHaveClass(/\bat-top\b/);
    await expect(surface).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
    await expect.poll(async()=> (await page.locator('.home-hero').boundingBox())?.y).toBeCloseTo(0,0);
    const before=(await header.boundingBox())!.height;
    await page.evaluate(()=>scrollTo(0,160));
    await expect(surface).toHaveCSS('background-color','rgb(255, 255, 255)');
    expect((await header.boundingBox())!.height).toBeCloseTo(before,0);
    await page.evaluate(()=>scrollTo(0,0));
    await expect(surface).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
    expect((await header.boundingBox())!.height).toBeCloseTo(before,0);
    await page.goto('/services');
    await expect(surface).toHaveCSS('background-color','rgb(255, 255, 255)');
  });
}
for(const [route,label,current] of [['/','Home','page'],['/about','About','page'],['/services','Services','page'],['/gallery','Portfolio','page'],['/gallery/category/catering','Portfolio','location'],['/faq','FAQs','page'],['/contact','Contact','page']]){
  test(`active navigation indicator ${route}`,async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.goto(route);
    const nav=page.locator('.desktop-nav');
    const link=nav.getByRole('link',{name:label,exact:true});
    await expect(nav.locator('[aria-current]')).toHaveCount(1);
    await expect(link).toHaveAttribute('aria-current',current);
    await expect(link).toHaveCSS('background-color','rgb(201, 182, 228)');
    expect(await link.evaluate(el=>getComputedStyle(el,'::before').visibility)).toBe('visible');
    await page.setViewportSize({width:375,height:812});
    await page.locator('.mobile-nav summary').click();
    await expect(page.locator('.mobile-panel [aria-current]')).toHaveCount(1);
    await expect(page.locator('.mobile-panel').getByRole('link',{name:label,exact:true})).toHaveAttribute('aria-current',current);
  });
}
test('Back to top appears on long pages and restores focus',async({page})=>{
  await page.setViewportSize({width:375,height:640});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/services');
  const button=page.locator('[data-back-to-top]');
  await expect(button).toBeHidden();
  await page.evaluate(()=>scrollTo(0,800));
  await expect(button).toBeVisible();
  await button.click();
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
  await expect(page.locator('.brand')).toBeFocused();
  await expect(button).toBeHidden();
});
test('native footer Back to top works without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:375,height:640}});
 try{const page=await context.newPage();await page.goto('http://127.0.0.1:4322/services');await page.locator('[data-footer-top]').click();await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);}finally{await context.close();}
});
test('portfolio cards keep photographs unobscured',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const path of ['/','/gallery']){
  await page.goto(path);
  await page.evaluate(()=>document.fonts.ready);
  const cards=page.locator('.category-link');
  await expect(cards).toHaveCount(4);
  for(const card of await cards.all()){
   await card.scrollIntoViewIfNeeded();
   const photo=card.locator('img');
   const frame=card.locator('.category-photo');
   await expect(photo).toHaveCSS('filter','none');
   await expect(photo).toHaveAttribute('data-image-state','ready');
   await expect.poll(()=>photo.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBeTruthy();
   await expect(frame).toHaveCSS('overflow','hidden');
   const geometry=await card.evaluate(el=>{
    const frame=el.querySelector('.category-photo')!.getBoundingClientRect();
    const image=el.querySelector('img')!.getBoundingClientRect();
    const caption=el.querySelector('.category-caption')!.getBoundingClientRect();
    return {gap:caption.top-frame.bottom,imageHeight:image.height,frameHeight:frame.height,overlays:[el,el.querySelector('.category-photo')!].flatMap(node=>['::before','::after'].map(pseudo=>getComputedStyle(node,pseudo).content))};
   });
   expect(geometry.gap).toBeGreaterThanOrEqual(-1);
   expect(geometry.imageHeight).toBeCloseTo(geometry.frameHeight,0);
   expect(geometry.overlays.every(value=>value==='none'||value==='normal')).toBeTruthy();
  }
 }
});
test('portfolio hover zoom stays inside its frame',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/gallery');
 const card=page.locator('.category-link').first();
 await card.scrollIntoViewIfNeeded();
 await expect(card.locator('img')).toHaveAttribute('data-image-state','ready');
 await card.hover();
 await expect.poll(()=>card.locator('img').evaluate(el=>getComputedStyle(el).transform)).not.toBe('none');
 const geometry=await card.evaluate(el=>{
   const frame=el.querySelector('.category-photo')!;
   return {gap:el.querySelector('.category-caption')!.getBoundingClientRect().top-frame.getBoundingClientRect().bottom,overflow:getComputedStyle(frame).overflow,filter:getComputedStyle(el.querySelector('img')!).filter};
 });
 expect(geometry.gap).toBeGreaterThanOrEqual(-1);
 expect(geometry.overflow).toBe('hidden');
 expect(geometry.filter).toBe('none');
});
for(const path of ['/about','/services','/gallery','/gallery/category/catering','/contact','/faq']){
 test(`clean integrated page title ${path}`,async({page})=>{
  await page.goto(path);
  await expect(page.locator('main .page-heading h1')).toHaveCount(1);
  await expect(page.locator('main .page-heading .script-accent')).toHaveCount(0);
  await expect(page.locator('.page-hero')).toHaveCount(0);
  await expect(page.locator('main > section:first-child .page-heading')).toHaveCount(1);
 });
}
