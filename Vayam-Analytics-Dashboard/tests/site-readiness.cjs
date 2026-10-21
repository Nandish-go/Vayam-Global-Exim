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
assert.ok(html.includes('name="robots" content="index,follow"'));
assert.ok(!html.includes('images.unsplash.com'));
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 const ref=match[1];if(/^(https?:|mailto:|tel:|#)/.test(ref))continue;
 assert.ok(fs.existsSync(path.join(root,ref)),ref);
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),['https://vayam-global.com/','https://vayam-global.com/privacy.html']);
assert.ok(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: https://vayam-global.com/sitemap.xml'));
const config={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../integration/analytics-config.js'),'utf8'),config);
assert.equal(config.window.VAYAM_ANALYTICS_CONFIG.enabled,false);
assert.equal(config.window.VAYAM_ANALYTICS_CONFIG.ga4Enabled,false);
console.log('Production metadata, local assets, disabled analytics and dashboard report validation passed.');
