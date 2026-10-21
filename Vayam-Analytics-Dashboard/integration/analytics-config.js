// Prepared measurement layers. Neither service loads without its own ID and
// explicit enable flag on a listed HTTPS production hostname.
window.VAYAM_ANALYTICS_CONFIG = Object.freeze({
  enabled: false,
  websiteId: '',
  ga4Enabled: false,
  ga4MeasurementId: '',
  allowedHosts: ['vayam-global.com', 'www.vayam-global.com']
});
