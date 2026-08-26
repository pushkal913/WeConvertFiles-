// js/tools/json-yaml.js
// Tool module for "json-yaml", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const input = document.getElementById('jyInput');
    const output = document.getElementById('jyOutput');
    const dirToYaml = document.getElementById('jyDirToYaml');
    const dirToJson = document.getElementById('jyDirToJson');
    const indentSelect = document.getElementById('jyIndentSelect');
    const inputLabel = document.getElementById('jyInputLabel');
    const outputLabel = document.getElementById('jyOutputLabel');
    const convertBtn = document.getElementById('jyConvertBtn');
    const copyBtn = document.getElementById('jyCopyBtn');
    const downloadBtn = document.getElementById('jyDownloadBtn');
    const clearBtn = document.getElementById('jyClearBtn');
    const info = document.getElementById('jyInfoBox');

    const toggleBaseClass = 'px-3.5 py-1.5 text-xs font-bold rounded-lg transition';
    const toggleActiveClass = 'bg-blue-600 text-white shadow';
    const toggleInactiveClass = 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';

    let direction = 'json-to-yaml';

    const showError = (message) => {
      output.value = '';
      info.className = 'mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold whitespace-pre-wrap';
      info.textContent = message;
    };
    const showSuccess = (message) => {
      info.className = 'mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold';
      info.textContent = message;
    };

    const setDirection = (dir) => {
      direction = dir;
      const toYaml = dir === 'json-to-yaml';
      dirToYaml.className = `${toggleBaseClass} ${toYaml ? toggleActiveClass : toggleInactiveClass}`;
      dirToJson.className = `${toggleBaseClass} ${!toYaml ? toggleActiveClass : toggleInactiveClass}`;
      inputLabel.textContent = toYaml ? 'JSON Input' : 'YAML Input';
      outputLabel.textContent = toYaml ? 'YAML Output' : 'JSON Output';
      input.placeholder = toYaml ? 'Paste your raw JSON here...' : 'Paste your YAML document here...';
      output.value = '';
      info.className = 'hidden';
    };

    const runConvert = async () => {
      const raw = input.value.trim();
      if (!raw) {
        output.value = '';
        info.className = 'hidden';
        return;
      }
      const originalLabel = convertBtn.textContent;
      convertBtn.disabled = true;
      convertBtn.textContent = 'Loading engine...';
      try {
        await loadConverterLibrary('jsyaml');
      } catch (error) {
        convertBtn.disabled = false;
        convertBtn.textContent = originalLabel;
        showError(error.message);
        return;
      }
      convertBtn.disabled = false;
      convertBtn.textContent = originalLabel;

      const indent = parseInt(indentSelect.value, 10) || 2;
      try {
        if (direction === 'json-to-yaml') {
          const parsed = JSON.parse(raw);
          output.value = jsyaml.dump(parsed, { indent, lineWidth: -1, noRefs: true });
          showSuccess('Converted JSON to YAML successfully.');
        } else {
          const parsed = jsyaml.load(raw);
          output.value = JSON.stringify(parsed, null, indent);
          showSuccess('Converted YAML to JSON successfully.');
        }
      } catch (error) {
        showError(`${direction === 'json-to-yaml' ? 'Invalid JSON' : 'Invalid YAML'}: ${error.message}`);
      }
    };

    if (dirToYaml) dirToYaml.addEventListener('click', () => setDirection('json-to-yaml'));
    if (dirToJson) dirToJson.addEventListener('click', () => setDirection('yaml-to-json'));
    if (convertBtn) convertBtn.addEventListener('click', runConvert);
    if (clearBtn) clearBtn.addEventListener('click', () => {
      input.value = '';
      output.value = '';
      info.className = 'hidden';
    });
    if (copyBtn) copyBtn.addEventListener('click', () => {
      if (output.value) {
        navigator.clipboard.writeText(output.value);
        showNotification('Copied output!');
      }
    });
    if (downloadBtn) downloadBtn.addEventListener('click', () => {
      if (!output.value) return;
      const ext = direction === 'json-to-yaml' ? 'yaml' : 'json';
      const mime = direction === 'json-to-yaml' ? 'text/yaml;charset=utf-8' : 'application/json;charset=utf-8';
      const blob = new Blob([output.value], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    setDirection('json-to-yaml');
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-1">
            <button id="jyDirToYaml" type="button" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition">JSON &rarr; YAML</button>
            <button id="jyDirToJson" type="button" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition">YAML &rarr; JSON</button>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Indent</label>
            <select id="jyIndentSelect" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition">
              <option value="2" selected>2 Spaces</option>
              <option value="4">4 Spaces</option>
            </select>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label id="jyInputLabel" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">JSON Input</label>
            <textarea id="jyInput" rows="12" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition" placeholder="Paste your raw JSON here..."></textarea>
          </div>
          <div>
            <label id="jyOutputLabel" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">YAML Output</label>
            <textarea id="jyOutput" rows="12" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none readonly" readonly placeholder="Converted output will appear here..."></textarea>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2.5">
          <button id="jyConvertBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md">Convert</button>
          <button id="jyCopyBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy Output</button>
          <button id="jyDownloadBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Download</button>
          <button id="jyClearBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 transition ml-auto">Clear</button>
        </div>
        <div id="jyInfoBox" class="hidden mt-3 p-3 rounded-xl text-xs font-bold whitespace-pre-wrap"></div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('json-yaml', { render: render })
    : console.error('WCF.registerTool unavailable for json-yaml');
})();
