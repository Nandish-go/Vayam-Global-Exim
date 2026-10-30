const assert = require('node:assert/strict');
const {createConnector, PROPERTY, SCOPE} = require('../google-connector.js');
const engine = require('../report-engine.js');

const CLIENT_ID = '123456789012-testclient.apps.googleusercontent.com';
const PERIOD = {start: '2026-10-01', end: '2026-10-28'};

function fixture(options = {}) {
  const calls = [];
  const timers = [];
  let clock = 1800000000000;
  let identityConfig;
  const host = {
    VayamAnalytics: engine,
    location: {protocol: 'https:', hostname: 'vayam-global.com'},
    localStorage: {getItem() { throw Error('Unexpected storage read'); }, setItem() { throw Error('Unexpected storage write'); }},
    google: {accounts: {oauth2: {initTokenClient(config) {
      identityConfig = config;
      return {requestAccessToken() {
        if (options.pendingAuth) return;
        if (options.oauthError) config.error_callback(options.oauthError === true ? {type: 'popup_closed'} : options.oauthError);
        else config.callback({access_token: 'PRIVATE_TEST_TOKEN', expires_in: 3600, scope: options.denyScope ? '' : SCOPE});
      }};
    }}}}
  };
  const mock = async (url, init) => {
    const query = JSON.parse(init.body);
    calls.push({url, init, query});
    if (options.unauthorised) return {status: 401, ok: false};
    const dimensions = query.dimensions.map(d => d.name);
    if (options.failProducts && dimensions[0] === 'customEvent:group') return {status: 400, ok: false};
    if (options.failAll) return {status: 403, ok: false};
    const headers = query.metrics.map(m => ({name: m.name}));
    const event = query.dimensionFilter?.filter?.stringFilter?.value;
    let rows;
    const values = query.metrics.map(m => ({value: String({totalUsers: 20, sessions: 28, screenPageViews: 40, engagedSessions: 14, eventCount: event === 'contact_handoff' ? 2 : 4}[m.name])}));
    if (options.emptyOverview && !dimensions.length && !event) rows = [];
    else if (!dimensions.length) rows = [{metricValues: values}];
    else if (dimensions[0] === 'date') rows = [
      {dimensionValues: [{value: '20261001'}], metricValues: values},
      {dimensionValues: [{value: '20261002'}], metricValues: values}
    ];
    else rows = [{dimensionValues: dimensions.map(name => ({value: {country: 'India', city: 'Bengaluru', sessionDefaultChannelGroup: 'Organic Search', deviceCategory: 'mobile', 'customEvent:group': 'Spices', 'customEvent:section': 'products', eventName: 'product_interest'}[name]})), metricValues: values}];
    return {ok: true, status: 200, json: async () => ({metricHeaders: headers, rows, rowCount: options.truncated && dimensions[0] === 'country' ? 200 : rows.length,
      metadata: {timeZone: 'Asia/Kolkata', ...(options.thresholded ? {subjectToThresholding: true, samplingMetadatas: [{}]} : {})}})};
  };
  const connector = createConnector({root: host, fetch: mock, now: () => clock, setTimeout: callback => {timers.push(callback); return timers.length;}, clearTimeout() {}});
  return {connector, calls, host, getConfig: () => identityConfig, fireLatestTimer: () => timers.at(-1)(), expire: () => { clock += 3601000; }};
}

