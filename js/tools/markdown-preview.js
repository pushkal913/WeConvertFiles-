// js/tools/markdown-preview.js
// Tool module for "markdown-preview", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const input = document.getElementById('markdownInputArea');
    const preview = document.getElementById('markdownPreviewArea');
    const wrapper = document.getElementById('markdownGridWrapper');
    if (input && preview && wrapper) {
      const resizePreview = (hasContent) => {
        if (!hasContent) {
          wrapper.classList.remove('grid-cols-1');
          wrapper.classList.add('md:grid-cols-2');
          preview.style.height = '215px';
          preview.style.minHeight = '215px';
          return;
        }

        wrapper.classList.remove('md:grid-cols-2');
        wrapper.classList.add('grid-cols-1');
        preview.style.height = 'auto';
        preview.style.minHeight = '420px';

        requestAnimationFrame(() => {
          if (!input.value.trim()) return;
          const previewHeight = Math.min(Math.max(preview.scrollHeight, 420), 720);
          preview.style.height = `${previewHeight}px`;
        });
      };

      const updatePreview = () => {
        const markdown = input.value.trim();
        preview.innerHTML = marked.parse(markdown || '<p class="text-slate-400">Markdown preview will show up here...</p>');
        resizePreview(Boolean(markdown));
      };
      input.addEventListener('input', updatePreview);
      updatePreview();
    }
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div id="markdownGridWrapper" class="grid gap-4 md:grid-cols-2 transition-all duration-300">
          <div id="markdownInputCol">
            <label class="${labelClass}">Markdown Input</label>
            <textarea id="markdownInputArea" rows="10" class="${inputClass} mt-2 font-mono text-xs" placeholder="# Header 1&#10;Write **bold** text or list items:&#10;- Bullet A&#10;- Bullet B"></textarea>
          </div>
          <div id="markdownPreviewCol">
            <label class="${labelClass}">HTML Live Preview</label>
            <div id="markdownPreviewArea" class="mt-2 w-full h-[215px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 prose prose-slate dark:prose-invert transition-all duration-300" aria-live="polite">
            </div>
          </div>
        </div>
        <p class="${helpClass} mt-2">Converts standard Markdown formatting to styled HTML preview using marked.js.</p>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('markdown-preview', { render: render })
    : console.error('WCF.registerTool unavailable for markdown-preview');
})();
