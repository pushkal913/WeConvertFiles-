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

  function removeBanner() {
    var existing = document.getElementById(BANNER_ID);
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  }

  function choose(value) {
    var previous = getConsent();
    setConsent(value);
    removeBanner();
    if (value === 'granted') {
      loadAnalytics();
    } else if (previous === 'granted') {
      // Analytics was already running this session; reload so it stops cleanly.
      location.reload();
    }
  }

  function showBanner() {
    if (!document.body || document.getElementById(BANNER_ID)) return;
    var wrap = document.createElement('div');
    wrap.id = BANNER_ID;
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Cookie and analytics consent');
    wrap.className = 'fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4';
    wrap.innerHTML =
      '<div class="mx-auto max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] shadow-2xl p-4 sm:p-5">' +
        '<div class="sm:flex sm:items-center sm:gap-5">' +
          '<div class="text-sm leading-6 text-slate-600 dark:text-slate-300">' +
            '<p class="font-semibold text-slate-900 dark:text-slate-100">We value your privacy</p>' +
            '<p class="mt-1">Supported file processing runs in your browser and is not sent to WeConvertFiles for conversion. With your consent, we use Zoho PageSense analytics to understand how the site is used. See our <a href="/privacy" class="font-semibold text-[#1967d2] dark:text-blue-400 hover:underline">Privacy Policy</a>.</p>' +
          '</div>' +
          '<div class="mt-4 sm:mt-0 flex shrink-0 gap-2.5">' +
            '<button type="button" data-consent-choice="denied" class="rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 transition">Decline</button>' +
            '<button type="button" data-consent-choice="granted" class="rounded-full bg-[#1a73e8] hover:bg-[#1557b0] px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 transition">Accept</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    wrap.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-consent-choice]');
      if (!btn) return;
      choose(btn.getAttribute('data-consent-choice'));
    });

    // Move focus to the banner for keyboard and screen-reader users.
    var accept = wrap.querySelector('[data-consent-choice="granted"]');
    if (accept) { try { accept.focus({ preventScroll: true }); } catch (e) { accept.focus(); } }
  }

  function openSettings() {
    // Re-open the banner so the visitor can change or withdraw consent.
    removeBanner();
    showBanner();
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

  // The homepage/tool pages ship the footer in markup; layout.js injects it
  // later on the content pages, so watch for it if it is not present yet.
  function ensureSettingsLink() {
    if (injectSettingsLink()) return;
    var observer = new MutationObserver(function () {
      if (injectSettingsLink()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    // Stop watching after a short window regardless.
    setTimeout(function () { observer.disconnect(); }, 8000);
  }

  // Any element marked data-cookie-settings re-opens the banner.
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-cookie-settings]');
    if (!trigger) return;
    event.preventDefault();
    openSettings();
  });

  // ---- Start --------------------------------------------------------------

  if (getConsent() === 'granted') loadAnalytics();

  onReady(function () {
    ensureSettingsLink();
    if (!getConsent()) showBanner();
  });
})();
