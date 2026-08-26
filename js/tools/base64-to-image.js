// js/tools/base64-to-image.js
// Heavy tool module for "base64-to-image", split out of app.js (Phase 2.5 code-splitting).
// Loaded on demand only when this tool is opened. Registers render(container, ctx),
// convert() (invoked by the core convert dispatcher), and validate().
// Uses core helpers/state (state, setStatus, downloadBlob, readAsDataUrl, updateFileList,
// handleConvert, sanitize helpers) exposed globally by the classic app.js script.
(function () {
  'use strict';
  function wire() {
    const inputText = document.getElementById('b64ImgInputText');
    const formatSelect = document.getElementById('b64ImgFormatSelect');
    const decodeBtn = document.getElementById('b64ImgDecodeBtn');
    const clearBtn = document.getElementById('b64ImgClearBtn');
    const errorBox = document.getElementById('b64ImgErrorBox');
    const previewCard = document.getElementById('b64ImgPreviewCard');
    const previewImg = document.getElementById('b64ImgPreviewElement');
    const metaText = document.getElementById('b64ImgMetaText');
    const downloadBtn = document.getElementById('b64ImgDownloadBtn');

    let currentDecodedBlob = null;
    let currentExt = 'png';

    const runDecode = () => {
      if (errorBox) { errorBox.classList.add('hidden'); errorBox.textContent = ''; }
      if (previewCard) previewCard.classList.add('hidden');

      let raw = inputText.value.trim();
      if (!raw) return;

      let mime = 'image/png';
      let ext = 'png';
      let dataUri = '';

      const uriMatch = raw.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,(.+)$/s);
      if (uriMatch) {
        mime = uriMatch[1];
        const rawB64 = uriMatch[2].replace(/\s/g, '');
        dataUri = `data:${mime};base64,${rawB64}`;
      } else {
        const cleanB64 = raw.replace(/^data:image\/[a-zA-Z0-9\+\-\.]+;base64,/, '').replace(/\s/g, '');
        const selectedFormat = formatSelect.value;
        if (selectedFormat !== 'auto') {
          mime = selectedFormat;
        } else {
          if (cleanB64.startsWith('/9j/')) mime = 'image/jpeg';
          else if (cleanB64.startsWith('iVBORw0KGgo')) mime = 'image/png';
          else if (cleanB64.startsWith('UklGR')) mime = 'image/webp';
          else if (cleanB64.startsWith('R0lGOD')) mime = 'image/gif';
          else mime = 'image/png';
        }
        dataUri = `data:${mime};base64,${cleanB64}`;
      }

      if (mime === 'image/jpeg') ext = 'jpg';
      else if (mime === 'image/webp') ext = 'webp';
      else if (mime === 'image/gif') ext = 'gif';
      else ext = 'png';

      currentExt = ext;

      const img = new Image();
      img.onload = () => {
        if (previewImg) previewImg.src = dataUri;
        if (metaText) metaText.textContent = `Format: ${ext.toUpperCase()} • Dimensions: ${img.naturalWidth} × ${img.naturalHeight} px`;
        if (previewCard) previewCard.classList.remove('hidden');

        try {
          const byteString = atob(dataUri.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          currentDecodedBlob = new Blob([ab], { type: mime });
        } catch (err) {
          currentDecodedBlob = null;
        }
      };

      img.onerror = () => {
        if (errorBox) {
          errorBox.textContent = 'Invalid Base64 image data. Unable to parse image pixels from the provided string.';
          errorBox.classList.remove('hidden');
        }
      };

      img.src = dataUri;
    };

    if (inputText) {
      inputText.addEventListener('input', () => {
        updateFileList();
        runDecode();
      });
    }

    if (state.files && state.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        inputText.value = e.target.result;
        updateFileList();
        runDecode();
      };
      reader.readAsText(state.files[0]);
    }

    if (decodeBtn) decodeBtn.addEventListener('click', handleConvert);
    if (formatSelect) formatSelect.addEventListener('change', () => { if (inputText.value.trim()) runDecode(); });

    if (downloadBtn) {
      downloadBtn.addEventListener('click', handleConvert);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        inputText.value = '';
        if (errorBox) errorBox.classList.add('hidden');
        if (previewCard) previewCard.classList.add('hidden');
        currentDecodedBlob = null;
        clearSelectedFiles();
      });
    }
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="mb-4">
          <label class="${labelClass}">Format Selection</label>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <select id="b64ImgFormatSelect" class="flex-1 min-w-[220px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition h-[38px]">
              <option value="auto" selected>Auto-Detect Format (Header/Signature)</option>
              <option value="image/png">PNG Image (.png)</option>
              <option value="image/jpeg">JPEG Image (.jpg)</option>
              <option value="image/webp">WebP Image (.webp)</option>
              <option value="image/gif">GIF Image (.gif)</option>
            </select>
            <button id="b64ImgDecodeBtn" type="button" class="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm h-[38px] flex items-center justify-center">Decode Base64</button>
            <button id="b64ImgClearBtn" type="button" class="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 transition h-[38px] flex items-center justify-center">Clear</button>
          </div>
        </div>

        <div class="mb-4">
          <label class="${labelClass}">Paste Raw Base64 or Data URI String</label>
          <textarea id="b64ImgInputText" rows="6" class="${inputClass} mt-2 font-mono text-xs" placeholder="Paste data:image/png;base64,... or raw Base64 string here..."></textarea>
        </div>

        <div id="b64ImgErrorBox" class="hidden mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs font-bold text-rose-700 dark:text-rose-300"></div>

        <div id="b64ImgPreviewCard" class="hidden border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/30 text-center">
          <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Decoded Image Preview</h4>
          <div class="mx-auto max-w-sm max-h-64 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 shadow-sm flex items-center justify-center">
            <img id="b64ImgPreviewElement" class="max-h-60 w-auto object-contain rounded-lg" alt="Decoded Base64 Preview" />
          </div>
          <p id="b64ImgMetaText" class="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-400"></p>
          <button id="b64ImgDownloadBtn" type="button" class="mt-4 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md">Download Decoded Image</button>
        </div>
      </div>
    `;
    wire();
  }

  async function convert() {
  let raw = document.getElementById('b64ImgInputText')?.value?.trim() || '';
  if (!raw && state.files.length > 0) {
    setStatus('Reading uploaded file containing Base64 data...');
    raw = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(state.files[0]);
    });
  }
  if (!raw) throw new Error('Please enter a Base64 string or upload a file containing Base64 data.');

  setStatus('Decoding Base64 data...');
  let mime = 'image/png';
  let ext = 'png';
  let dataUri = '';

  const uriMatch = raw.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,(.+)$/s);
  if (uriMatch) {
    mime = uriMatch[1];
    const rawB64 = uriMatch[2].replace(/\s/g, '');
    dataUri = `data:${mime};base64,${rawB64}`;
  } else {
    const cleanB64 = raw.replace(/^data:image\/[a-zA-Z0-9\+\-\.]+;base64,/, '').replace(/\s/g, '');
    const selectedFormat = document.getElementById('b64ImgFormatSelect')?.value || 'auto';
    if (selectedFormat !== 'auto') {
      mime = selectedFormat;
    } else {
      if (cleanB64.startsWith('/9j/')) mime = 'image/jpeg';
      else if (cleanB64.startsWith('iVBORw0KGgo')) mime = 'image/png';
      else if (cleanB64.startsWith('UklGR')) mime = 'image/webp';
      else if (cleanB64.startsWith('R0lGOD')) mime = 'image/gif';
      else mime = 'image/png';
    }
    dataUri = `data:${mime};base64,${cleanB64}`;
  }

  if (mime === 'image/jpeg') ext = 'jpg';
  else if (mime === 'image/webp') ext = 'webp';
  else if (mime === 'image/gif') ext = 'gif';
  else ext = 'png';

  const byteString = atob(dataUri.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mime });
  downloadBlob(blob, `decoded-image.${ext}`);
  }

  function validate() {
    return state.files.length > 0 || !!document.getElementById('b64ImgInputText')?.value?.trim();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('base64-to-image', { render: render, convert: convert, validate: validate })
    : console.error('WCF.registerTool unavailable for base64-to-image');
})();
