# WeConvertFiles — Core Web Vitals baseline

Generated: 2026-08-27T11:26:53.073Z

Reproduce:

```
npm run measure:vitals
```

## Method

- Metrics: **LCP**, **CLS**, **INP**, collected with Google's web-vitals 6.2.1 injected into the page.
- Browser: Chromium via Playwright 1.56.1, headless, against the local static server (`test/serve.mjs`).
- Desktop 1280×800 (no CPU throttle); mobile 390×844 at **4× CPU throttle** (~mid-tier phone).
- **Cold** = empty-cache first visit; **warm** = repeat visit with assets cached.
- INP is exercised with three non-navigating interactions (dark-mode toggle) per load. Median of 3 runs per configuration.
- These are **lab** numbers under fixed conditions — reproducible and comparable between commits, **not** field data.

> Targets are intentionally **not** set here. Establish project targets only after reviewing this measured baseline (and, ideally, real field/CrUX data). The columns below are measurements, not commitments.

## Results (median)

| Page | Device | Load | LCP (ms) | CLS | INP (ms) |
| --- | --- | --- | ---: | ---: | ---: |
| Homepage | desktop | cold | 160 | 0 | 128 |
| Homepage | desktop | warm | 108 | 0 | 64 |
| Homepage | mobile | cold | 188 | 0 | 176 |
| Homepage | mobile | warm | 84 | 0 | 176 |
| Tool (Merge PDF) | desktop | cold | 100 | 0 | 32 |
| Tool (Merge PDF) | desktop | warm | 72 | 0 | 32 |
| Tool (Merge PDF) | mobile | cold | 268 | 0 | 64 |
| Tool (Merge PDF) | mobile | warm | 188 | 0 | 64 |
| Guide (Merge PDF) | desktop | cold | 80 | 0 | 40 |
| Guide (Merge PDF) | desktop | warm | 60 | 0 | 32 |
| Guide (Merge PDF) | mobile | cold | 88 | 0 | 48 |
| Guide (Merge PDF) | mobile | warm | 68 | 0 | 56 |
| Conversion (JPG to PDF) | desktop | cold | 76 | 0 | 48 |
| Conversion (JPG to PDF) | desktop | warm | 52 | 0 | 32 |
| Conversion (JPG to PDF) | mobile | cold | 88 | 0 | 48 |
| Conversion (JPG to PDF) | mobile | warm | 72 | 0 | 48 |
| Legal (Privacy) | desktop | cold | 76 | 0 | 32 |
| Legal (Privacy) | desktop | warm | 56 | 0 | 32 |
| Legal (Privacy) | mobile | cold | 96 | 0 | 40 |
| Legal (Privacy) | mobile | warm | 72 | 0 | 40 |

For reference only, Google's "good" field thresholds are LCP ≤ 2500 ms, CLS ≤ 0.1, INP ≤ 200 ms. Lab numbers here are not directly comparable to field data but are useful for commit-to-commit comparison.
