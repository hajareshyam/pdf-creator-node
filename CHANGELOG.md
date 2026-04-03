# Changelog

## [Unreleased]

## [4.0.1] — 2026-04-03

### Changed

- **Source layout:** `src/pdf/`, `src/handlebars/`, `src/types/`, `src/validation/`, `src/create/index.ts` (`create` entrypoint); root keeps `index.ts` only. Published API unchanged.
- **Example (`example/`):** `index.js` uses async/await, resolves output path with `path.join`; `template.html` age field corrected (`{{this.age}}`); `npm start` script.

### Documentation

- **README:** **AWS Lambda / serverless** — deployment limits, container vs zip, memory and timeout, note that custom `executablePath` is not exposed on options yet.
- **README:** **Margins** (`border`), **custom fonts** (hosted + `base` + `@font-face`), **images** (remote, `base`, data URLs, WebP, header/footer), **page-break** hints for wide tables.
- **GitHub Pages (`docs/`):** **Fonts & images** section and nav link; guide **footer** example aligned with v4 (single template); note on unsupported per-page footer keys; author section with social links.

## [4.0.0] — 2026-04-03

### Breaking

- **Rendering engine:** **PhantomJS / `html-pdf` replaced with [Puppeteer](https://pptr.dev/) (headless Chromium).** Install footprint is larger (Chromium download on `npm install`). PDF output may differ slightly from Phantom.
- **Types:** `PdfCreateOptions` is now based on **`PdfRenderOptions`** (no dependency on `@types/html-pdf`). **`phantomPath`**, **`phantomArgs`**, and related fields are deprecated no-ops.
- **Footer `contents`:** only one repeating template is used — **`default`**, else **`first`**, else **`last`**. Per-page numeric keys (e.g. page `2`) are not applied.

### Added

- **`src/pdfPuppeteer.ts`:** `renderPdfToBuffer`, mapping from options to `page.pdf()`.
- **`htmlPdfTokensToPuppeteer()`** exported to map `{{page}}` / `{{pages}}` for print header/footer.
- **`PdfRenderOptions`**, **`PdfFileInfo`** in `pdfRenderOptions.ts`.

### Removed

- Dependencies **`html-pdf`**, **`@types/html-pdf`**.

### Documentation

- README: **Strengths and trade-offs** (Chromium vs PDFKit, footprint, when to scale).

## [2.5.0] — 2026-04-03

### Added

- **`pdfChrome`** on `PdfCreateOptions`: structured **layout** (format, orientation, size, border), **header** (`html` or escaped `title`), **footer** (`html` or `copyright` + optional page numbers via `showPageNumbers`). Merged into html-pdf options; explicit `format` / `header` / `footer` on the same object override.
- Exported **`buildPdfChrome()`** for building partial html-pdf options from `PdfChromeOptions`.
- Types: `PdfChromeOptions`, `PdfLayout`, `PdfHeaderConfig`, `PdfFooterConfig`.

### Changed

- **Repository:** removed root `yarn.lock` so installs match **npm** only (aligned with `npm ci` in CI). Keep `package-lock.json` as the lockfile.
- **`.gitignore`:** dropped the `.package-lock.json` ignore rule (misleading; `package-lock.json` remains tracked).

### Documentation

- **Example (`example/`):** sample uses **`pdfChrome`** (layout, header title, footer copyright + page numbers).
- **GitHub Pages (`docs/`):** “Layout & header/footer” section, quick start uses `pdfChrome`, install command `npm i pdf-creator-node`, hero link to full readme.

## [2.4.0] — 2026-04-03

### Added

- Clear validation errors for missing `html`, `data`, or `path` (when writing a file).
- `document.data` can be any value except `null`/`undefined` (e.g. `0` is allowed).
- Optional `handlebarsHelpers` on PDF options to register extra Handlebars helpers for that render (isolated `Handlebars.create()` instance).
- Stricter TypeScript types: `PdfDocumentFile`, `PdfDocumentBuffer`, `PdfDocumentStream`, and a `PdfDocument` union.
- `src/validation.ts` with `validatePdfDocument()` (used internally).
- Automated tests (`npm test`) and GitHub Actions CI.
- `engines.node` set to `>=18`.

### Changed

- Template compile/render errors are wrapped with prefix `pdf-creator-node: template rendering failed:`.
- README: corrected `ifCond` HTML example, TypeScript usage, optional helpers, and license line (`package.json` `license` set to **MIT** to match `LICENSE`).
- `package.json` keywords deduplicated.

## Earlier releases

See git history for changes before this changelog was added.
