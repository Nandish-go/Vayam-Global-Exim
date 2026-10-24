const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'};
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const provider=[];const errors=[];
 await ctx.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname!=='vayam-global.com'){provider.push(u.href);return route.abort();}
  const p=path.resolve(root,'.'+u.pathname+(u.pathname.endsWith('/')?'index.html':''));
  if(!p.startsWith(root+path.sep)||!fs.existsSync(p))return route.fulfill({status:404,body:'Not found'});
  await route.fulfill({contentType:mime[path.extname(p)]||'text/plain',body:fs.readFileSync(p)});
 });
 const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 const out=path.join(__dirname,'../.local');fs.mkdirSync(out,{recursive:true});
 try{
  await page.goto('https://vayam-global.com/');
  await page.locator('.vayam-consent').waitFor();
  assert.ok(!provider.some(x=>/google-analytics|googletagmanager|clarity\.ms/.test(x)));
  await page.getByRole('button',{name:'No thanks',exact:true}).click();
  await page.reload();assert.ok(!await page.locator('.vayam-consent').isVisible());
  await page.getByRole('button',{name:'Analytics choices',exact:true}).click();
  await page.getByRole('button',{name:'Allow analytics',exact:true}).click();
  await page.waitForFunction(()=>!!window.gtag);
  await page.waitForFunction(()=>!!window.clarity);
  assert.equal(await page.locator('script[src="https://www.clarity.ms/tag/z2xvqfy55k"]').count(),1);
  assert.ok(await page.locator('form').evaluateAll(forms=>forms.every(form=>form.getAttribute('data-clarity-mask')==='true')));
  const clarityCalls=await page.evaluate(()=>window.clarity.q);
  assert.ok(clarityCalls.some(call=>call[0]==='consentv2'&&call[1].analytics_Storage==='granted'&&call[1].ad_Storage==='denied'));
  await page.locator('[data-product]').first().click();
  await page.locator('#email').fill('privacy-test@example.test');
  await page.locator('#quantity').fill('private-quantity');
  await page.locator('#destination').focus();
  const calls=await page.evaluate(()=>window.dataLayer.map(a=>Array.from(a)));
  assert.equal(calls.filter(x=>x[0]==='event'&&x[1]==='page_view').length,1);
  assert.ok(calls.some(x=>x[1]==='product_interest'));
  assert.ok(!JSON.stringify(calls).includes('privacy-test'));
  assert.ok(!JSON.stringify(calls).includes('private-quantity'));
  await page.getByRole('button',{name:'Analytics choices',exact:true}).click();
  await page.getByRole('button',{name:'No thanks',exact:true}).click();
  await page.waitForLoadState('load');
  await page.reload();
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(),0);
  assert.equal(await page.locator('script[src*="clarity.ms"]').count(),0);
  const urls=['/',...fs.readdirSync(path.join(root,'products')).map(s=>'/products/'+s+'/')];
  for(const url of urls){
   await page.goto('https://vayam-global.com'+url);
   await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' overflow '+width);
    assert.ok(await page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),url+' image');
   }
  }
  await page.goto('https://vayam-global.com/products/indian-spices/');
  await page.screenshot({path:path.join(out,'category-desktop.png')});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'category-mobile.png')});
  assert.deepEqual(errors,[]);
  console.log('Production browser checks passed: consent accept/reject/withdraw, one page view, safe field events, six pages at four widths and all images loaded.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
