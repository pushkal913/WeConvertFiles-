// js/tools/uuid-generator.js
// Tool module for "uuid-generator", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const out = document.getElementById('uuidOutputText');
    const genBtn = document.getElementById('uuidGenBtn');
    const copyBtn = document.getElementById('uuidCopyBtn');

    const generateUUIDs = () => {
      const qty = Math.max(1, Math.min(500, parseInt(document.getElementById('uuidQuantityInput').value, 10) || 10));
      const version = document.getElementById('uuidVersionSelect').value;
      const casing = document.getElementById('uuidCaseSelect').value;
      const format = document.getElementById('uuidFormatSelect').value;

      const list = [];
      for (let i = 0; i < qty; i++) {
        let uuid = '';
        if (version === '4') {
          // CSPRNG v4 UUID
          const arr = new Uint8Array(16);
          window.crypto.getRandomValues(arr);
          arr[6] = (arr[6] & 0x0f) | 0x40; // v4
          arr[8] = (arr[8] & 0x3f) | 0x80; // variant 10
          const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
          uuid = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
        } else {
          // Fallback/Timestamp v1 UUID simulation client-side
          const time = Date.now();
          const rand = Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0');
          uuid = `${time.toString(16).slice(-8)}-${rand.slice(0,4)}-11e1-ab34-${rand.slice(4)}`;
        }
        if (casing === 'upper') uuid = uuid.toUpperCase();
        list.push(uuid);
      }

      if (format === 'json') {
        out.value = JSON.stringify(list, null, 2);
      } else if (format === 'csv') {
        out.value = list.join(', ');
      } else {
        out.value = list.join('\n');
      }
    };

    if (genBtn) genBtn.addEventListener('click', generateUUIDs);
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (out.value) {
          navigator.clipboard.writeText(out.value);
          showNotification('Copied UUIDs list!');
        }
      });
    }
    generateUUIDs();
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="grid gap-4 sm:grid-cols-3 mb-4">
          <div>
            <label class="${labelClass}">UUID Version</label>
            <select id="uuidVersionSelect" class="${inputClass}">
              <option value="4" selected>Version 4 (Random)</option>
              <option value="1">Version 1 (Time-based)</option>
            </select>
          </div>
          <div>
            <label class="${labelClass}">Bulk Quantity</label>
            <input type="number" id="uuidQuantityInput" class="${inputClass}" min="1" max="500" value="10" />
          </div>
          <div>
            <label class="${labelClass}">Letter Casing</label>
            <select id="uuidCaseSelect" class="${inputClass}">
              <option value="lower" selected>Lowercase</option>
              <option value="upper">Uppercase</option>
            </select>
          </div>
        </div>
        <div class="mb-4">
          <label class="${labelClass}">List Separator Format</label>
          <select id="uuidFormatSelect" class="${inputClass}">
            <option value="newline" selected>Plain text list (Newlines)</option>
            <option value="json">JSON Array</option>
            <option value="csv">CSV (Comma-separated)</option>
          </select>
        </div>
        <div class="relative mt-4">
          <textarea id="uuidOutputText" rows="6" class="${inputClass} font-mono text-xs readonly" readonly placeholder="UUID outputs will appear here..."></textarea>
          <div class="mt-4 flex gap-2.5">
            <button id="uuidGenBtn" type="button" class="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md">Generate UUIDs</button>
            <button id="uuidCopyBtn" type="button" class="px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy Output</button>
          </div>
        </div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('uuid-generator', { render: render })
    : console.error('WCF.registerTool unavailable for uuid-generator');
})();
