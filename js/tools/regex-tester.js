// js/tools/regex-tester.js
// Tool module for "regex-tester", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const pattern = document.getElementById('regexPatternInput');
    const textInput = document.getElementById('regexTestInput');
    const output = document.getElementById('regexHighlightOutput');
    const info = document.getElementById('regexInfoBox');

    const resizeRegexWorkspace = () => {
      textInput.style.height = 'auto';
      const nextHeight = Math.min(420, Math.max(130, textInput.scrollHeight));
      textInput.style.height = `${nextHeight}px`;
      output.style.height = `${nextHeight}px`;
    };

    const runRegex = () => {
      const patVal = pattern.value;
      const textVal = textInput.value;
      resizeRegexWorkspace();

      if (!patVal || !textVal) {
        output.innerHTML = '';
        info.className = 'hidden';
        return;
      }

      const g = document.getElementById('regexFlagG').checked ? 'g' : '';
      const i = document.getElementById('regexFlagI').checked ? 'i' : '';
      const m = document.getElementById('regexFlagM').checked ? 'm' : '';
      const s = document.getElementById('regexFlagS').checked ? 's' : '';
      const flags = g + i + m + s;

      try {
        const regex = new RegExp(patVal, flags);
        let matchesCount = 0;
        let highlighted = '';

        if (flags.includes('g')) {
          let match;
          let lastIndex = 0;
          while ((match = regex.exec(textVal)) !== null) {
            if (match.index === regex.lastIndex) {
              regex.lastIndex++; // Prevent infinite loop for zero-width matches
            }
            highlighted += textVal.substring(lastIndex, match.index);
            highlighted += `<mark class="bg-yellow-200 dark:bg-yellow-800/60 text-slate-900 dark:text-white px-0.5 rounded border border-yellow-300/40">${match[0]}</mark>`;
            lastIndex = regex.lastIndex;
            matchesCount++;
          }
          highlighted += textVal.substring(lastIndex);
        } else {
          const match = regex.exec(textVal);
          if (match) {
            highlighted += textVal.substring(0, match.index);
            highlighted += `<mark class="bg-yellow-200 dark:bg-yellow-800/60 text-slate-900 dark:text-white px-0.5 rounded border border-yellow-300/40">${match[0]}</mark>`;
            highlighted += textVal.substring(match.index + match[0].length);
            matchesCount = 1;
          } else {
            highlighted = textVal;
          }
        }

        output.innerHTML = highlighted;
        info.className = 'mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold';
        info.textContent = `Found ${matchesCount} match(es) successfully!`;
      } catch (err) {
        output.innerHTML = textVal;
        info.className = 'mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold';
        info.textContent = `Regex error: ${err.message}`;
      }
    };

    pattern.addEventListener('input', runRegex);
    textInput.addEventListener('input', runRegex);
    document.getElementById('regexFlagG').addEventListener('change', runRegex);
    document.getElementById('regexFlagI').addEventListener('change', runRegex);
    document.getElementById('regexFlagM').addEventListener('change', runRegex);
    document.getElementById('regexFlagS').addEventListener('change', runRegex);
    runRegex();
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="grid gap-4 md:grid-cols-3 mb-4">
          <div class="md:col-span-2">
            <label class="${labelClass}">Regular Expression</label>
            <input id="regexPatternInput" class="${inputClass}" placeholder="([A-Z][a-z]+)" value="([A-Z][a-z]+)" />
          </div>
          <div>
            <label class="${labelClass}">Flags</label>
            <div class="mt-2 flex flex-wrap gap-2">
              <label class="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input type="checkbox" id="regexFlagG" checked class="rounded border-slate-300 text-[#1a73e8]" /> g
              </label>
              <label class="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input type="checkbox" id="regexFlagI" class="rounded border-slate-300 text-[#1a73e8]" /> i
              </label>
              <label class="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input type="checkbox" id="regexFlagM" class="rounded border-slate-300 text-[#1a73e8]" /> m
              </label>
              <label class="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input type="checkbox" id="regexFlagS" class="rounded border-slate-300 text-[#1a73e8]" /> s
              </label>
            </div>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="${labelClass}">Test String</label>
            <textarea id="regexTestInput" rows="6" class="${inputClass} mt-2" placeholder="Enter text to match patterns against..."></textarea>
          </div>
          <div>
            <label class="${labelClass}">Matches Highlight Preview</label>
            <div id="regexHighlightOutput" class="mt-2 w-full h-[130px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap"></div>
          </div>
        </div>
        <div id="regexInfoBox" class="mt-3 p-3 rounded-xl text-xs font-bold hidden"></div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('regex-tester', { render: render })
    : console.error('WCF.registerTool unavailable for regex-tester');
})();
