const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'integration', 'analytics.js'), 'utf8');
const schema = fs.readFileSync(path.join(__dirname, '..', 'integration', 'measurement-schema.js'), 'utf8');
const goodWebsiteId = '94db1cb1-74f4-4a40-ad6c-962362670409';

function run({host = 'vayam-global.com', protocol = 'https:', enabled = false,
  ga4Enabled = false, choice = 'unset', search = '', doNotTrack = '0', gpc = false} = {}) {
  const scripts = [];
  const document = {
    referrer: 'https://example.org/private?email=buyer@example.org',
    visibilityState: 'visible',
    documentElement: {scrollHeight: 1000},
    head: {appendChild(node) { scripts.push(node); }},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById() { return null; },
    addEventListener() {},
    createElement() { return {dataset: {}, addEventListener() {}}; }
  };
  const context = {
    document,
    location: {protocol, hostname: host, origin: protocol + '//' + host, pathname: '/', search},
    navigator: {doNotTrack, globalPrivacyControl: gpc},
    localStorage: {getItem() { return choice; }},
    URL,
    URLSearchParams,
    Date,
    Element: class {},
    setInterval() {},
    addEventListener() {},
    innerHeight: 700,
    scrollY: 0
  };
  context.window = context;
  context.window.VAYAM_ANALYTICS_CONFIG = {
    enabled, websiteId: goodWebsiteId, ga4Enabled, ga4MeasurementId: 'G-ABC12345',
    allowedHosts: ['vayam-global.com', 'www.vayam-global.com']
  };
  vm.runInNewContext(schema, context, {filename: 'measurement-schema.js'});
  vm.runInNewContext(source, context, {filename: 'analytics.js'});
  return {scripts, context};
}

assert.equal(run().scripts.length, 0, 'disabled configuration must load no provider');
assert.equal(run({enabled: true, host: 'localhost', protocol: 'http:'}).scripts.length, 0,
  'localhost must load no provider');
assert.equal(run({enabled: true, host: 'unapproved.example'}).scripts.length, 0,
  'unapproved host must load no provider');
assert.equal(run({enabled: true, doNotTrack: '1'}).scripts.length, 0);
assert.equal(run({enabled: true, gpc: true}).scripts.length, 0);
assert.deepEqual(run({enabled: true}).scripts.map(script => script.src),
  ['https://cloud.umami.is/script.js']);
assert.equal(run({ga4Enabled: true, choice: 'rejected'}).scripts.length, 0,
  'declined GA4 must load no Google tag');
assert.equal(run({ga4Enabled: true, choice: 'unset'}).scripts.length, 0,
  'unset GA4 choice must load no Google tag');
assert.deepEqual(run({ga4Enabled: true, choice: 'accepted'}).scripts.map(script => script.src),
  ['https://www.googletagmanager.com/gtag/js?id=G-ABC12345']);

const {context} = run({enabled: true});
const filtered = context.vayamAnalyticsBeforeSend('event', {
  website: goodWebsiteId, name: 'product_interest', url: '/?email=buyer@example.org',
  referrer: 'https://example.org/private?email=buyer@example.org', query: 'email=buyer@example.org',
  id: 'provider-session-id', data: {group: 'spices', email: 'buyer@example.org', message: 'private brief'}
});
assert.equal(filtered.url, '/');
assert.equal(filtered.referrer, 'https://example.org');
assert.equal(filtered.query, undefined);
assert.equal(filtered.website, goodWebsiteId);
assert.equal(filtered.id, 'provider-session-id');
assert.deepEqual(JSON.parse(JSON.stringify(filtered.data)), {group: 'spices'});
assert.equal(context.vayamAnalyticsBeforeSend('event', {name: 'unexpected_event'}), false);
assert.equal(context.vayamAnalyticsBeforeSend('identify', {name: 'person'}), false);
const ga=run({ga4Enabled:true,choice:'accepted',search:'?email=buyer@example.org&utm_source=google&utm_medium=organic&utm_campaign=business_profile'}).context;
const calls=Array.from(ga.dataLayer, args=>Array.from(args));
const configuration=calls.find(args=>args[0]==='config')[2];
assert.equal(configuration.page_referrer,'https://example.org');
assert.equal(configuration.page_location,'https://vayam-global.com/');
assert.equal(configuration.campaign_source,'google');
assert.ok(!JSON.stringify(calls).includes('buyer@example.org'));
assert.deepEqual(JSON.parse(JSON.stringify(context.VayamMeasurement.sanitize('rfq_field', {field:'email',state:'filled',value:'buyer@example.org'}))), {name:'rfq_field',data:{field:'email',state:'filled'}});
const local = run({host: '127.0.0.1', protocol:'http:', search:'?analytics_preview=1&utm_source=buyer%40example.org'});
assert.equal(local.scripts.length, 0);
assert.ok(local.context.VayamAnalyticsPreview.events().every(event => !JSON.stringify(event).includes('buyer@')));
console.log('Analytics provider gates and payload boundaries passed.');
