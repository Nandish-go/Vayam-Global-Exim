/* Measurement for the current static website. Umami offers cookieless coverage;
   optional GA4 loads only after a visitor allows it. No form values, contact
   details, raw URL queries, or raw referrers are custom event dimensions. */
(() => {
  'use strict';

  const config = window.VAYAM_ANALYTICS_CONFIG || {};
  const sanitize = window.VayamMeasurement?.sanitize;
  if (typeof sanitize !== 'function') return;
  const websiteId = typeof config.websiteId === 'string' ? config.websiteId.trim() : '';
  const validId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(websiteId);
  const ga4Id = typeof config.ga4MeasurementId === 'string' ? config.ga4MeasurementId.trim() : '';
  const approvedHost = location.protocol === 'https:' &&
    Array.isArray(config.allowedHosts) && config.allowedHosts.includes(location.hostname);
  const umamiActive = approvedHost && config.enabled === true && validId;
  const ga4Active = approvedHost && config.ga4Enabled === true && /^G-[A-Z0-9]{6,20}$/.test(ga4Id);
  const clarityId = typeof config.clarityProjectId === 'string' ? config.clarityProjectId.trim() : '';
  const clarityActive = approvedHost && config.clarityEnabled === true && /^[a-z0-9]{5,24}$/i.test(clarityId);
  const trialPath = /^\/(?:Vayam-Development|Vayam-Analytics-Dashboard)(?:\/|$)/i.test(location.pathname);
  if (trialPath) return;
  const preview = !umamiActive && !ga4Active && !clarityActive && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) &&
    new URLSearchParams(location.search).get('analytics_preview') === '1';
  const consentPreview = preview && new URLSearchParams(location.search).get('consent_preview') === '1';
  if (!umamiActive && !ga4Active && !clarityActive && !preview) return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  const trace = [];
  const sections = new Set(['home', 'about', 'products', 'quality', 'process', 'documents', 'faq', 'contact']);
  const products = new Map([
    ['Whole spices, powders and masalas', 'spices'],
    ['Rice, pulses and grains', 'staples'],
    ['Packaged Indian foods', 'packaged_food'],
    ['Private label and buyer-specific packs', 'private_label'],
    ['Mixed-product and consolidated sourcing', 'mixed_products']
  ]);
  const fields = new Set(['product', 'specification', 'quantity', 'destination', 'packaging', 'message', 'name', 'company', 'email']);
  const seenSections = new Set();
  const seenScroll = new Set();
  const seenTime = new Set();
  let visibleSeconds = 0;
  let formStarted = false;
  let ga4Choice = 'unset';
  let ga4Loaded = false;
  let clarityLoaded = false;
  let interactionsStarted = false;
  const choiceKey = 'vayam.analytics.choice.v2';
  try { ga4Choice = localStorage.getItem(choiceKey) || 'unset'; } catch { /* Storage may be blocked. */ }
  if (ga4Choice !== 'accepted' && ga4Choice !== 'rejected') ga4Choice = 'unset';

  function safeReferrer() {
    if (!document.referrer) return '';
    try {
      const url = new URL(document.referrer);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin : '';
    } catch { return ''; }
  }

  // Umami v2.18+ calls this before sending. Its built-in exclude-search/hash
  // attributes also remove URL query and fragment even if this callback changes.
  window.vayamAnalyticsBeforeSend = (type, payload) => {
    if (!payload || typeof payload !== 'object') return false;
    if (type === 'identify') return false;
    const safe = {...payload, url: location.pathname, referrer: safeReferrer()};
    delete safe.query;
    delete safe.tag;
    delete safe.distinctId;
    // Keep Umami's own session identifier when present; we never assign one.
    if (type === 'event' && safe.name) {
      const event = sanitize(safe.name, safe.data);
      if (!event) return false;
      safe.data = event.data;
    }
    if (type === 'event' && !safe.name) delete safe.data;
    return safe;
  };

  function emit(name, data = {}) {
    const event = sanitize(name, data);
    if (!event) return;
    data = event.data;
    if (preview) {
      trace.push({event: name, ...data});
      if (trace.length > 200) trace.shift();
    }
    if (umamiActive && typeof window.umami?.track === 'function') {
      try { Promise.resolve(window.umami.track(name, data)).catch(() => {}); } catch { /* Measurement must not interrupt enquiries. */ }
    }
    if (ga4Active && ga4Choice === 'accepted' && ga4Loaded) {
      window.gtag('event', name, {page_location: location.origin + location.pathname, page_referrer: safeReferrer(), ...data});
    }
    if (clarityLoaded && ga4Choice === 'accepted') window.clarity('event', name);
  }

  function loadClarity() {
    if (!clarityActive || clarityLoaded || ga4Choice !== 'accepted') return;
    // Query strings may contain enquiry details. Do not expose them to replay.
    const keys = [...new URLSearchParams(location.search).keys()];
    if (keys.some(key => !['utm_source','utm_medium','utm_campaign'].includes(key))) return;
    if (keys.length && !campaign()) return;
    const safeCampaign = campaign();
    if (safeCampaign && Object.values(safeCampaign).includes('other')) return;
    clarityLoaded = true;
    window.clarity = window.clarity || function () {(window.clarity.q = window.clarity.q || []).push(arguments);};
    window.clarity('consentv2', {analytics_Storage:'granted', ad_Storage:'denied'});
    document.querySelectorAll('form').forEach(form => form.setAttribute('data-clarity-mask', 'true'));
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.clarity.ms/tag/' + clarityId;
    document.head.appendChild(tag);
  }

  function startMeasurement() {
    loadGa4();
    loadClarity();
    if (!interactionsStarted && (preview || umamiActive || ga4Choice === 'accepted')) {
      interactionsStarted = true;
      installInteractions();
    }
  }

  function loadGa4() {
    if (!ga4Active || ga4Loaded || ga4Choice !== 'accepted') return;
    ga4Loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', {analytics_storage: 'granted'});
    window.gtag('js', new Date());
    const attribution = campaign();
    window.gtag('config', ga4Id, {
      send_page_view: false,
      page_location: location.origin + location.pathname,
      page_referrer: safeReferrer(),
      ...(attribution ? {campaign_source: attribution.source, campaign_medium: attribution.medium, campaign_name: attribution.campaign} : {}),
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4Id);
    document.head.appendChild(tag);
    window.gtag('event', 'page_view', {page_location: location.origin + location.pathname, page_referrer: safeReferrer()});
    if (attribution) window.gtag('event', 'campaign', {
      page_location: location.origin + location.pathname, page_referrer: safeReferrer(), ...attribution
    });
  }

  function campaign() {
    const query = new URLSearchParams(location.search);
    const buckets = {
      source: new Set(['google', 'bing', 'duckduckgo', 'linkedin', 'instagram', 'facebook', 'whatsapp', 'newsletter']),
      medium: new Set(['organic', 'social', 'referral', 'paid', 'email', 'messaging']),
      campaign: new Set(['business_profile', 'catalogue', 'launch'])
    };
    const source = (query.get('utm_source') || '').toLowerCase();
    const medium = (query.get('utm_medium') || '').toLowerCase();
    const name = (query.get('utm_campaign') || '').toLowerCase();
    if (source || medium || name) return {
      source: buckets.source.has(source) ? source : 'other',
      medium: buckets.medium.has(medium) ? medium : 'other',
      campaign: buckets.campaign.has(name) ? name : 'other'
    };
    return null;
  }

  function placement(element) {
    if (element.closest('header')) return 'header';
    if (element.closest('#home')) return 'hero';
    if (element.closest('#contact')) return 'contact';
    if (element.closest('footer')) return 'footer';
    return 'body';
  }

  function trackDepth() {
    const scrollable = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const depth = Math.round(scrollY / scrollable * 100);
    for (const mark of [25, 50, 75, 100]) {
      if (depth >= mark && !seenScroll.has(mark)) {
        seenScroll.add(mark);
        emit('scroll_depth', {percent: mark});
      }
    }
  }

  function observeSections() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seenSections.has(entry.target.id)) continue;
        seenSections.add(entry.target.id);
        emit('section_view', {section: entry.target.id});
      }
    }, {rootMargin: '-20% 0px -20% 0px', threshold: 0});
    document.querySelectorAll('main section[id]').forEach(section => {
      if (sections.has(section.id)) observer.observe(section);
    });
  }

  function installInteractions() {
    observeSections();
    addEventListener('scroll', trackDepth, {passive: true});
    trackDepth();
    setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      visibleSeconds += 1;
      for (const mark of [30, 60, 120, 300]) {
        if (visibleSeconds >= mark && !seenTime.has(mark)) {
          seenTime.add(mark);
          emit('visible_time', {seconds: mark});
        }
      }
    }, 1000);

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const position = placement(link);
      if (link.hasAttribute('data-product')) {
        const product = products.get(link.getAttribute('data-product'));
        if (product) emit('product_interest', {group: product});
      }
      if (href.startsWith('#')) {
        const section = href.slice(1);
        if (sections.has(section)) emit('navigation', {section, placement: position});
      } else if (/^mailto:/i.test(href)) {
        emit('contact_handoff', {channel: 'email', placement: position});
      } else if (/^tel:/i.test(href)) {
        emit('contact_handoff', {channel: 'phone', placement: position});
      } else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) {
        emit('contact_handoff', {channel: 'whatsapp', placement: position});
      } else if (link.classList.contains('map-link')) {
        emit('map_open');
      }
    }, true);

    const form = document.getElementById('enquiry-form');
    if (form) {
      form.addEventListener('focusin', () => {
        if (!formStarted) { formStarted = true; emit('rfq_start'); }
      });
      form.addEventListener('focusout', event => {
        const field = event.target;
        if (field && fields.has(field.id)) emit('rfq_field', {
          field: field.id, state: field.value.trim() ? 'filled' : 'empty'
        });
      });
      form.addEventListener('invalid', event => {
        emit('rfq_validation', {field: fields.has(event.target.id) ? event.target.id : 'other'});
      }, true);
      form.addEventListener('submit', () => {
        emit('rfq_prepared', {channel: 'whatsapp'});
        emit('contact_handoff', {channel: 'whatsapp', placement: 'form'});
      }, true);
      document.getElementById('email-enquiry')?.addEventListener('click', () => {
        if (!form.checkValidity()) return;
        emit('rfq_prepared', {channel: 'email'});
        emit('contact_handoff', {channel: 'email', placement: 'form'});
      }, true);
    }
    document.querySelectorAll('#faq details').forEach((detail, index) => {
      detail.addEventListener('toggle', () => {
        if (detail.open) emit('faq_open', {question: 'question_' + String(index + 1)});
      });
    });
  }

  function createControls() {
    const footer = document.querySelector('footer .copyright');
    if (!footer) return;
    if (!ga4Active && !clarityActive && !consentPreview) return;

    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'vayam-analytics-settings';
    open.textContent = 'Analytics choices';
    footer.appendChild(open);
    const panel = document.createElement('aside');
    panel.className = 'vayam-consent';
    panel.hidden = ga4Choice !== 'unset';
    panel.setAttribute('aria-label', 'Optional visitor analytics');
    panel.innerHTML = '<h2>Optional visitor analytics</h2>' +
      '<p>Allow Google Analytics and, when connected, Microsoft Clarity to measure visits, product interest and page interactions. Enquiry fields are masked in recordings. These services help us improve the website.</p>' +
      '<a href="/privacy.html">How measurement works</a>' +
      '<div class="vayam-consent-actions"><button type="button" data-choice="accepted">Allow analytics</button>' +
      '<button type="button" data-choice="rejected">No thanks</button></div>';
    document.body.appendChild(panel);
    open.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button')?.focus(); });
    panel.addEventListener('click', event => {
      const button = event.target instanceof Element ? event.target.closest('button[data-choice]') : null;
      if (!button) return;
      ga4Choice = button.dataset.choice;
      try { localStorage.setItem(choiceKey, ga4Choice); } catch { /* No persistence in private mode. */ }
      panel.hidden = true;
      open.focus();
      if (ga4Choice === 'accepted') startMeasurement();
      else if (ga4Loaded || clarityLoaded) {
        if (ga4Loaded) {
          window['ga-disable-' + ga4Id] = true;
          window.gtag('consent', 'update', {analytics_storage: 'denied'});
        }
        if (clarityLoaded) window.clarity('consentv2', {analytics_Storage:'denied', ad_Storage:'denied'});
        for (const cookie of document.cookie.split(';')) {
          const name = cookie.split('=')[0].trim();
          if (!/^(_ga|_clck|_clsk)/.test(name)) continue;
          for (const domain of ['', location.hostname, '.' + location.hostname.replace(/^www\./,'')]) {
            document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' + (domain ? '; Domain=' + domain : '');
          }
        }
        location.reload();
      }
    });
  }

  createControls();
  startMeasurement();
  window.addEventListener('error', event => emit('technical_error', {kind: event.target === window ? 'script' : 'resource'}), true);
  window.addEventListener('unhandledrejection', () => emit('technical_error', {kind: 'promise'}));
  if (preview) {
    window.VayamAnalyticsPreview = Object.freeze({events: () => trace.slice()});
    const attribution = campaign();
    if (attribution) emit('campaign', attribution);
  }
  if (ga4Active && ga4Choice === 'accepted') loadGa4();
  if (umamiActive) {
    // The tracker never loads on localhost, an unapproved host, or without an ID.
    const tag = document.createElement('script');
    tag.defer = true;
    tag.src = 'https://cloud.umami.is/script.js';
    tag.dataset.websiteId = websiteId;
    tag.dataset.domains = config.allowedHosts.join(',');
    tag.dataset.excludeSearch = 'true';
    tag.dataset.excludeHash = 'true';
    tag.dataset.doNotTrack = 'true';
    tag.dataset.performance = 'true';
    tag.dataset.beforeSend = 'vayamAnalyticsBeforeSend';
    tag.addEventListener('load', () => {
      const attribution = campaign();
      if (attribution && typeof window.umami?.track === 'function') window.umami.track('campaign', attribution);
    }, {once: true});
    document.head.appendChild(tag);
  }
})();
