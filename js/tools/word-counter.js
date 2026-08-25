// js/tools/word-counter.js
// Tool module for "word-counter", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const textarea = document.getElementById('wordCounterTextArea');
    if (textarea) {
      const updateStats = () => {
        const text = textarea.value;
        const charCount = text.length;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
        const readingTime = Math.ceil(wordCount / 200);

        document.getElementById('charCountLabel').textContent = charCount;
        document.getElementById('wordCountLabel').textContent = wordCount;
        document.getElementById('paraCountLabel').textContent = paragraphs;
        document.getElementById('readTimeLabel').textContent = `${readingTime}m`;
      };
      textarea.addEventListener('input', updateStats);
      updateStats();
    }
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <label class="${labelClass}">Enter or Paste Text</label>
        <textarea id="wordCounterTextArea" rows="8" class="${inputClass} mt-2" placeholder="Start typing here..."></textarea>
        <div class="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/50 p-4 text-center">
            <span id="charCountLabel" class="block text-2xl font-bold text-slate-800 dark:text-slate-100">0</span>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Characters</span>
          </div>
          <div class="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/50 p-4 text-center">
            <span id="wordCountLabel" class="block text-2xl font-bold text-slate-800 dark:text-slate-100">0</span>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Words</span>
          </div>
          <div class="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/50 p-4 text-center">
            <span id="paraCountLabel" class="block text-2xl font-bold text-slate-800 dark:text-slate-100">0</span>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paragraphs</span>
          </div>
          <div class="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/50 p-4 text-center">
            <span id="readTimeLabel" class="block text-2xl font-bold text-slate-800 dark:text-slate-100">0m</span>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reading Time</span>
          </div>
        </div>
        <p class="${helpClass} mt-2">Stats are computed live with local javascript. Perfect for bloggers, authors, and student reports.</p>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('word-counter', { render: render })
    : console.error('WCF.registerTool unavailable for word-counter');
})();
