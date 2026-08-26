// js/tools/json-formatter.js
// Tool module for "json-formatter", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const input = document.getElementById('jsonFormatterInput');
    const output = document.getElementById('jsonFormatterOutput');
    const validateBtn = document.getElementById('jsonValidateBtn');
    const formatBtn = document.getElementById('jsonFormatBtn');
    const minifyBtn = document.getElementById('jsonMinifyBtn');
    const clearBtn = document.getElementById('jsonClearBtn');
    const copyBtn = document.getElementById('jsonCopyBtn');
    const info = document.getElementById('jsonInfoBox');
    const spacesSelect = document.getElementById('jsonSpacesSelect');

    const expandLayout = () => {
      const wrapper = document.getElementById('jsonGridWrapper');
      const buttonsRow = document.getElementById('jsonButtonsRow');
      const outputCol = document.getElementById('jsonOutputCol');
      if (wrapper && buttonsRow && outputCol) {
        wrapper.classList.remove('md:grid-cols-2');
        wrapper.classList.add('grid-cols-1');
        wrapper.insertBefore(buttonsRow, outputCol);
      }
      if (output) {
        output.style.minHeight = '650px';
      }
    };

    const resetLayout = () => {
      const wrapper = document.getElementById('jsonGridWrapper');
      const buttonsRow = document.getElementById('jsonButtonsRow');
      if (wrapper && buttonsRow) {
        wrapper.parentNode.insertBefore(buttonsRow, wrapper.nextSibling);
        wrapper.classList.remove('grid-cols-1');
        wrapper.classList.add('md:grid-cols-2');
      }
      if (output) {
        output.style.minHeight = '';
        output.style.height = '';
      }
    };

    const runFormat = (minify = false) => {
      const raw = input.value.trim();
      if (!raw) {
        output.value = '';
        info.className = 'hidden';
        return;
      }
      expandLayout();
      try {
        const obj = JSON.parse(raw);
        if (minify) {
          output.value = JSON.stringify(obj);
        } else {
          const spaces = parseInt(spacesSelect.value, 10) || 2;
          output.value = JSON.stringify(obj, null, spaces);
        }
        info.className = 'mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold';
        info.textContent = 'Valid JSON! Processed successfully.';
      } catch (err) {
        output.value = '';
        info.className = 'mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold';
        info.textContent = `Invalid JSON: ${err.message}`;
      }
    };

    if (validateBtn) validateBtn.addEventListener('click', () => runFormat(false));
    if (formatBtn) formatBtn.addEventListener('click', () => runFormat(false));
    if (minifyBtn) minifyBtn.addEventListener('click', () => runFormat(true));
    if (clearBtn) clearBtn.addEventListener('click', () => {
      input.value = '';
      output.value = '';
      info.className = 'hidden';
      resetLayout();
    });
    if (copyBtn) copyBtn.addEventListener('click', () => {
      if (output.value) {
        navigator.clipboard.writeText(output.value);
        showNotification('Copied formatted JSON!');
      }
    });
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="mb-4 flex items-center justify-between">
          <label class="${labelClass}">Spaces / Tab Size</label>
          <select id="jsonSpacesSelect" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition">
            <option value="2" selected>2 Spaces</option>
            <option value="3">3 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="8">8 Spaces</option>
          </select>
        </div>
        <div id="jsonGridWrapper" class="grid gap-4 md:grid-cols-2 transition-all duration-300">
          <div id="jsonInputCol">
            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Raw JSON Input</label>
            <textarea id="jsonFormatterInput" rows="12" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition" placeholder="Paste your raw JSON text here..."></textarea>
          </div>
          <div id="jsonOutputCol">
            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Formatted Output</label>
            <textarea id="jsonFormatterOutput" rows="12" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none readonly" readonly placeholder="Formatted output will appear here..."></textarea>
          </div>
        </div>
        <div id="jsonButtonsRow" class="mt-4 flex flex-wrap gap-2.5">
          <button id="jsonValidateBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/60 transition border border-blue-200/50 dark:border-blue-900/50">Validate JSON</button>
          <button id="jsonFormatBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md">Format / Beautify</button>
          <button id="jsonMinifyBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Minify JSON</button>
          <button id="jsonCopyBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition ml-auto">Copy Output</button>
          <button id="jsonClearBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 transition">Clear</button>
        </div>
        <div id="jsonInfoBox" class="hidden mt-3 p-3 rounded-xl text-xs font-bold"></div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('json-formatter', { render: render })
    : console.error('WCF.registerTool unavailable for json-formatter');
})();
