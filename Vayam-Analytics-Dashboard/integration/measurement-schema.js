(function (root) {
  'use strict';
  // Only enumerated business actions and bounded counts leave the website.
  const fields = ['product','specification','quantity','destination','packaging','message','name','company','email'];
  const sections = ['home','about','products','quality','process','documents','faq','contact'];
  const placement = ['header','hero','contact','footer','body','form'];
  const channel = ['email','whatsapp','phone'];
  const rules = {
    section_view: {section: sections},
    scroll_depth: {percent: [25,50,75,100]},
    visible_time: {seconds: [30,60,120,300]},
    navigation: {section: sections, placement},
    product_interest: {group: ['spices','staples','packaged_food','private_label','mixed_products']},
    contact_handoff: {channel, placement},
    rfq_start: {},
    rfq_field: {field: fields, state: ['filled','empty']},
    rfq_validation: {field: [...fields,'other']},
    rfq_prepared: {channel: ['email','whatsapp']},
    faq_open: {question: Array.from({length:20}, (_,i) => 'question_' + (i+1))},
    map_open: {},
    campaign: {
      source: ['google','bing','duckduckgo','linkedin','instagram','facebook','whatsapp','newsletter','other'],
      medium: ['organic','social','referral','paid','email','messaging','other'],
      campaign: ['business_profile','catalogue','launch','other']
    },
    technical_error: {kind: ['script','resource','promise']}
  };
  function sanitize(name, data = {}) {
    if (!Object.prototype.hasOwnProperty.call(rules, name)) return null;
    const safe = {};
    for (const [key, choices] of Object.entries(rules[name])) {
      if (choices.includes(data?.[key])) safe[key] = data[key];
    }
    return {name, data: safe};
  }
  root.VayamMeasurement = Object.freeze({sanitize});
  if (typeof module !== 'undefined') module.exports = root.VayamMeasurement;
})(typeof window !== 'undefined' ? window : globalThis);
