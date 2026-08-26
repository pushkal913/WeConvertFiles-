// js/tools/sql-formatter.js
// Tool module for "sql-formatter", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const input = document.getElementById('sqlInput');
    const output = document.getElementById('sqlOutput');
    const dialectSelect = document.getElementById('sqlDialectSelect');
    const caseSelect = document.getElementById('sqlCaseSelect');
    const indentSelect = document.getElementById('sqlIndentSelect');
    const formatBtn = document.getElementById('sqlFormatBtn');
    const copyBtn = document.getElementById('sqlCopyBtn');
    const downloadBtn = document.getElementById('sqlDownloadBtn');
    const clearBtn = document.getElementById('sqlClearBtn');
    const info = document.getElementById('sqlInfoBox');

    const showError = (message) => {
      output.value = '';
      info.className = 'mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold whitespace-pre-wrap';
      info.textContent = message;
    };
    const showSuccess = (message) => {
      info.className = 'mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold';
      info.textContent = message;
    };

    const runFormat = async () => {
      const raw = input.value.trim();
      if (!raw) {
        output.value = '';
        info.className = 'hidden';
        return;
      }
      const originalLabel = formatBtn.textContent;
      formatBtn.disabled = true;
      formatBtn.textContent = 'Loading engine...';
      try {
        await loadConverterLibrary('sqlformatter');
      } catch (error) {
        formatBtn.disabled = false;
        formatBtn.textContent = originalLabel;
        showError(error.message);
        return;
      }
      formatBtn.disabled = false;
      formatBtn.textContent = originalLabel;

      try {
        const formatted = sqlFormatter.format(raw, {
          language: dialectSelect.value,
          keywordCase: caseSelect.value,
          tabWidth: parseInt(indentSelect.value, 10) || 2,
          useTabs: false
        });
        output.value = formatted;
        showSuccess('SQL formatted successfully.');
      } catch (error) {
        showError(`Unable to format SQL: ${error.message}`);
      }
    };

    if (formatBtn) formatBtn.addEventListener('click', runFormat);
    if (clearBtn) clearBtn.addEventListener('click', () => {
      input.value = '';
      output.value = '';
      info.className = 'hidden';
    });
    if (copyBtn) copyBtn.addEventListener('click', () => {
      if (output.value) {
        navigator.clipboard.writeText(output.value);
        showNotification('Copied formatted SQL!');
      }
    });
    if (downloadBtn) downloadBtn.addEventListener('click', () => {
      if (!output.value) return;
      const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted-query.sql';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="grid gap-4 sm:grid-cols-3 mb-4">
          <div>
            <label class="${labelClass}">SQL Dialect</label>
            <select id="sqlDialectSelect" class="${inputClass}">
              <option value="sql" selected>Standard SQL</option>
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="transactsql">SQL Server (T-SQL)</option>
            </select>
          </div>
          <div>
            <label class="${labelClass}">Keyword Case</label>
            <select id="sqlCaseSelect" class="${inputClass}">
              <option value="preserve" selected>Preserve</option>
              <option value="upper">UPPERCASE</option>
              <option value="lower">lowercase</option>
            </select>
          </div>
          <div>
            <label class="${labelClass}">Indent Size</label>
            <select id="sqlIndentSelect" class="${inputClass}">
              <option value="2" selected>2 Spaces</option>
              <option value="4">4 Spaces</option>
            </select>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Raw SQL Input</label>
            <textarea id="sqlInput" rows="12" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition" placeholder="Paste your raw SQL query here..."></textarea>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Formatted Output</label>
            <textarea id="sqlOutput" rows="12" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none readonly" readonly placeholder="Formatted SQL will appear here..."></textarea>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2.5">
          <button id="sqlFormatBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md">Format SQL</button>
          <button id="sqlCopyBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy Output</button>
          <button id="sqlDownloadBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Download .sql</button>
          <button id="sqlClearBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 transition ml-auto">Clear</button>
        </div>
        <div id="sqlInfoBox" class="hidden mt-3 p-3 rounded-xl text-xs font-bold whitespace-pre-wrap"></div>
        <p class="mt-3 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">This tool only formats SQL syntax locally in your browser — it never executes, connects to, or transmits your queries to any database or server.</p>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('sql-formatter', { render: render })
    : console.error('WCF.registerTool unavailable for sql-formatter');
})();
