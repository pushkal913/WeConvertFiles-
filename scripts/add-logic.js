const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexFile, 'utf8');

const logicToAdd = `
      if (toolId === 'json-yaml') {
        const input = document.getElementById('jyInput');
        const output = document.getElementById('jyOutput');
        const errorDiv = document.getElementById('jyError');
        const swapBtn = document.getElementById('jySwapBtn');
        const copyBtn = document.getElementById('jyCopyBtn');
        const clearBtn = document.getElementById('jyClearBtn');
        const downloadBtn = document.getElementById('jyDownloadBtn');
        let currentMode = 'json2yaml';

        const updateConversion = () => {
          const val = input.value.trim();
          errorDiv.classList.add('hidden');
          if (!val) { output.value = ''; return; }
          try {
            if (currentMode === 'json2yaml') {
              const obj = JSON.parse(val);
              output.value = window.jsyaml.dump(obj, { indent: 2 });
            } else {
              const obj = window.jsyaml.load(val);
              output.value = JSON.stringify(obj, null, 2);
            }
          } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.classList.remove('hidden');
            output.value = '';
          }
        };

        swapBtn.addEventListener('click', () => {
          currentMode = currentMode === 'json2yaml' ? 'yaml2json' : 'json2yaml';
          input.placeholder = currentMode === 'json2yaml' ? 'Paste JSON here...' : 'Paste YAML here...';
          const temp = input.value;
          input.value = output.value;
          output.value = temp;
          updateConversion();
        });

        input.addEventListener('input', updateConversion);
        
        copyBtn.addEventListener('click', async () => {
          if (!output.value) return;
          try {
            await navigator.clipboard.writeText(output.value);
            const origText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = origText, 2000);
          } catch (e) {
            alert('Failed to copy to clipboard.');
          }
        });

        if (downloadBtn) {
          downloadBtn.addEventListener('click', () => {
            if (!output.value) return;
            const ext = currentMode === 'json2yaml' ? 'yaml' : 'json';
            const blob = new Blob([output.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`converted.\${ext}\`;
            a.click();
            URL.revokeObjectURL(url);
          });
        }

        clearBtn.addEventListener('click', () => {
          input.value = '';
          output.value = '';
          errorDiv.classList.add('hidden');
        });
      }

      if (toolId === 'sql-formatter') {
        const input = document.getElementById('sqlInput');
        const output = document.getElementById('sqlOutput');
        const errorDiv = document.getElementById('sqlError');
        const formatBtn = document.getElementById('sqlFormatBtn');
        const copyBtn = document.getElementById('sqlCopyBtn');
        const clearBtn = document.getElementById('sqlClearBtn');
        const downloadBtn = document.getElementById('sqlDownloadBtn');
        const dialectSelect = document.getElementById('sqlDialect');
        const casingSelect = document.getElementById('sqlCasing');

        const formatSQL = () => {
          const val = input.value.trim();
          errorDiv.classList.add('hidden');
          if (!val) { output.value = ''; return; }
          try {
            const dialect = dialectSelect.value;
            const keywordCase = casingSelect.value;
            output.value = window.sqlFormatter.format(val, {
              language: dialect,
              keywordCase: keywordCase,
              indentStyle: 'standard'
            });
          } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.classList.remove('hidden');
            output.value = '';
          }
        };

        formatBtn.addEventListener('click', formatSQL);
        
        copyBtn.addEventListener('click', async () => {
          if (!output.value) return;
          try {
            await navigator.clipboard.writeText(output.value);
            const origText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = origText, 2000);
          } catch (e) {
            alert('Failed to copy to clipboard.');
          }
        });

        if (downloadBtn) {
          downloadBtn.addEventListener('click', () => {
            if (!output.value) return;
            const blob = new Blob([output.value], { type: 'application/sql' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`query.sql\`;
            a.click();
            URL.revokeObjectURL(url);
          });
        }

        clearBtn.addEventListener('click', () => {
          input.value = '';
          output.value = '';
          errorDiv.classList.add('hidden');
        });
      }

      if (toolId === 'code-minifier') {
        const input = document.getElementById('cmInput');
        const output = document.getElementById('cmOutput');
        const errorDiv = document.getElementById('cmError');
        const minifyBtn = document.getElementById('cmMinifyBtn');
        const beautifyBtn = document.getElementById('cmBeautifyBtn');
        const copyBtn = document.getElementById('cmCopyBtn');
        const clearBtn = document.getElementById('cmClearBtn');
        const downloadBtn = document.getElementById('cmDownloadBtn');
        const langSelect = document.getElementById('cmLang');
        const inSizeEl = document.getElementById('cmInSize');
        const outSizeEl = document.getElementById('cmOutSize');
        const savedEl = document.getElementById('cmSaved');

        const formatBytes = (bytes) => {
          if (bytes === 0) return '0 B';
          const k = 1024;
          const sizes = ['B', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        const updateStats = (inStr, outStr) => {
          const inBytes = new Blob([inStr]).size;
          const outBytes = new Blob([outStr]).size;
          inSizeEl.textContent = formatBytes(inBytes);
          outSizeEl.textContent = formatBytes(outBytes);
          if (inBytes > 0 && inBytes > outBytes) {
            const saved = ((inBytes - outBytes) / inBytes * 100).toFixed(1);
            savedEl.textContent = saved + '%';
            savedEl.className = 'text-emerald-600 dark:text-emerald-400';
          } else {
            savedEl.textContent = '0%';
            savedEl.className = 'text-slate-500';
          }
        };

        input.addEventListener('input', () => {
          const val = input.value;
          const inBytes = new Blob([val]).size;
          inSizeEl.textContent = formatBytes(inBytes);
        });

        minifyBtn.addEventListener('click', async () => {
          const val = input.value.trim();
          errorDiv.classList.add('hidden');
          if (!val) { output.value = ''; return; }
          const lang = langSelect.value;
          try {
            let res = val;
            if (lang === 'js') {
              const result = await window.Terser.minify(val);
              if (result.error) throw result.error;
              res = result.code;
            } else if (lang === 'css') {
              // Basic CSS minifier using regex if no library available
              res = val.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').replace(/\\s+/g, ' ').replace(/ {/g, '{').replace(/} /g, '}').replace(/ ;/g, ';').replace(/; }/g, '}');
            } else if (lang === 'html') {
              // Basic HTML minifier using regex if no library available
              res = val.replace(/<!--[\\s\\S]*?-->/g, '').replace(/>\\s+</g, '><').trim();
            }
            output.value = res;
            updateStats(val, res);
          } catch (err) {
            errorDiv.textContent = err.message || 'Error minifying code';
            errorDiv.classList.remove('hidden');
          }
        });

        beautifyBtn.addEventListener('click', () => {
          const val = input.value.trim();
          errorDiv.classList.add('hidden');
          if (!val) { output.value = ''; return; }
          const lang = langSelect.value;
          try {
            let res = val;
            if (lang === 'js') {
              res = window.html_beautify(val, { indent_size: 2, space_in_empty_paren: true });
            } else if (lang === 'css') {
              res = window.css_beautify(val, { indent_size: 2 });
            } else if (lang === 'html') {
              res = window.html_beautify(val, { indent_size: 2 });
            }
            output.value = res;
            updateStats(val, res);
          } catch (err) {
            errorDiv.textContent = err.message || 'Error beautifying code';
            errorDiv.classList.remove('hidden');
          }
        });
        
        copyBtn.addEventListener('click', async () => {
          if (!output.value) return;
          try {
            await navigator.clipboard.writeText(output.value);
            const origText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = origText, 2000);
          } catch (e) {
            alert('Failed to copy to clipboard.');
          }
        });

        if (downloadBtn) {
          downloadBtn.addEventListener('click', () => {
            if (!output.value) return;
            const ext = langSelect.value;
            const blob = new Blob([output.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`code.\${ext}\`;
            a.click();
            URL.revokeObjectURL(url);
          });
        }

        clearBtn.addEventListener('click', () => {
          input.value = '';
          output.value = '';
          errorDiv.classList.add('hidden');
          updateStats('', '');
        });
      }
`;

indexHtml = indexHtml.replace(
  /if \(toolId === 'markdown-preview'\) \{/g,
  `${logicToAdd}\n      if (toolId === 'markdown-preview') {`
);

fs.writeFileSync(indexFile, indexHtml);
