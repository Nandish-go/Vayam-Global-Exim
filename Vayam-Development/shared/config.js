window.VAYAM_SETTINGS = Object.freeze({
  ...window.VAYAM_BUSINESS,
  // Enable only after property ownership, privacy settings and the release are reviewed.
  analytics: {enabled: false, measurementId: '', allowedHosts: ['vayam-global.com','www.vayam-global.com'], debug: false}
});
