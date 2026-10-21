// Run with the local preview server on PORT (8770 by default) and Playwright available.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:'+(process.env.PORT||8770);
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const external=[],errors=[];
 await context.route('**/*',route=>{
   if(new URL(route.request().url()).origin===base)return route.continue();
   external.push(route.request().url());return route.abort();
 });
 const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 const snapshots=path.resolve(__dirname,'../.local');fs.mkdirSync(snapshots,{recursive:true});
 try{
   await page.goto(base+'/current/');
   await page.locator('h1').waitFor();
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.vayam-consent').count(),0);
   assert.equal(await page.locator('script[src*="googletagmanager"],script[src*="umami"]').count(),0);
   assert.ok(await page.locator('.hero img').evaluate(img=>img.complete&&img.naturalWidth>0));
   await page.screenshot({path:path.join(snapshots,'main-desktop.png')});
   await page.setViewportSize({width:390,height:844});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:path.join(snapshots,'main-mobile.png')});
   await page.goto(base+'/current/?analytics_preview=1');
   await page.locator('[data-product]').first().click();
   await page.locator('#name').fill('Browser QA');
   await page.locator('#email').fill('qa@example.test');
   await page.locator('#quantity').fill('500 kg');
   await page.locator('#destination').fill('Germany');
   await page.evaluate(()=>{window.qaHandoff='';window.open=url=>{window.qaHandoff=url;return null;};});
   await page.locator('#enquiry-form button[type=submit]').click();
   const handoff=await page.evaluate(()=>window.qaHandoff);
   assert.equal(new URL(handoff).hostname,'wa.me');
   assert.ok(new URL(handoff).searchParams.get('text').includes('500 kg'));
   const events=await page.evaluate(()=>window.VayamAnalyticsPreview.events());
   assert.ok(events.some(e=>e.event==='product_interest'));
   assert.ok(events.some(e=>e.event==='rfq_prepared'));
   assert.ok(!JSON.stringify(events).includes('qa@example.test'));
   assert.ok(!JSON.stringify(events).includes('500 kg'));
   for(const variant of ['classic','refined','signature','trade']){
     await page.goto(base+'/'+variant+'/');
     await page.locator('#search').fill('black pepper');
     await page.locator('.product-card[data-product="black-pepper"] [data-add]').click();
     await page.locator('[data-quantity="black-pepper"]').fill('750 kg');
     await page.reload();
     assert.equal(await page.locator('[data-quantity="black-pepper"]').inputValue(),'750 kg');
     await page.locator('#search').fill('no such product');
     assert.ok(await page.locator('#empty-results').isVisible());
     const categoryLink=page.locator('[data-filter-link]').first();
     if(await categoryLink.count())await categoryLink.click();
     else await page.locator('#clear-filters').click();
     assert.equal(await page.locator('#search').inputValue(),'');
     assert.ok(!await page.locator('#empty-results').isVisible());
     await page.locator('[name=destination]').fill('Germany');
     await page.locator('#brief-form button[type=submit]').click();
     assert.ok((await page.locator('#draft-text').innerText()).includes('750 kg'));
     const url=await page.locator('#send-whatsapp').getAttribute('href');
     assert.equal(new URL(url).hostname,'wa.me');
     for(const width of [320,390,768,1440]){
       await page.setViewportSize({width,height:900});
       assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),variant+' overflows at '+width);
     }
     await page.locator('#home').scrollIntoViewIfNeeded();
     if(variant==='trade')await page.screenshot({path:path.join(snapshots,'trade-desktop.png')});
   }
   await page.goto(base+'/dashboard/');
   assert.ok((await page.locator('#mode-banner').innerText()).includes('ILLUSTRATIVE DATA'));
   assert.notEqual(await page.locator('#metric-visitors').innerText(),'—');
   await page.locator('#import-file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"schemaVersion":1}')});
   assert.ok((await page.locator('#import-status').innerText()).includes('Report not loaded'));
   assert.ok((await page.locator('#mode-banner').innerText()).includes('ILLUSTRATIVE DATA'));
   assert.equal((await page.request.get(base+'/dashboard/private-reports/secret.json')).status(),404);
   assert.equal((await page.request.get(base+'/current/.git/config')).status(),404);
   assert.equal((await page.request.get(base+'/current/Vayam-Analytics-Dashboard/tests/analytics-gates.cjs')).status(),404);
   assert.equal(errors.length,0,errors.join('\n'));
   assert.ok(!external.some(url=>/googletagmanager|google-analytics|umami/.test(url)));
   console.log('Browser checks passed: main-site draft and event trace, four designs at four widths, quantity restoration, category reset, dashboard imports, private-path rejection, no external analytics.');
   console.log('Screenshots: '+snapshots);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
