// js/tools/url-base64.js
// Tool module for "url-base64", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const runBtn = document.getElementById('urlBase64RunBtn');
    const copyBtn = document.getElementById('urlBase64CopyBtn');
    const runUrlBase64 = () => {
      const mode = document.getElementById('urlBase64Mode').value;
      const input = document.getElementById('urlBase64Input').value;
      const outputArea = document.getElementById('urlBase64Output');
      if (!input) {
        outputArea.value = '';
        return;
      }
      try {
        let result = '';
        if (mode === 'url-enc') {
          result = encodeURIComponent(input);
        } else if (mode === 'url-dec') {
          result = decodeURIComponent(input);
        } else if (mode === 'b64-enc') {
          result = btoa(unescape(encodeURIComponent(input)));
        } else if (mode === 'b64-dec') {
          result = decodeURIComponent(escape(atob(input)));
        }
        outputArea.value = result;
      } catch (err) {
        outputArea.value = `Error: ${err.message}`;
      }
    };
    if (runBtn) runBtn.addEventListener('click', runUrlBase64);
    if (copyBtn) copyBtn.addEventListener('click', () => {
      const out = document.getElementById('urlBase64Output');
      if (out && out.value) {
        navigator.clipboard.writeText(out.value);
        showNotification('Copied output!');
      }
    });
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="${labelClass}">Tool Operation Mode</label>
            <select id="urlBase64Mode" class="${inputClass}">
              <option value="url-enc" selected>URL Encode</option>
              <option value="url-dec">URL Decode</option>
              <option value="b64-enc">Base64 Encode (Text)</option>
              <option value="b64-dec">Base64 Decode (Text)</option>
            </select>
          </div>
          <div>
            <label class="${labelClass}">Actions</label>
            <div class="mt-2 flex gap-2">
              <button id="urlBase64RunBtn" type="button" class="flex-1 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition">Convert Now</button>
              <button id="urlBase64CopyBtn" type="button" class="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy</button>
            </div>
          </div>
        </div>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label class="${labelClass}">Input Payload</label>
            <textarea id="urlBase64Input" rows="5" class="${inputClass} mt-2 font-mono text-xs" placeholder="Paste data to convert..."></textarea>
          </div>
          <div>
            <label class="${labelClass}">Result Output</label>
            <textarea id="urlBase64Output" rows="5" class="${inputClass} mt-2 font-mono text-xs readonly" readonly placeholder="Result will appear here..."></textarea>
          </div>
        </div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('url-base64', { render: render })
    : console.error('WCF.registerTool unavailable for url-base64');
})();
