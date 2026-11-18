// Explicit events only. Never pass task objects, titles, details or backup data.
(function () {
  'use strict';
  const preferenceKey = 'moonlit-analytics-enabled';
  const allowed = new Set(['app_opened','task_created','task_updated','task_completed','task_reopened','schedule_created','schedule_adjusted','task_deleted','schedule_deleted','delete_undone','backup_export_started','backup_restored']);
  let enabled = true;
  try { enabled = localStorage.getItem(preferenceKey) !== 'false'; } catch (_) {}
  let started = false;
  function start() {
    if (started) return;
    started = true;
    // Queue while the official asynchronous SDK loads. Failure never blocks the planner.
    const ph = window.posthog = window.posthog || [];
    if (!ph.__SV) {
      ph._i = [];
      ['capture','opt_out_capturing','opt_in_capturing'].forEach(function (name) {
        ph[name] = function () { ph.push([name].concat(Array.from(arguments))); };
      });
      ph.init = function (token, config) { ph._i.push([token, config, 'posthog']); };
      ph.__SV = 1;
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://us-assets.i.posthog.com/static/array.js';
      document.head.appendChild(script);
    }
    ph.init('phc_nUXm7oV8sRsxJsMH2HSjYukgEJYeBvHooUb89yfcgEp7', {
      api_host: 'https://us.i.posthog.com',
      defaults: '2026-05-30',
      person_profiles: 'never',
      persistence: 'localStorage',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      capture_exceptions: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_flags: true,
      ip: false,
      before_send: function (event) {
        if (!enabled || !event || !allowed.has(event.event)) return null;
        // Strip automatic page titles, URLs, referrers and other unneeded metadata.
        const safe = new Set(['distinct_id','$device_id','$session_id','$window_id','$browser','$browser_version','$os','$os_version','$device_type','$screen_height','$screen_width','$viewport_height','$viewport_width','$lib','$lib_version','$insert_id','time','$process_person_profile','app_version','adjustment']);
        const properties = {};
        Object.keys(event.properties || {}).forEach(function (key) {
          if (safe.has(key)) properties[key] = event.properties[key];
        });
        event.properties = properties;
        return event;
      }
    });
  }
  function track(name, properties) {
    if (!enabled || !allowed.has(name)) return;
    try {
      start();
      const safe = {app_version: '1.1.0-analytics'};
      if (name === 'schedule_adjusted' && ['move','resize'].includes(properties?.adjustment)) safe.adjustment = properties.adjustment;
      window.posthog.capture(name, safe);
    } catch (_) {}
  }
  function setEnabled(value) {
    enabled = !!value;
    try { localStorage.setItem(preferenceKey, String(enabled)); } catch (_) {}
    try {
      if (!enabled) window.posthog?.opt_out_capturing();
      else { start(); window.posthog.opt_in_capturing(); track('app_opened'); }
    } catch (_) {}
  }
  window.WeeklyAnalytics = {track, setEnabled, isEnabled: function () { return enabled; }};
  track('app_opened');
})();
