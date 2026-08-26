// js/tools/hash-generator.js
// Tool module for "hash-generator", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const input = document.getElementById('hashInputText');
    const md5Out = document.getElementById('hashMd5');
    const sha1Out = document.getElementById('hashSha1');
    const sha256Out = document.getElementById('hashSha256');
    const sha512Out = document.getElementById('hashSha512');

    const computeHashes = () => {
      const text = input.value;
      if (!text) {
        md5Out.value = '';
        sha1Out.value = '';
        sha256Out.value = '';
        sha512Out.value = '';
        return;
      }
      md5Out.value = CryptoJS.MD5(text).toString();
      sha1Out.value = CryptoJS.SHA1(text).toString();
      sha256Out.value = CryptoJS.SHA256(text).toString();
      sha512Out.value = CryptoJS.SHA512(text).toString();
    };

    if (input) input.addEventListener('input', computeHashes);

    ['Md5', 'Sha1', 'Sha256', 'Sha512'].forEach(algo => {
      const btn = document.getElementById(`copyHash${algo}`);
      const field = document.getElementById(`hash${algo}`);
      if (btn && field) {
        btn.addEventListener('click', () => {
          if (field.value) {
            navigator.clipboard.writeText(field.value);
            showNotification(`Copied ${algo.toUpperCase()} Hash!`);
          }
        });
      }
    });
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <label class="${labelClass}">Enter Input Text</label>
        <textarea id="hashInputText" rows="4" class="${inputClass} font-mono text-xs mt-2" placeholder="Type or paste text to compute cryptographic hashes..."></textarea>

        <div class="mt-5 space-y-3.5">
          <div class="flex flex-col gap-1.5">
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">MD5 Hash</span>
            <div class="flex gap-2">
              <input id="hashMd5" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/40 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none readonly" readonly placeholder="MD5 output..." />
              <button id="copyHashMd5" type="button" class="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition">Copy</button>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SHA-1 Hash</span>
            <div class="flex gap-2">
              <input id="hashSha1" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/40 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none readonly" readonly placeholder="SHA-1 output..." />
              <button id="copyHashSha1" type="button" class="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition">Copy</button>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SHA-256 Hash</span>
            <div class="flex gap-2">
              <input id="hashSha256" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/40 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none readonly" readonly placeholder="SHA-256 output..." />
              <button id="copyHashSha256" type="button" class="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition">Copy</button>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SHA-512 Hash</span>
            <div class="flex gap-2">
              <input id="hashSha512" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/40 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none readonly" readonly placeholder="SHA-512 output..." />
              <button id="copyHashSha512" type="button" class="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition">Copy</button>
            </div>
          </div>
        </div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('hash-generator', { render: render })
    : console.error('WCF.registerTool unavailable for hash-generator');
})();
