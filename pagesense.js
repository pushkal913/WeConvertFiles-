/*
 * Consent-gated analytics loader for WeConvertFiles.
 *
 * Non-essential analytics (Zoho PageSense) MUST NOT load before the visitor
 * has given affirmative consent. This script:
 *   1. Loads PageSense only after consent is granted (opt-in).
 *   2. Shows a consent banner on the first visit until a choice is made.
 *   3. Injects a persistent "Cookie settings" control into the footer so the
 *      choice can be reviewed or withdrawn at any time.
 *
 * It is included on every page via <script id="pagesenseCode" src="/pagesense.js">,
 * so the gate and the controls apply site-wide without per-page changes.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'wcf-analytics-consent'; // 'granted' | 'denied'
  var PAGESENSE_SRC = 'https://cdn-in.pagesense.io/js/stutisharma9918gmaildotcom/940fee3636f44997b38dc4cb7fc80a69.js';
  var analyticsLoaded = false;

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage blocked */ }
  }

  // Inject the real PageSense script. Only ever called after consent === granted.
  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window._ps_conf = window._ps_conf || {};
    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = PAGESENSE_SRC;
    var current = document.getElementById('pagesenseCode');
    if (current && current.getAttribute) {
      var nonce = current.getAttribute('nonce');
      if (nonce) script.setAttribute('nonce', nonce);
    }
    head.appendChild(script);
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  // ---- Consent banner -----------------------------------------------------

  var BANNER_ID = 'wcf-consent-banner';
  var settingsTrigger = null;

  function removeBanner(restoreFocus) {
    var existing = document.getElementById(BANNER_ID);
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    if (restoreFocus && settingsTrigger && document.documentElement.contains(settingsTrigger)) {
      try { settingsTrigger.focus({ preventScroll: true }); } catch (e) { settingsTrigger.focus(); }
    }
    if (restoreFocus) settingsTrigger = null;
  }

  function choose(value) {
    var previous = getConsent();
    setConsent(value);
    removeBanner(true);
    if (value === 'granted') {
      loadAnalytics();
    } else if (previous === 'granted') {
      // Analytics was already running this session; reload so it stops cleanly.
      location.reload();
    }
  }

  // mode: 'settings' when reopened from the Cookie settings control (a choice
  // already exists) — adds a close button and shows the current setting.
  function showBanner(mode) {
    if (!document.body) return;
    removeBanner(false);
    var isSettings = mode === 'settings';
    if (!isSettings) settingsTrigger = null;
    var consent = getConsent();
    var statusHtml = '';
    if (isSettings) {
      var on = consent === 'granted';
      statusHtml =
        '<p class="mt-1.5 text-xs font-semibold ' +
        (on ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400') +
        '">Analytics is currently ' + (on ? 'ON' : 'OFF') + '. Choose an option below, or close to keep it.</p>';
    }
    var closeBtn = isSettings
      ? '<button type="button" data-consent-close aria-label="Close cookie settings" style="position:absolute;top:0.75rem;right:0.75rem" class="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>'
      : '';
    var wrap = document.createElement('div');
    wrap.id = BANNER_ID;
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', isSettings ? 'Cookie settings' : 'Cookie and analytics consent');
    wrap.className = 'fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4';
    wrap.innerHTML =
      '<div class="relative mx-auto max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] shadow-2xl p-4 sm:p-5">' +
        closeBtn +
        '<div class="sm:flex sm:items-center sm:gap-5">' +
          '<div class="text-sm leading-6 text-slate-600 dark:text-slate-300 ' + (isSettings ? 'pr-8 sm:pr-4' : '') + '">' +
            '<p class="font-semibold text-slate-900 dark:text-slate-100">' + (isSettings ? 'Cookie settings' : 'We value your privacy') + '</p>' +
            '<p class="mt-1">Supported file processing runs in your browser and is not sent to WeConvertFiles for conversion. With your consent, we use Zoho PageSense analytics to understand how the site is used. See our <a href="/privacy" class="font-semibold text-[#1967d2] dark:text-blue-400 hover:underline">Privacy Policy</a>.</p>' +
            statusHtml +
          '</div>' +
          '<div class="mt-4 sm:mt-0 flex shrink-0 gap-2.5">' +
            '<button type="button" data-consent-choice="denied" class="rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 transition">Decline</button>' +
            '<button type="button" data-consent-choice="granted" class="rounded-full bg-[#1a73e8] hover:bg-[#1557b0] px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 transition">Accept</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    wrap.addEventListener('click', function (event) {
      if (event.target.closest('[data-consent-close]')) { removeBanner(true); return; }
      var btn = event.target.closest('[data-consent-choice]');
      if (btn) choose(btn.getAttribute('data-consent-choice'));
    });
    wrap.addEventListener('keydown', function (event) {
      if (isSettings && event.key === 'Escape') {
        event.preventDefault();
        removeBanner(true);
      }
    });

    // Move focus into the banner for keyboard and screen-reader users.
    var focusEl = wrap.querySelector(isSettings ? '[data-consent-close]' : '[data-consent-choice="granted"]');
    if (focusEl) { try { focusEl.focus({ preventScroll: true }); } catch (e) { focusEl.focus(); } }
  }

  function openSettings(trigger) {
    // Re-open the banner in settings mode so the choice can be changed, withdrawn, or closed.
    settingsTrigger = trigger && typeof trigger.focus === 'function' ? trigger : document.activeElement;
    showBanner('settings');
    var banner = document.getElementById(BANNER_ID);
    if (banner) banner.scrollIntoView({ block: 'nearest' });
  }
  window.wcfConsent = { open: openSettings, get: getConsent };

  // ---- "Cookie settings" footer control -----------------------------------

  function injectSettingsLink() {
    // Anchor off an existing footer legal link so styling matches the row.
    var reference = document.querySelector('footer a[href="/privacy"], footer a[href="/terms"]');
    if (!reference || !reference.parentNode) return false;
    if (reference.parentNode.querySelector('[data-cookie-settings]')) return true;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-cookie-settings', '');
    btn.className = reference.className + ' cursor-pointer';
    btn.textContent = 'Cookie settings';
    reference.parentNode.appendChild(btn);
    return true;
  }

  // Every page that loads this script now ships its footer (with the legal
  // links) in the delivered HTML, so the settings control can be attached
  // directly once the DOM is ready — there is no longer a dynamically injected
  // footer to wait for, so no document-wide observer is needed. Pages without a
  // footer (e.g. 404) simply have nowhere to attach the control, which is fine.

  // Any element marked data-cookie-settings re-opens the banner.
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-cookie-settings]');
    if (!trigger) return;
    event.preventDefault();
    openSettings(trigger);
  });

  // ---- Start --------------------------------------------------------------

  if (getConsent() === 'granted') loadAnalytics();

  onReady(function () {
    injectSettingsLink();
    if (!getConsent()) showBanner();
  });
})();
