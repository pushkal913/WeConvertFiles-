// js/tools/qr-generator.js
// Tool module for "qr-generator", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const textInput = document.getElementById('qrTextInput');
    const canvas = document.getElementById('qrCanvas');
    const downloadBtn = document.getElementById('qrDownloadBtn');
    const sizeSelect = document.getElementById('qrSizeSelect');

    const generateQr = () => {
      const val = textInput.value.trim();
      if (!val) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        downloadBtn.classList.add('hidden');
        return;
      }
      const size = parseInt(sizeSelect.value, 10) || 200;
      canvas.width = size;
      canvas.height = size;

      new QRious({
        element: canvas,
        value: val,
        size: size,
        level: 'H'
      });
      downloadBtn.classList.remove('hidden');
    };

    if (textInput) textInput.addEventListener('input', generateQr);
    if (sizeSelect) sizeSelect.addEventListener('change', generateQr);

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
    generateQr();
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="md:col-span-2">
            <label class="${labelClass}">Text or Link URL</label>
            <input id="qrTextInput" class="${inputClass}" placeholder="https://www.weconvertfiles.com/" value="https://www.weconvertfiles.com/" />
          </div>
          <div>
            <label class="${labelClass}">QR Code Size</label>
            <select id="qrSizeSelect" class="${inputClass}">
              <option value="150">150 x 150 px</option>
              <option value="200" selected>200 x 200 px</option>
              <option value="250">250 x 250 px</option>
              <option value="300">300 x 300 px</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex flex-col items-center border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/30">
          <canvas id="qrCanvas" class="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/50"></canvas>
          <button id="qrDownloadBtn" type="button" class="mt-4 px-6 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md">Download QR Code (PNG)</button>
        </div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('qr-generator', { render: render })
    : console.error('WCF.registerTool unavailable for qr-generator');
})();
