// js/tools/svg-to-image.js
// Heavy tool module for "svg-to-image", split out of app.js (Phase 2.5 code-splitting).
// Loaded on demand only when this tool is opened. Registers render(container, ctx),
// convert() (invoked by the core convert dispatcher), and validate().
// Uses core helpers/state (state, setStatus, downloadBlob, readAsDataUrl, updateFileList,
// handleConvert, sanitize helpers) exposed globally by the classic app.js script.
(function () {
  'use strict';
  function wire() {
    const formatSelect = document.getElementById('svgImgFormatSelect');
    const bgSelect = document.getElementById('svgImgBgSelect');
    const customColorCol = document.getElementById('svgImgCustomColorCol');
    const customColorInput = document.getElementById('svgImgCustomColorInput');
    const qualityCol = document.getElementById('svgImgQualityCol');
    const qualitySlider = document.getElementById('svgImgQualitySlider');
    const qualityVal = document.getElementById('svgImgQualityVal');

    const widthInput = document.getElementById('svgImgWidthInput');
    const heightInput = document.getElementById('svgImgHeightInput');
    const lockAspect = document.getElementById('svgImgLockAspect');

    const textInput = document.getElementById('svgImgTextInput');
    const previewCard = document.getElementById('svgImgPreviewCard');
    const previewImg = document.getElementById('svgImgPreviewElement');
    const convertBtn = document.getElementById('svgImgConvertBtn');

    let originalSvgText = '';
    let naturalWidth = 800;
    let naturalHeight = 600;

    const updateControlsVisibility = () => {
      const isJpg = formatSelect.value === 'image/jpeg';
      if (qualityCol) qualityCol.classList.toggle('hidden', !isJpg);

      const isCustomBg = bgSelect.value === 'custom';
      if (customColorCol) customColorCol.classList.toggle('hidden', !isCustomBg);
    };

    const sanitizeSvgString = (rawSvg) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawSvg, 'image/svg+xml');

        const scripts = doc.querySelectorAll('script');
        scripts.forEach(s => s.remove());

        const allElements = doc.querySelectorAll('*');
        allElements.forEach(el => {
          for (let i = el.attributes.length - 1; i >= 0; i--) {
            const attr = el.attributes[i];
            if (/^on/i.test(attr.name)) {
              el.removeAttribute(attr.name);
            }
          }
        });

        return new XMLSerializer().serializeToString(doc);
      } catch (err) {
        return rawSvg;
      }
    };

    const renderSvgPreview = () => {
      let svgContent = textInput.value.trim();
      if (!svgContent) {
        if (previewCard) previewCard.classList.add('hidden');
        return;
      }

      const sanitized = sanitizeSvgString(svgContent);
      originalSvgText = sanitized;

      const blob = new Blob([sanitized], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const tempImg = new Image();
      tempImg.onload = () => {
        naturalWidth = tempImg.naturalWidth || 800;
        naturalHeight = tempImg.naturalHeight || 600;

        if (!widthInput.value) widthInput.value = naturalWidth;
        if (!heightInput.value) heightInput.value = naturalHeight;

        previewImg.src = url;
        if (previewCard) previewCard.classList.remove('hidden');
      };
      tempImg.src = url;
    };

    const handleFileLoad = (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        textInput.value = e.target.result;
        renderSvgPreview();
      };
      reader.readAsText(file);
    };

    if (state.files && state.files[0]) {
      handleFileLoad(state.files[0]);
    }

    if (formatSelect) formatSelect.addEventListener('change', updateControlsVisibility);
    if (bgSelect) bgSelect.addEventListener('change', updateControlsVisibility);
    if (qualitySlider) {
      qualitySlider.addEventListener('input', () => {
        if (qualityVal) qualityVal.textContent = `${qualitySlider.value}%`;
      });
    }

    if (widthInput) {
      widthInput.addEventListener('input', () => {
        if (lockAspect && lockAspect.checked && naturalWidth > 0) {
          const w = parseFloat(widthInput.value);
          if (!isNaN(w)) {
            heightInput.value = Math.round((w * naturalHeight) / naturalWidth);
          }
        }
      });
    }

    if (heightInput) {
      heightInput.addEventListener('input', () => {
        if (lockAspect && lockAspect.checked && naturalHeight > 0) {
          const h = parseFloat(heightInput.value);
          if (!isNaN(h)) {
            widthInput.value = Math.round((h * naturalWidth) / naturalHeight);
          }
        }
      });
    }

    if (textInput) {
      textInput.addEventListener('input', () => {
        updateFileList();
        renderSvgPreview();
      });
    }

    if (convertBtn) {
      convertBtn.addEventListener('click', handleConvert);
    }

    updateControlsVisibility();
  }

  function render(container, ctx) {
    const { inputClass, labelClass, helpClass } = ctx.classes;
    container.innerHTML = `
      <div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <div>
            <label class="${labelClass}">Output Format</label>
            <select id="svgImgFormatSelect" class="${inputClass}">
              <option value="image/png" selected>PNG (.png)</option>
              <option value="image/jpeg">JPG (.jpg)</option>
            </select>
          </div>
          <div>
            <label class="${labelClass}">Background</label>
            <select id="svgImgBgSelect" class="${inputClass}">
              <option value="transparent" selected>Transparent (PNG)</option>
              <option value="#ffffff">White (#ffffff)</option>
              <option value="#000000">Black (#000000)</option>
              <option value="custom">Custom Color</option>
            </select>
          </div>
          <div id="svgImgCustomColorCol" class="hidden">
            <label class="${labelClass}">Custom Hex Color</label>
            <input id="svgImgCustomColorInput" type="color" value="#1a73e8" class="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 cursor-pointer" />
          </div>
          <div id="svgImgQualityCol" class="hidden">
            <label class="${labelClass}">JPG Quality (<span id="svgImgQualityVal">90%</span>)</label>
            <input id="svgImgQualitySlider" type="range" min="10" max="100" value="90" class="w-full h-2 mt-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-3 mb-4">
          <div>
            <label class="${labelClass}">Width (px)</label>
            <input id="svgImgWidthInput" type="number" min="1" max="10000" class="${inputClass}" placeholder="e.g. 800" />
          </div>
          <div>
            <label class="${labelClass}">Height (px)</label>
            <input id="svgImgHeightInput" type="number" min="1" max="10000" class="${inputClass}" placeholder="e.g. 600" />
          </div>
          <div class="flex items-center gap-2 mt-6">
            <input id="svgImgLockAspect" type="checkbox" checked class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <label for="svgImgLockAspect" class="text-xs font-bold text-slate-700 dark:text-slate-300">Lock Aspect Ratio</label>
          </div>
        </div>

        <div class="mb-4">
          <label class="${labelClass}">Or Paste Raw SVG XML Code</label>
          <textarea id="svgImgTextInput" rows="5" class="${inputClass} mt-2 font-mono text-xs" placeholder="Paste &lt;svg ...&gt;...&lt;/svg&gt; XML code here..."></textarea>
        </div>

        <div id="svgImgPreviewCard" class="hidden border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/30 text-center">
          <h4 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Sanitized SVG Render Preview</h4>
          <div id="svgImgPreviewContainer" class="mx-auto max-w-sm max-h-64 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 shadow-sm flex items-center justify-center">
            <img id="svgImgPreviewElement" class="max-h-56 w-auto object-contain" alt="SVG Preview" />
          </div>
          <button id="svgImgConvertBtn" type="button" class="mt-4 px-6 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md">Convert & Download Image</button>
        </div>
      </div>
    `;
    wire();
  }

  async function convert() {
  let svgXml = document.getElementById('svgImgTextInput')?.value?.trim() || '';
  if (!svgXml && state.files.length > 0) {
    setStatus('Reading uploaded SVG vector file...');
    svgXml = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(state.files[0]);
    });
  }
  if (!svgXml) throw new Error('Please upload an SVG file or paste raw SVG XML code.');

  setStatus('Sanitizing vector XML...');
  let sanitized = svgXml;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgXml, 'image/svg+xml');
    doc.querySelectorAll('script').forEach(s => s.remove());
    doc.querySelectorAll('*').forEach(el => {
      for (let i = el.attributes.length - 1; i >= 0; i--) {
        const attr = el.attributes[i];
        if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
      }
    });
    sanitized = new XMLSerializer().serializeToString(doc);
  } catch (e) {
    sanitized = svgXml;
  }

  const mime = document.getElementById('svgImgFormatSelect')?.value || 'image/png';
  const isJpg = mime === 'image/jpeg';
  const bgSelect = document.getElementById('svgImgBgSelect')?.value || 'transparent';
  const customColorInput = document.getElementById('svgImgCustomColorInput');
  const qualitySlider = document.getElementById('svgImgQualitySlider');
  const quality = isJpg ? (parseInt(qualitySlider?.value || '90', 10) / 100) : 1.0;

  let bgColor = 'transparent';
  if (bgSelect === 'custom') {
    bgColor = customColorInput?.value || '#1a73e8';
  } else if (bgSelect !== 'transparent') {
    bgColor = bgSelect;
  } else if (isJpg) {
    bgColor = '#ffffff';
  }

  setStatus('Rendering SVG to canvas...');
  const svgBlob = new Blob([sanitized], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('Failed to render SVG image. Make sure the SVG XML code is valid.'));
    img.src = svgUrl;
  });

  const naturalW = img.naturalWidth || 800;
  const naturalH = img.naturalHeight || 600;
  const targetW = parseInt(document.getElementById('svgImgWidthInput')?.value, 10) || naturalW;
  const targetH = parseInt(document.getElementById('svgImgHeightInput')?.value, 10) || naturalH;

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');

  if (bgColor && bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetW, targetH);
  }

  ctx.drawImage(img, 0, 0, targetW, targetH);
  URL.revokeObjectURL(svgUrl);

  const exportBlob = await new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate image from SVG canvas.'));
    }, mime, quality);
  });

  const ext = isJpg ? 'jpg' : 'png';
  const baseName = (state.files[0]?.name || 'vector').replace(/\.[^/.]+$/, '');
  downloadBlob(exportBlob, `${baseName}.${ext}`);
  }

  function validate() {
    return state.files.length > 0 || !!document.getElementById('svgImgTextInput')?.value?.trim();
  }

  (window.WCF && window.WCF.registerTool)
    ? window.WCF.registerTool('svg-to-image', { render: render, convert: convert, validate: validate })
    : console.error('WCF.registerTool unavailable for svg-to-image');
})();
