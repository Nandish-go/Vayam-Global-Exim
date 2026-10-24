const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const validate=require('../report-schema.js').validate;
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../sample-data.js'),'utf8'),context);
const sample=JSON.parse(JSON.stringify(context.window.VAYAM_DASHBOARD_SAMPLE));
assert.equal(validate(sample),sample);
for(const change of [r=>r.cities.push(null),r=>r.summary.visitors=-1,r=>r.summary.visits='10',r=>r.trend.push([1,2,3]),r=>r.funnel[0].count=Infinity]){
 const invalid=structuredClone(sample);change(invalid);assert.throws(()=>validate(invalid));
}
assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1);
const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(schema['@id'],'https://vayam-global.com/#organization');
assert.equal(schema.telephone,'+918660720580');
assert.ok(html.includes('rel="canonical" href="https://vayam-global.com/"'));
assert.ok(html.includes('name="robots" content="index,follow,max-image-preview:large"'));
assert.ok(!html.includes('images.unsplash.com'));
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 const ref=match[1];if(/^(https?:|mailto:|tel:|#)/.test(ref))continue;
 assert.ok(fs.existsSync(path.join(root,ref)),ref);
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(urls).size,7);
for(const url of urls){
 const pathname=new URL(url).pathname;
 const file=path.join(root,pathname.endsWith('/')?pathname+'index.html':pathname);
 const page=fs.readFileSync(file,'utf8');
 assert.ok(page.includes('rel="canonical" href="'+url+'"'),url+' canonical');
 if(pathname.startsWith('/products/')){
  assert.equal((page.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1);
  JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  for(const match of page.matchAll(/(?:src|href)="(\/[^"#]*)"/g)){
   const ref=match[1]; const target=path.join(root,ref.endsWith('/')?ref+'index.html':ref);
   assert.ok(fs.existsSync(target),url+' missing '+ref);
  }
 }
}
assert.ok(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: https://vayam-global.com/sitemap.xml'));
const config={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../integration/analytics-config.js'),'utf8'),config);
assert.equal(config.window.VAYAM_ANALYTICS_CONFIG.enabled,false);
assert.equal(config.window.VAYAM_ANALYTICS_CONFIG.ga4Enabled,true);
assert.equal(config.window.VAYAM_ANALYTICS_CONFIG.ga4MeasurementId,'G-SB6RL77QJ4');
assert.equal(config.window.VAYAM_ANALYTICS_CONFIG.clarityEnabled,false);
console.log('Seven canonical pages, structured data, local assets, GA4 configuration and dashboard report validation passed.');