(async () => {
  let f = fixture();
  assert.equal(f.connector.isConnected(), false);
  await assert.rejects(f.connector.fetchReport(PERIOD), /not connected/);
  await assert.rejects(f.connector.connect('secret-or-password'), /Client|client ID/);
  await f.connector.connect(CLIENT_ID);
  assert.equal(f.getConfig().scope, SCOPE);
  assert.equal(f.getConfig().include_granted_scopes, false);
  assert.equal(f.connector.isConnected(), true);
  assert.equal(JSON.stringify(f.connector.getState()).includes('PRIVATE_TEST_TOKEN'), false);
  const result = await f.connector.fetchReport(PERIOD);
  assert.equal(result.source.property, PROPERTY);
  assert.equal(result.source.name, 'Google Analytics 4');
  assert.equal(result.metrics.users, 20, 'period user total is not the sum of daily users');
  assert.equal(result.metrics.sessions, 28);
  assert.equal(result.metrics.handoffs, 2, 'contact_handoff is counted separately from prepared forms');
  assert.equal(result.metrics.productInterest, 4);
  assert.equal(result.metrics.searchClicks, null, 'no Search Console data is invented');
  assert.equal(result.daily.length, 2, 'unreturned days are not invented as zeros');
  assert.equal(result.breakdowns.cities[0].country, 'India');
  assert.equal(result.breakdowns.countries[0].metric, 'sessions');
  assert.equal(result.breakdowns.sections[0].metric, 'events');
  assert.equal(result.breakdowns.events[0].metric, 'events');
  assert.equal(f.calls.length, 13);
  for (const {url, init, query} of f.calls) {
    assert.equal(url, 'https://analyticsdata.googleapis.com/v1beta/properties/560596894:runReport');
    assert.equal(init.headers.Authorization, 'Bearer PRIVATE_TEST_TOKEN');
    assert.equal(url.includes('PRIVATE_TEST_TOKEN'), false);
    assert.equal(JSON.stringify(query).includes('PRIVATE_TEST_TOKEN'), false);
    assert.ok(query.dimensions.every(d => !/userId|userPseudoId|email|ipAddress/.test(d.name)));
  }
  assert.equal(JSON.stringify(result).includes('PRIVATE_TEST_TOKEN'), false);
  f.connector.disconnect();
  assert.equal(f.connector.isConnected(), false);

  f = fixture({failProducts: true, emptyOverview: true, thresholded: true, truncated: true});
  await f.connector.connect(CLIENT_ID);
  const partial = await f.connector.fetchReport(PERIOD);
  assert.equal(partial.metrics.users, null);
  assert.equal(partial.breakdowns.products.length, 0);
  assert.ok(partial.notes.some(note => /products unavailable/.test(note)));
  assert.ok(partial.notes.some(note => /thresholding/.test(note)));
  assert.ok(partial.notes.some(note => /top 80/.test(note)));
  assert.ok(partial.notes.some(note => /sampled/.test(note)));
  assert.equal(partial.metrics.handoffs, 2, 'one failed table does not wipe successful totals');

  f = fixture({unauthorised: true});
  await f.connector.connect(CLIENT_ID);
  await assert.rejects(f.connector.fetchReport(PERIOD), /expired or was revoked/);
  assert.equal(f.connector.isConnected(), false);

  f = fixture({failAll: true});
  await f.connector.connect(CLIENT_ID);
  await assert.rejects(f.connector.fetchReport(PERIOD), /No Google report/);

  f = fixture({oauthError: true});
  await assert.rejects(f.connector.connect(CLIENT_ID), /closed before approval.*fresh sign-in/);
  assert.equal(f.connector.isConnected(), false);
  for (const [type, expected] of [
    ['popup_failed_to_open', /could not open.*Allow pop-ups/],
    ['popup_closed', /closed before approval/],
    ['unknown=https://example.test/?access_token=PRIVATE_AUTH_DATA', /could not finish.*older Google sign-in window/],
    ['__proto__', /could not finish.*older Google sign-in window/],
    [undefined, /could not finish.*older Google sign-in window/]
  ]) {
    f = fixture({oauthError: {type, error_description: 'PRIVATE_AUTH_DATA', url: 'https://example.test/?access_token=PRIVATE_AUTH_DATA'}});
    await assert.rejects(f.connector.connect(CLIENT_ID), error => {
      assert.match(error.message, expected);
      assert.equal(error.message.includes('PRIVATE_AUTH_DATA'), false, 'raw OAuth details must not reach the user message');
      assert.equal(error.message.includes('https://'), false);
      return true;
    });
    assert.equal(f.connector.isConnected(), false);
  }

  f = fixture({pendingAuth: true});
  const timedOut = f.connector.connect(CLIENT_ID);
  await Promise.resolve();
  const oldCallback = f.getConfig().callback;
  const timeoutCheck = assert.rejects(timedOut, /timed out.*Close the old Google sign-in window.*fresh sign-in/);
  f.fireLatestTimer();
  await timeoutCheck;
  oldCallback({access_token: 'LATE_PRIVATE_TOKEN', expires_in: 3600, scope: SCOPE});
  assert.equal(f.connector.isConnected(), false, 'a late callback from the expired popup cannot establish a connection');
  const fresh = f.connector.connect(CLIENT_ID);
  await Promise.resolve();
  assert.notEqual(f.getConfig().callback, oldCallback);
  f.getConfig().callback({access_token: 'FRESH_PRIVATE_TOKEN', expires_in: 3600, scope: SCOPE});
  await fresh;
  assert.equal(f.connector.isConnected(), true, 'a fresh attempt after timeout can connect');

  f = fixture({denyScope: true});
  await assert.rejects(f.connector.connect(CLIENT_ID), /not granted/);
  f = fixture();
  await f.connector.connect(CLIENT_ID);
  f.expire();
  assert.equal(f.connector.isConnected(), false);
  await f.connector.connect(CLIENT_ID);
  await assert.rejects(f.connector.fetchReport({start: '2026-02-30', end: '2026-03-01'}), /valid start/);
  await assert.rejects(f.connector.fetchReport({start: '2025-01-01', end: '2026-01-02'}), /366 days/);
  await assert.rejects(f.connector.fetchReport({start: '2026-10-28', end: '2026-10-01'}), /valid start/);
  console.log('Google connector: safe token lifecycle, GA4 mapping, partial results, missing data, scopes, periods and provenance checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
