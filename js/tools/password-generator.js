// js/tools/password-generator.js
// Tool module for "password-generator", split out of app.js (Phase 2 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened, so other
// pages never download it. Registers a render(container, ctx) that injects the
// options UI and wires it. Uses core helpers exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const modePasswordBtn = document.getElementById('pgModePassword');
    const modeHexBtn = document.getElementById('pgModeHex');
    const modeBase64Btn = document.getElementById('pgModeBase64');
    const lengthWrapper = document.getElementById('pgLengthWrapper');
    const lengthRange = document.getElementById('pgLengthRange');
    const lengthValue = document.getElementById('pgLengthValue');
    const tokenBytesWrapper = document.getElementById('pgTokenBytesWrapper');
    const tokenBytesSelect = document.getElementById('pgTokenBytesSelect');
    const countSelect = document.getElementById('pgCountSelect');
    const charsetOptions = document.getElementById('pgCharsetOptions');
    const upperCheck = document.getElementById('pgUpper');
    const lowerCheck = document.getElementById('pgLower');
    const numbersCheck = document.getElementById('pgNumbers');
    const symbolsCheck = document.getElementById('pgSymbols');
    const excludeAmbiguousCheck = document.getElementById('pgExcludeAmbiguous');
    const entropyValue = document.getElementById('pgEntropyValue');
    const generateBtn = document.getElementById('pgGenerateBtn');
    const regenerateBtn = document.getElementById('pgRegenerateBtn');
    const copyAllBtn = document.getElementById('pgCopyAllBtn');
    const clearBtn = document.getElementById('pgClearBtn');
    const resultsList = document.getElementById('pgResultsList');
    const info = document.getElementById('pgInfoBox');

    const AMBIGUOUS_CHARS = 'Il1O0';
    const UPPER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWER_CHARS = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBER_CHARS = '0123456789';
    const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const toggleBaseClass = 'px-3.5 py-1.5 text-xs font-bold rounded-lg transition';
    const toggleActiveClass = 'bg-blue-600 text-white shadow';
    const toggleInactiveClass = 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';

    let mode = 'password';
    let lastResults = [];

    const escapeAttr = (value) => value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const setMode = (m) => {
      mode = m;
      modePasswordBtn.className = `${toggleBaseClass} ${mode === 'password' ? toggleActiveClass : toggleInactiveClass}`;
      modeHexBtn.className = `${toggleBaseClass} ${mode === 'hex' ? toggleActiveClass : toggleInactiveClass}`;
      modeBase64Btn.className = `${toggleBaseClass} ${mode === 'base64' ? toggleActiveClass : toggleInactiveClass}`;
      const isPassword = mode === 'password';
      lengthWrapper.classList.toggle('hidden', !isPassword);
      charsetOptions.classList.toggle('hidden', !isPassword);
      tokenBytesWrapper.classList.toggle('hidden', isPassword);
      updateEntropy();
    };

    const secureRandomInt = (maxExclusive) => {
      if (maxExclusive <= 0) return 0;
      const array = new Uint32Array(1);
      const limit = Math.floor(0xFFFFFFFF / maxExclusive) * maxExclusive;
      let x;
      do {
        crypto.getRandomValues(array);
        x = array[0];
      } while (x >= limit);
      return x % maxExclusive;
    };

    const buildCharsetGroups = () => {
      const groups = [];
      if (upperCheck.checked) groups.push(UPPER_CHARS);
      if (lowerCheck.checked) groups.push(LOWER_CHARS);
      if (numbersCheck.checked) groups.push(NUMBER_CHARS);
      if (symbolsCheck.checked) groups.push(SYMBOL_CHARS);
      if (!excludeAmbiguousCheck.checked) return groups;
      return groups
        .map((group) => group.split('').filter((ch) => !AMBIGUOUS_CHARS.includes(ch)).join(''))
        .filter((group) => group.length > 0);
    };

    const buildCharset = () => buildCharsetGroups().join('');

    const generatePassword = (length, groups) => {
      const fullCharset = groups.join('');
      const chars = [];
      // Guarantee at least one character from each selected class.
      groups.forEach((group) => {
        if (chars.length < length) chars.push(group[secureRandomInt(group.length)]);
      });
      while (chars.length < length) {
        chars.push(fullCharset[secureRandomInt(fullCharset.length)]);
      }
      // Fisher-Yates shuffle using the same CSPRNG so guaranteed characters aren't predictably placed.
      for (let i = chars.length - 1; i > 0; i--) {
        const j = secureRandomInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      return chars.join('');
    };

    const generateRandomBytes = (count) => {
      const bytes = new Uint8Array(count);
      crypto.getRandomValues(bytes);
      return bytes;
    };

    const bytesToHex = (bytes) => Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

    const bytesToBase64Url = (bytes) => {
      let binary = '';
      bytes.forEach((b) => { binary += String.fromCharCode(b); });
      return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    const updateEntropy = () => {
      let bits = 0;
      if (mode === 'password') {
        const charset = buildCharset();
        const length = parseInt(lengthRange.value, 10) || 0;
        bits = charset.length > 0 ? length * Math.log2(charset.length) : 0;
      } else {
        const tokenBytes = parseInt(tokenBytesSelect.value, 10) || 0;
        bits = tokenBytes * 8;
      }
      entropyValue.textContent = `${Math.round(bits)} bits`;
    };

    const showError = (message) => {
      info.className = 'mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold whitespace-pre-wrap';
      info.textContent = message;
    };
    const clearInfo = () => { info.className = 'hidden'; };

    const renderResults = (values) => {
      resultsList.innerHTML = values.map((value, index) => `
        <div class="flex items-center gap-2">
          <input readonly data-index="${index}" class="pg-result-input flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none" value="${escapeAttr(value)}" />
          <button type="button" data-index="${index}" class="pg-copy-btn shrink-0 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy</button>
        </div>
      `).join('');

      resultsList.querySelectorAll('.pg-copy-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(values[Number(btn.dataset.index)]);
          showNotification('Copied!');
        });
      });
    };

    const runGenerate = () => {
      const count = parseInt(countSelect.value, 10) || 1;
      const results = [];

      if (mode === 'password') {
        const groups = buildCharsetGroups();
        if (!groups.length) {
          showError('Select at least one character type (uppercase, lowercase, numbers, or symbols).');
          resultsList.innerHTML = '';
          return;
        }
        const length = parseInt(lengthRange.value, 10) || 16;
        for (let i = 0; i < count; i++) {
          results.push(generatePassword(length, groups));
        }
      } else {
        const tokenBytes = parseInt(tokenBytesSelect.value, 10) || 32;
        for (let i = 0; i < count; i++) {
          const bytes = generateRandomBytes(tokenBytes);
          results.push(mode === 'hex' ? bytesToHex(bytes) : bytesToBase64Url(bytes));
        }
      }

      lastResults = results;
      renderResults(results);
      clearInfo();
      updateEntropy();
    };

    if (modePasswordBtn) modePasswordBtn.addEventListener('click', () => setMode('password'));
    if (modeHexBtn) modeHexBtn.addEventListener('click', () => setMode('hex'));
    if (modeBase64Btn) modeBase64Btn.addEventListener('click', () => setMode('base64'));

    if (lengthRange) lengthRange.addEventListener('input', () => {
      lengthValue.textContent = lengthRange.value;
      updateEntropy();
    });
    [tokenBytesSelect, upperCheck, lowerCheck, numbersCheck, symbolsCheck, excludeAmbiguousCheck].forEach((el) => {
      if (el) el.addEventListener('change', updateEntropy);
    });

    if (generateBtn) generateBtn.addEventListener('click', runGenerate);
    if (regenerateBtn) regenerateBtn.addEventListener('click', runGenerate);
    if (clearBtn) clearBtn.addEventListener('click', () => {
      lastResults = [];
      resultsList.innerHTML = '';
      clearInfo();
    });
    if (copyAllBtn) copyAllBtn.addEventListener('click', () => {
      if (lastResults.length) {
        navigator.clipboard.writeText(lastResults.join('\n'));
        showNotification('Copied all results!');
      }
    });

    setMode('password');
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="mb-4 inline-flex flex-wrap rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-1">
          <button id="pgModePassword" type="button" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition">Password</button>
          <button id="pgModeHex" type="button" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition">Hex Token</button>
          <button id="pgModeBase64" type="button" class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition">Base64URL Token</button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 mb-4">
          <div id="pgLengthWrapper">
            <div class="flex items-center justify-between">
              <label class="${labelClass}">Length: <span id="pgLengthValue">16</span> characters</label>
            </div>
            <input id="pgLengthRange" type="range" min="4" max="128" value="16" class="mt-2.5 w-full accent-[#1a73e8]" />
          </div>
          <div id="pgTokenBytesWrapper" class="hidden">
            <label class="${labelClass}">Token Length</label>
            <select id="pgTokenBytesSelect" class="${inputClass}">
              <option value="16">16 bytes (128-bit)</option>
              <option value="24">24 bytes (192-bit)</option>
              <option value="32" selected>32 bytes (256-bit)</option>
              <option value="48">48 bytes (384-bit)</option>
              <option value="64">64 bytes (512-bit)</option>
            </select>
          </div>
          <div>
            <label class="${labelClass}">Number of Results</label>
            <select id="pgCountSelect" class="${inputClass}">
              <option value="1" selected>1</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        <div id="pgCharsetOptions" class="grid gap-2.5 sm:grid-cols-2 mb-4">
          <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" id="pgUpper" checked class="rounded accent-[#1a73e8]" /> Uppercase (A-Z)</label>
          <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" id="pgLower" checked class="rounded accent-[#1a73e8]" /> Lowercase (a-z)</label>
          <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" id="pgNumbers" checked class="rounded accent-[#1a73e8]" /> Numbers (0-9)</label>
          <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><input type="checkbox" id="pgSymbols" class="rounded accent-[#1a73e8]" /> Symbols (!@#$...)</label>
          <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 sm:col-span-2"><input type="checkbox" id="pgExcludeAmbiguous" class="rounded accent-[#1a73e8]" /> Exclude ambiguous characters (I, l, 1, O, 0)</label>
        </div>

        <div class="mb-4 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estimated Entropy</span>
          <span id="pgEntropyValue" class="text-sm font-bold text-slate-800 dark:text-slate-200">&mdash;</span>
        </div>

        <div class="flex flex-wrap gap-2.5 mb-4">
          <button id="pgGenerateBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md">Generate</button>
          <button id="pgRegenerateBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Regenerate</button>
          <button id="pgCopyAllBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">Copy All</button>
          <button id="pgClearBtn" type="button" class="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40 transition ml-auto">Clear</button>
        </div>

        <div id="pgResultsList" class="space-y-2"></div>
        <div id="pgInfoBox" class="hidden mt-3 p-3 rounded-xl text-xs font-bold whitespace-pre-wrap"></div>
        <p class="mt-3 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Generated with your browser's cryptographically secure random number generator (crypto.getRandomValues). Nothing is ever saved, logged, or transmitted.</p>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('password-generator', { render: render })
    : console.error('WCF.registerTool unavailable for password-generator');
})();
