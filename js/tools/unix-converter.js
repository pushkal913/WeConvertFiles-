// js/tools/unix-converter.js
// Tool module for "unix-converter", split out of app.js (Phase 2.1 code-splitting).
// Loaded on demand by the core runtime only when this tool is opened. Registers
// render(container, ctx); uses core helpers/state exposed globally by app.js.
(function () {
  'use strict';
  function wire() {
    const liveClock = document.getElementById('unixLiveClock');
    if (liveClock) {
      if (state.epochClockInterval) clearInterval(state.epochClockInterval);
      state.epochClockInterval = setInterval(() => {
        const live = document.getElementById('unixLiveClock');
        if (live) live.textContent = Math.floor(Date.now() / 1000);
      }, 1000);
    }

    // Epoch to Calendar
    const unixInput = document.getElementById('unixInputVal');
    const unixUnit = document.getElementById('unixInputUnit');
    const outGmt = document.getElementById('unixOutGmt');
    const outLocal = document.getElementById('unixOutLocal');
    const outRelative = document.getElementById('unixOutRelative');

    const runEpochToCal = () => {
      let val = parseInt(unixInput.value, 10);
      if (isNaN(val)) {
        outGmt.textContent = ''; outLocal.textContent = ''; outRelative.textContent = '';
        return;
      }
      if (unixUnit.value === 's') val = val * 1000;
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        outGmt.textContent = 'Invalid Date'; outLocal.textContent = 'Invalid Date'; outRelative.textContent = '';
        return;
      }
      outGmt.textContent = date.toUTCString();
      outLocal.textContent = date.toString();

      // Compute Relative
      const diffMs = val - Date.now();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHr = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHr / 24);

      if (Math.abs(diffSec) < 60) outRelative.textContent = diffSec >= 0 ? `in ${diffSec} seconds` : `${Math.abs(diffSec)} seconds ago`;
      else if (Math.abs(diffMin) < 60) outRelative.textContent = diffMin >= 0 ? `in ${diffMin} minutes` : `${Math.abs(diffMin)} minutes ago`;
      else if (Math.abs(diffHr) < 24) outRelative.textContent = diffHr >= 0 ? `in ${diffHr} hours` : `${Math.abs(diffHr)} hours ago`;
      else outRelative.textContent = diffDay >= 0 ? `in ${diffDay} days` : `${Math.abs(diffDay)} days ago`;
    };

    if (unixInput) unixInput.addEventListener('input', runEpochToCal);
    if (unixUnit) unixUnit.addEventListener('change', runEpochToCal);

    // Calendar to Epoch
    const dateInput = document.getElementById('dateInputVal');
    const dateSec = document.getElementById('dateOutSeconds');
    const dateMs = document.getElementById('dateOutMillis');

    const runCalToEpoch = () => {
      if (!dateInput.value) {
        dateSec.textContent = ''; dateMs.textContent = '';
        return;
      }
      const time = new Date(dateInput.value).getTime();
      if (isNaN(time)) {
        dateSec.textContent = 'Invalid Date'; dateMs.textContent = 'Invalid Date';
        return;
      }
      dateSec.textContent = Math.floor(time / 1000);
      dateMs.textContent = time;
    };

    if (dateInput) {
      dateInput.value = new Date().toISOString().slice(0, 16);
      dateInput.addEventListener('input', runCalToEpoch);
      runCalToEpoch();
    }
    runEpochToCal();
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="flex items-center justify-between p-4 border border-rose-100 dark:border-rose-950/60 rounded-2xl bg-rose-50/30 dark:bg-rose-950/10 mb-5">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Epoch Clock</h4>
            <span id="unixLiveClock" class="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-1 block">0</span>
          </div>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <!-- Timestamp to Readable -->
          <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40">
            <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Epoch to Calendar Date</h4>
            <label class="text-xs font-semibold text-slate-500">Unix Timestamp</label>
            <div class="flex gap-2 mt-1">
              <input type="number" id="unixInputVal" class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-mono" value="1784370916" />
              <select id="unixInputUnit" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1.5 text-xs">
                <option value="s" selected>Seconds</option>
                <option value="ms">Millis</option>
              </select>
            </div>
            <div class="mt-4 space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300">
              <div><span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">GMT Date</span> <span id="unixOutGmt" class="block bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800"></span></div>
              <div><span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Local Date</span> <span id="unixOutLocal" class="block bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800"></span></div>
              <div><span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Relative Time</span> <span id="unixOutRelative" class="block bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800"></span></div>
            </div>
          </div>

          <!-- Readable to Timestamp -->
          <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/40">
            <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Calendar Date to Epoch</h4>
            <label class="text-xs font-semibold text-slate-500">Pick Date & Time</label>
            <input type="datetime-local" id="dateInputVal" class="${inputClass} mt-1.5 text-xs font-mono" />
            <div class="mt-4 space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300">
              <div><span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Epoch (Seconds)</span> <span id="dateOutSeconds" class="block bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800"></span></div>
              <div><span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Epoch (Milliseconds)</span> <span id="dateOutMillis" class="block bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800"></span></div>
            </div>
          </div>
        </div>
      </div>
    `;
    wire();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('unix-converter', { render: render })
    : console.error('WCF.registerTool unavailable for unix-converter');
})();
