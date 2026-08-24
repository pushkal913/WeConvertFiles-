// js/tools/case-converter.js
// Tool module for "case-converter", split out of app.js (Phase 2 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened, so other
// pages never download it. Registers a render(container, ctx) that injects the
// options UI and wires it. Uses core helpers exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const input = document.getElementById('ccInput');
    const output = document.getElementById('ccOutput');
    const inputStats = document.getElementById('ccInputStats');
    const outputStats = document.getElementById('ccOutputStats');
    const copyBtn = document.getElementById('ccCopyBtn');
    const downloadBtn = document.getElementById('ccDownloadBtn');
    const clearBtn = document.getElementById('ccClearBtn');
    const caseButtons = document.querySelectorAll('.cc-case-btn');

    const activeBtnClass = 'cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white border border-blue-600 shadow-md transition';
    const inactiveBtnClass = 'cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition';

    const countStats = (text) => {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;
      return `${words} word${words === 1 ? '' : 's'} · ${characters} character${characters === 1 ? '' : 's'}`;
    };

    const updateInputStats = () => { inputStats.textContent = countStats(input.value); };
    const updateOutputStats = () => { outputStats.textContent = countStats(output.value); };

    const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    const splitWords = (str) => str
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const convertLine = (line, m) => {
      const words = splitWords(line);
      if (!words.length) return '';
      if (m === 'camel') return words.map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w))).join('');
      if (m === 'pascal') return words.map(capitalize).join('');
      if (m === 'snake') return words.map((w) => w.toLowerCase()).join('_');
      if (m === 'kebab') return words.map((w) => w.toLowerCase()).join('-');
      if (m === 'constant') return words.map((w) => w.toUpperCase()).join('_');
      return line;
    };

    const convertText = (text, m) => {
      if (m === 'upper') return text.toUpperCase();
      if (m === 'lower') return text.toLowerCase();
      if (m === 'title') return text.replace(/\S+/g, (word) => capitalize(word));
      if (m === 'sentence') {
        return text.toLowerCase().replace(/(^\s*[a-z]|[.!?]\s+[a-z]|\n\s*[a-z])/g, (match) => match.toUpperCase());
      }
      if (['camel', 'pascal', 'snake', 'kebab', 'constant'].includes(m)) {
        return text.split('\n').map((line) => convertLine(line, m)).join('\n');
      }
      return text;
    };

    let activeCase = null;

    caseButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCase = btn.dataset.case;
        output.value = convertText(input.value, activeCase);
        updateOutputStats();
        caseButtons.forEach((b) => { b.className = (b === btn) ? activeBtnClass : inactiveBtnClass; });
      });
    });

    if (input) input.addEventListener('input', () => {
      updateInputStats();
      if (activeCase) {
        output.value = convertText(input.value, activeCase);
        updateOutputStats();
      }
    });
    if (copyBtn) copyBtn.addEventListener('click', () => {
      if (output.value) {
        navigator.clipboard.writeText(output.value);
        showNotification('Copied output!');
      }
    });
    if (downloadBtn) downloadBtn.addEventListener('click', () => {
      if (!output.value) return;
      const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-text.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    if (clearBtn) clearBtn.addEventListener('click', () => {
      input.value = '';
      output.value = '';
      activeCase = null;
      updateInputStats();
      updateOutputStats();
      caseButtons.forEach((b) => { b.className = inactiveBtnClass; });
    });

    updateInputStats();
    updateOutputStats();
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="grid gap-4 md:grid-cols-2 mb-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Input Text</label>
              <span id="ccInputStats" class="text-[10px] font-semibold text-slate-500 dark:text-slate-400">0 words · 0 characters</span>
            </div>
            <textarea id="ccInput" rows="11" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition" placeholder="Type or paste text here..."></textarea>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Output Text</label>
              <span id="ccOutputStats" class="text-[10px] font-semibold text-slate-500 dark:text-slate-400">0 words · 0 characters</span>
            </div>
            <textarea id="ccOutput" rows="11" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none readonly" readonly placeholder="Converted text will appear here..."></textarea>
          </div>
        </div>
        <label class="${labelClass} block mb-2">Choose a Case Style</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          <button data-case="upper" type="button" class="cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">UPPERCASE</button>
          <button data-case="lower" type="button" class="cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">lowercase</button>
          <button data-case="title" type="button" class="cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Title Case</button>
          <button data-case="sentence" type="button" class="cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Sentence case</button>
          <button data-case="camel" type="button" class="cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">camelCase</button>
          <button data-case="pascal" type="button" class="cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">PascalCase</button>
          <button data-case="snake" type="button" class="cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">snake_case</button>
          <button data-case="kebab" type="button" class="cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">kebab-case</button>
          <button data-case="constant" type="button" class="cc-case-btn px-3 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">CONSTANT_CASE</button>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button id="ccCopyBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy Output</button>
          <button id="ccDownloadBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Download .txt</button>
          <button id="ccClearBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 transition ml-auto">Clear</button>
        </div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('case-converter', { render: render })
    : console.error('WCF.registerTool unavailable for case-converter');
})();
