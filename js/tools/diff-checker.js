// js/tools/diff-checker.js
// Tool module for "diff-checker", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const orig = document.getElementById('diffOriginalText');
    const mod = document.getElementById('diffModifiedText');
    const container = document.getElementById('diffOutputContainer');
    const wrapper = document.getElementById('diffResultWrapper');
    const stats = document.getElementById('diffStatsBar');

    if (orig && mod && container && wrapper && stats) {
      const runDiff = () => {
        const originalText = orig.value;
        const modifiedText = mod.value;
        if (!originalText && !modifiedText) {
          wrapper.classList.add('hidden');
          return;
        }

        const lines1 = originalText.split(/\r?\n/);
        const lines2 = modifiedText.split(/\r?\n/);
        const n = lines1.length;
        const m = lines2.length;

        if (n > 800 || m > 800) {
          const dmp = new diff_match_patch();
          const diffs = dmp.diff_main(originalText, modifiedText);
          dmp.diff_cleanupSemantic(diffs);

          let charAdditions = 0;
          let charRemovals = 0;
          diffs.forEach(part => {
            if (part[0] === 1) charAdditions += part[1].length;
            else if (part[0] === -1) charRemovals += part[1].length;
          });

          stats.innerHTML = `
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Large Document Mode (Character-level Diff)</span>
              <div class="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                <span class="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>${charRemovals} characters removed</span>
                </span>
                <span class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>${charAdditions} characters added</span>
                </span>
              </div>
            </div>
          `;

          let html = '<div class="p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed">';
          diffs.forEach(part => {
            const type = part[0];
            const text = part[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            if (type === 1) {
              html += `<ins class="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold px-0.5 rounded">${text}</ins>`;
            } else if (type === -1) {
              html += `<del class="bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 line-through px-0.5 rounded">${text}</del>`;
            } else {
              html += `<span>${text}</span>`;
            }
          });
          html += '</div>';
          container.innerHTML = html;
          wrapper.classList.remove('hidden');
          return;
        }

        const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
        for (let i = 1; i <= n; i++) {
          for (let j = 1; j <= m; j++) {
            if (lines1[i - 1] === lines2[j - 1]) {
              dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
              dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
          }
        }

        const diffs = [];
        let i = n, j = m;
        while (i > 0 || j > 0) {
          if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
            diffs.unshift({ type: 'unchanged', val: lines1[i - 1], line1: i, line2: j });
            i--;
            j--;
          } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diffs.unshift({ type: 'added', val: lines2[j - 1], line1: null, line2: j });
            j--;
          } else {
            diffs.unshift({ type: 'removed', val: lines1[i - 1], line1: i, line2: null });
            i--;
          }
        }

        let additions = 0;
        let removals = 0;
        diffs.forEach(d => {
          if (d.type === 'added') additions++;
          else if (d.type === 'removed') removals++;
        });

        let statsHtml = '';
        if (additions === 0 && removals === 0) {
          statsHtml = `
            <div class="flex items-center gap-2.5 rounded-xl border border-blue-100 dark:border-blue-950/60 bg-blue-50/50 dark:bg-blue-950/20 p-3 text-xs text-blue-800 dark:text-blue-300">
              <svg class="h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-bold">The two texts are identical</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">There is no difference to show between these two texts.</p>
              </div>
            </div>
          `;
        } else {
          statsHtml = `
            <div class="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span class="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>${removals} lines removed</span>
              </span>
              <span class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>${additions} lines added</span>
              </span>
            </div>
          `;
        }
        stats.innerHTML = statsHtml;

        let html = '<div class="min-w-max">';
        diffs.forEach(d => {
          const line1Val = d.line1 !== null ? d.line1 : '';
          const line2Val = d.line2 !== null ? d.line2 : '';
          const escapedVal = d.val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

          let rowBg = '';
          let num1Bg = '';
          let num2Bg = '';
          let textClass = 'text-slate-600 dark:text-slate-400';
          let sign = ' ';

          if (d.type === 'added') {
            rowBg = 'bg-emerald-50/40 dark:bg-emerald-950/20';
            num2Bg = 'bg-emerald-100/40 dark:bg-emerald-950/40';
            textClass = 'text-emerald-800 dark:text-emerald-300 font-semibold';
            sign = '+';
          } else if (d.type === 'removed') {
            rowBg = 'bg-red-50/40 dark:bg-red-950/20';
            num1Bg = 'bg-red-100/40 dark:bg-red-950/40';
            textClass = 'text-red-800 dark:text-red-300 font-semibold';
            sign = '-';
          }

          html += `
            <div class="flex font-mono text-[11px] leading-5 hover:bg-slate-100/30 dark:hover:bg-slate-800/20 transition border-b border-slate-200/40 dark:border-slate-700/60">
              <div class="w-8 shrink-0 text-right pr-2 text-slate-400 select-none border-r border-slate-200 dark:border-slate-700/60 ${num1Bg}">${line1Val}</div>
              <div class="w-8 shrink-0 text-right pr-2 text-slate-400 select-none border-r border-slate-200 dark:border-slate-700/60 ${num2Bg}">${line2Val}</div>
              <div class="w-5 shrink-0 text-center select-none font-bold ${textClass}">${sign}</div>
              <div class="pl-2 pr-4 whitespace-pre ${rowBg} ${textClass}">${escapedVal || ' '}</div>
            </div>
          `;
        });
        html += '</div>';

        container.innerHTML = html;
        wrapper.classList.remove('hidden');
      };
      orig.addEventListener('input', runDiff);
      mod.addEventListener('input', runDiff);
    }
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="${labelClass}">Original Text</label>
            <textarea id="diffOriginalText" rows="6" class="${inputClass} mt-2 font-mono text-xs" placeholder="Paste original file content..."></textarea>
          </div>
          <div>
            <label class="${labelClass}">Modified Text</label>
            <textarea id="diffModifiedText" rows="6" class="${inputClass} mt-2 font-mono text-xs" placeholder="Paste modified version content..."></textarea>
          </div>
        </div>
        <div id="diffResultWrapper" class="mt-5 hidden">
          <div id="diffStatsBar" class="mb-3"></div>
          <div id="diffOutputContainer" class="w-full max-w-full rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-950/40 overflow-auto max-h-[400px]">
          </div>
        </div>
        <p class="${helpClass} mt-2">Highlights added lines in green and deleted lines in red. Runs line-by-line comparison.</p>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('diff-checker', { render: render })
    : console.error('WCF.registerTool unavailable for diff-checker');
})();
