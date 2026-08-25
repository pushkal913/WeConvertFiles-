// js/tools/code-minifier.js
// Tool module for "code-minifier", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const input = document.getElementById('cmInput');
    const output = document.getElementById('cmOutput');
    const langSelect = document.getElementById('cmLangSelect');
    const modeMinifyBtn = document.getElementById('cmModeMinify');
    const modeBeautifyBtn = document.getElementById('cmModeBeautify');
    const runBtn = document.getElementById('cmRunBtn');
    const copyBtn = document.getElementById('cmCopyBtn');
    const downloadBtn = document.getElementById('cmDownloadBtn');
    const clearBtn = document.getElementById('cmClearBtn');
    const info = document.getElementById('cmInfoBox');
    const statsBox = document.getElementById('cmStatsBox');
    const statInput = document.getElementById('cmStatInput');
    const statOutput = document.getElementById('cmStatOutput');
    const statSaved = document.getElementById('cmStatSaved');

    const toggleBaseClass = 'px-3.5 py-1.5 text-xs font-bold rounded-lg transition';
    const toggleActiveClass = 'bg-blue-600 text-white shadow';
    const toggleInactiveClass = 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';

    let mode = 'minify';

    const showError = (message) => {
      output.value = '';
      statsBox.classList.add('hidden');
      info.className = 'mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold whitespace-pre-wrap';
      info.textContent = message;
    };
    const showSuccess = (message) => {
      info.className = 'mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold';
      info.textContent = message;
    };

    const setMode = (m) => {
      mode = m;
      const isMinify = m === 'minify';
      modeMinifyBtn.className = `${toggleBaseClass} ${isMinify ? toggleActiveClass : toggleInactiveClass}`;
      modeBeautifyBtn.className = `${toggleBaseClass} ${!isMinify ? toggleActiveClass : toggleInactiveClass}`;
      runBtn.textContent = isMinify ? 'Minify Code' : 'Beautify Code';
    };

    function minifyHtmlBasic(html) {
      const preserved = [];
      let out = html.replace(/<!--[\s\S]*?-->/g, '');
      out = out.replace(/<(pre|textarea|script|style)[\s\S]*?<\/\1>/gi, (match) => {
        preserved.push(match);
        return `\u0000${preserved.length - 1}\u0000`;
      });
      out = out.replace(/>\s+</g, '><').replace(/[ \t]{2,}/g, ' ').replace(/\n\s*/g, '').trim();
      out = out.replace(/\u0000(\d+)\u0000/g, (_, index) => preserved[Number(index)]);
      return out;
    }

    const runAction = async () => {
      const raw = input.value;
      if (!raw.trim()) {
        output.value = '';
        info.className = 'hidden';
        statsBox.classList.add('hidden');
        return;
      }
      const lang = langSelect.value;
      const originalLabel = runBtn.textContent;
      runBtn.disabled = true;
      runBtn.textContent = 'Processing...';

      try {
        let result = '';
        if (mode === 'minify') {
          if (lang === 'js') {
            await loadConverterLibrary('terser');
            const minified = await Terser.minify(raw);
            if (minified.error) throw minified.error;
            result = minified.code || '';
          } else if (lang === 'css') {
            await loadConverterLibrary('csso');
            result = csso.minify(raw).css;
          } else {
            result = minifyHtmlBasic(raw);
          }
        } else if (lang === 'js') {
          await loadConverterLibrary('jsbeautifyjs');
          result = js_beautify(raw, { indent_size: 2 });
        } else if (lang === 'css') {
          await loadConverterLibrary('jsbeautifycss');
          result = css_beautify(raw, { indent_size: 2 });
        } else {
          await Promise.all([loadConverterLibrary('jsbeautifyjs'), loadConverterLibrary('jsbeautifycss'), loadConverterLibrary('jsbeautifyhtml')]);
          result = html_beautify(raw, { indent_size: 2 });
        }

        output.value = result;
        const inputBytes = new Blob([raw]).size;
        const outputBytes = new Blob([result]).size;
        const changePct = inputBytes > 0 ? ((inputBytes - outputBytes) / inputBytes) * 100 : 0;
        statInput.textContent = `${inputBytes.toLocaleString()} B`;
        statOutput.textContent = `${outputBytes.toLocaleString()} B`;
        statSaved.textContent = `${changePct >= 0 ? '-' : '+'}${Math.abs(changePct).toFixed(1)}%`;
        statsBox.classList.remove('hidden');
        showSuccess(mode === 'minify' ? 'Code minified successfully.' : 'Code beautified successfully.');
      } catch (error) {
        showError(`Unable to process code: ${error && error.message ? error.message : error}`);
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = originalLabel;
      }
    };

    if (modeMinifyBtn) modeMinifyBtn.addEventListener('click', () => setMode('minify'));
    if (modeBeautifyBtn) modeBeautifyBtn.addEventListener('click', () => setMode('beautify'));
    if (runBtn) runBtn.addEventListener('click', runAction);
    if (clearBtn) clearBtn.addEventListener('click', () => {
      input.value = '';
      output.value = '';
      info.className = 'hidden';
      statsBox.classList.add('hidden');
    });
    if (copyBtn) copyBtn.addEventListener('click', () => {
      if (output.value) {
        navigator.clipboard.writeText(output.value);
        showNotification('Copied output!');
      }
    });
    if (downloadBtn) downloadBtn.addEventListener('click', () => {
      if (!output.value) return;
      const lang = langSelect.value;
      const extMap = { html: 'html', css: 'css', js: 'js' };
      const mimeMap = { html: 'text/html;charset=utf-8', css: 'text/css;charset=utf-8', js: 'text/javascript;charset=utf-8' };
      const blob = new Blob([output.value], { type: mimeMap[lang] || 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `output.${extMap[lang] || 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    setMode('minify');
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <label class="${labelClass}">Language</label>
            <select id="cmLangSelect" class="mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition">
              <option value="html" selected>HTML</option>
              <option value="css">CSS</option>
              <option value="js">JavaScript</option>
            </select>
          </div>
          <div class="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-1">
            <button id="cmModeMinify" type="button" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition">Minify</button>
            <button id="cmModeBeautify" type="button" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition">Beautify</button>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Input Code</label>
            <textarea id="cmInput" rows="12" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition" placeholder="Paste your HTML, CSS, or JavaScript code here..."></textarea>
          </div>
          <div>
            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Output Code</label>
            <textarea id="cmOutput" rows="12" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none readonly" readonly placeholder="Processed output will appear here..."></textarea>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2.5">
          <button id="cmRunBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md">Minify Code</button>
          <button id="cmCopyBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy Output</button>
          <button id="cmDownloadBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Download</button>
          <button id="cmClearBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 transition ml-auto">Clear</button>
        </div>
        <div id="cmStatsBox" class="hidden mt-4 grid grid-cols-3 gap-2.5 text-center">
          <div class="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/40 p-3">
            <span class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Input Size</span>
            <span id="cmStatInput" class="block mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">&mdash;</span>
          </div>
          <div class="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/40 p-3">
            <span class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Output Size</span>
            <span id="cmStatOutput" class="block mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">&mdash;</span>
          </div>
          <div class="rounded-xl border border-emerald-200/50 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-3">
            <span class="block text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Size Change</span>
            <span id="cmStatSaved" class="block mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">&mdash;</span>
          </div>
        </div>
        <div id="cmInfoBox" class="hidden mt-3 p-3 rounded-xl text-xs font-bold whitespace-pre-wrap"></div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('code-minifier', { render: render })
    : console.error('WCF.registerTool unavailable for code-minifier');
})();
