// js/tools/image-to-base64.js
// Heavy tool module for "image-to-base64", split out of app.js (Phase 2.5 code-splitting).
// Loaded on demand only when this tool is opened. Registers render(container, ctx),
// convert() (invoked by the core convert dispatcher).
// Uses core helpers/state (state, setStatus, downloadBlob, readAsDataUrl, updateFileList,
// handleConvert, sanitize helpers) exposed globally by the classic app.js script.
(function () {
  'use strict';
  // Set by wire(); invoked when files are added after render (drag-and-drop).
  let refresh = null;
  function wire() {
    const rawOut = document.getElementById('imgB64RawOutput');
    const uriOut = document.getElementById('imgB64UriOutput');
    const infoCard = document.getElementById('imgB64InfoCard');
    const thumb = document.getElementById('imgB64Thumb');
    const fileName = document.getElementById('imgB64FileName');
    const meta = document.getElementById('imgB64Meta');

    const copyRawBtn = document.getElementById('imgB64CopyRawBtn');
    const copyUriBtn = document.getElementById('imgB64CopyUriBtn');
    const downloadTxtBtn = document.getElementById('imgB64DownloadTxtBtn');
    const clearBtn = document.getElementById('imgB64ClearBtn');

    const processFile = (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target.result;
        const rawB64 = dataUri.split(',')[1] || '';

        if (uriOut) uriOut.value = dataUri;
        if (rawOut) rawOut.value = rawB64;

        if (thumb) thumb.style.backgroundImage = `url("${dataUri}")`;
        if (fileName) fileName.textContent = file.name;
        if (meta) meta.textContent = `${file.type || 'image'} • ${(file.size / 1024).toFixed(1)} KB`;
        if (infoCard) infoCard.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    };

    refresh = () => { if (state.files && state.files[0]) processFile(state.files[0]); };
    if (state.files && state.files[0]) {
      processFile(state.files[0]);
    }

    if (copyRawBtn) {
      copyRawBtn.addEventListener('click', () => {
        if (rawOut && rawOut.value) {
          navigator.clipboard.writeText(rawOut.value);
          showNotification('Copied raw Base64 string!');
        }
      });
    }

    if (copyUriBtn) {
      copyUriBtn.addEventListener('click', () => {
        if (uriOut && uriOut.value) {
          navigator.clipboard.writeText(uriOut.value);
          showNotification('Copied Data URI string!');
        }
      });
    }

    if (downloadTxtBtn) {
      downloadTxtBtn.addEventListener('click', () => {
        if (uriOut && uriOut.value) {
          const baseName = (state.files[0]?.name || 'image').replace(/\.[^/.]+$/, '');
          downloadBlob(new Blob([uriOut.value], { type: 'text/plain;charset=utf-8' }), `${baseName}-base64.txt`);
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (rawOut) rawOut.value = '';
        if (uriOut) uriOut.value = '';
        if (infoCard) infoCard.classList.add('hidden');
        clearSelectedFiles();
      });
    }
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div id="imgB64InfoCard" class="hidden mb-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div id="imgB64Thumb" class="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800 bg-cover bg-center border border-slate-300 dark:border-slate-700 shrink-0"></div>
            <div>
              <h4 id="imgB64FileName" class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs"></h4>
              <p id="imgB64Meta" class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5"></p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button id="imgB64DownloadTxtBtn" type="button" class="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm">Download TXT</button>
            <button id="imgB64CopyUriBtn" type="button" class="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy Data URI</button>
            <button id="imgB64CopyRawBtn" type="button" class="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy Raw Base64</button>
            <button id="imgB64ClearBtn" type="button" class="px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 transition">Clear</button>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="${labelClass}">Raw Base64 Output</label>
            <textarea id="imgB64RawOutput" rows="7" class="${inputClass} mt-2 font-mono text-xs readonly" readonly placeholder="Select an image file above to view raw Base64 string..."></textarea>
          </div>
          <div>
            <label class="${labelClass}">Complete Data URI Output</label>
            <textarea id="imgB64UriOutput" rows="7" class="${inputClass} mt-2 font-mono text-xs readonly" readonly placeholder="Select an image file above to view data:image/png;base64,... URI..."></textarea>
          </div>
        </div>
      </div>
    `;
    wire();
  }

  async function convert() {
  if (!state.files.length) throw new Error('Please select an image file first.');
  setStatus('Encoding image file to Base64...');
  const file = state.files[0];
  const dataUri = await readAsDataUrl(file);
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const blob = new Blob([dataUri], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `${baseName}-base64.txt`);
  }

  function onFilesChanged() { if (refresh) refresh(); }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('image-to-base64', { render: render, convert: convert, onFilesChanged: onFilesChanged })
    : console.error('WCF.registerTool unavailable for image-to-base64');
})();
