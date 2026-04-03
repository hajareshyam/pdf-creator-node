# Changelog

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
