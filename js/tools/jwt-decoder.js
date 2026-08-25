// js/tools/jwt-decoder.js
// Tool module for "jwt-decoder", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const input = document.getElementById('jwtInputToken');
    const outHeader = document.getElementById('jwtOutputHeader');
    const outPayload = document.getElementById('jwtOutputPayload');
    const info = document.getElementById('jwtInfoBox');

    const resizeJwtOutputs = (hasToken) => {
      if (!hasToken) {
        outHeader.style.height = '180px';
        outPayload.style.height = '180px';
        return;
      }
      outHeader.style.height = 'auto';
      outPayload.style.height = 'auto';
      outHeader.style.height = `${Math.min(420, Math.max(260, outHeader.scrollHeight))}px`;
      outPayload.style.height = `${Math.min(420, Math.max(260, outPayload.scrollHeight))}px`;
    };

    const runJwtDecode = () => {
      const raw = input.value.trim();
      if (!raw) {
        outHeader.textContent = ''; outPayload.textContent = ''; info.className = 'hidden';
        resizeJwtOutputs(false);
        return;
      }
      const parts = raw.split('.');
      if (parts.length < 2) {
        outHeader.textContent = 'Invalid Token format. Must be divided by dots.';
        outPayload.textContent = '';
        resizeJwtOutputs(true);
        info.className = 'hidden';
        return;
      }

      const base64UrlDecode = (str) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        return decodeURIComponent(escape(window.atob(base64)));
      };

      try {
        const headerObj = JSON.parse(base64UrlDecode(parts[0]));
        const payloadObj = JSON.parse(base64UrlDecode(parts[1]));

        outHeader.textContent = JSON.stringify(headerObj, null, 2);
        outPayload.textContent = JSON.stringify(payloadObj, null, 2);
        resizeJwtOutputs(true);

        // Check Expiry
        if (payloadObj.exp) {
          const expMs = payloadObj.exp * 1000;
          const date = new Date(expMs);
          const expired = expMs < Date.now();
          if (expired) {
            info.className = 'mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold';
            info.textContent = `Token EXPIRED on ${date.toString()}`;
          } else {
            info.className = 'mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold';
            info.textContent = `Token active! Expires on ${date.toString()}`;
          }
        } else {
          info.className = 'mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold';
          info.textContent = 'Token parsed successfully (No exp claim found).';
        }
      } catch (err) {
        outHeader.textContent = 'Failed to decode header.';
        outPayload.textContent = `Error: ${err.message}`;
        resizeJwtOutputs(true);
        info.className = 'hidden';
      }
    };

    input.addEventListener('input', runJwtDecode);
    runJwtDecode();
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <label class="${labelClass}">Paste JWT Token</label>
        <textarea id="jwtInputToken" rows="3" class="${inputClass} font-mono text-xs mt-2" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ..."></textarea>

        <div class="grid gap-4 md:grid-cols-2 mt-5">
          <div>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Header (JSON)</span>
            <pre id="jwtOutputHeader" class="w-full h-[180px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200"></pre>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Payload (JSON)</span>
            <pre id="jwtOutputPayload" class="w-full h-[180px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200"></pre>
          </div>
        </div>
        <div id="jwtInfoBox" class="mt-3 p-3 rounded-xl text-xs font-bold hidden"></div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('jwt-decoder', { render: render })
    : console.error('WCF.registerTool unavailable for jwt-decoder');
})();
