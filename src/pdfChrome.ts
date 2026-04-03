import type { PdfChromeOptions, PdfCreateOptions } from "./types";
import type { PdfRenderOptions } from "./pdfRenderOptions";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function defaultHeaderHtml(title: string): string {
  return `<div style="text-align:center;font-size:10px;padding:6px;">${escapeHtml(
    title
  )}</div>`;
}

function buildFooterContents(
  copyright: string | undefined,
  showPageNumbers: boolean
): NonNullable<NonNullable<PdfRenderOptions["footer"]>["contents"]> {
  const hasCopyright = copyright != null && String(copyright).trim() !== "";
  const pagePart = showPageNumbers
    ? '<span style="color:#444">{{page}}</span>/<span>{{pages}}</span>'
    : "";

  if (hasCopyright && pagePart) {
    return {
      default: `<div style="text-align:center;font-size:9px;padding:4px;">${escapeHtml(
        String(copyright)
      )} · ${pagePart}</div>`,
    };
  }
  if (hasCopyright) {
    return {
      default: `<div style="text-align:center;font-size:9px;padding:4px;">${escapeHtml(
        String(copyright)
      )}</div>`,
    };
  }
  if (pagePart) {
    return {
      default: `<div style="text-align:center;font-size:9px;padding:4px;">${pagePart}</div>`,
    };
  }
  return { default: "" };
}

/**
 * Builds partial html-pdf options from layout / header / footer / copyright.
 * Use {@link mergePdfCreateOptions} to merge with explicit `format`, `header`, `footer`.
 */
export function buildPdfChrome(chrome?: PdfChromeOptions): Partial<PdfRenderOptions> {
  if (!chrome) return {};
  const out: Partial<PdfRenderOptions> = {};

  if (chrome.layout) {
    const L = chrome.layout;
    if (L.format) out.format = L.format;
    if (L.orientation) out.orientation = L.orientation;
    if (L.width) out.width = L.width;
    if (L.height) out.height = L.height;
    if (L.border !== undefined) out.border = L.border;
  }

  if (chrome.header) {
    const h = chrome.header;
    const contents =
      h.html ?? (h.title != null && h.title !== "" ? defaultHeaderHtml(h.title) : undefined);
    if (contents) {
      out.header = {
        height: h.height ?? "45mm",
        contents,
      };
    } else if (h.height) {
      out.header = { height: h.height };
    }
  }

  if (chrome.footer) {
    const f = chrome.footer;
    if (f.html) {
      out.footer = {
        height: f.height ?? "28mm",
        contents: { default: f.html },
      };
    } else {
      const hasCopyright = f.copyright != null && String(f.copyright).trim() !== "";
      const showPages =
        f.showPageNumbers === true ||
        (f.showPageNumbers !== false && hasCopyright);
      if (hasCopyright || showPages) {
        const contents = buildFooterContents(
          hasCopyright ? String(f.copyright) : undefined,
          showPages
        );
        out.footer = {
          height: f.height ?? "28mm",
          contents,
        };
      } else if (f.height) {
        out.footer = { height: f.height };
      }
    }
  }

  return out;
}

/**
 * Merges `pdfChrome` with explicit PDF options. Explicit `header` / `footer` / `format` win.
 */
export function mergePdfCreateOptions(options: PdfCreateOptions): PdfRenderOptions {
  const { handlebarsHelpers: _h, pdfChrome, ...userPdfOptions } = options;
  const fromChrome = buildPdfChrome(pdfChrome);
  return {
    ...fromChrome,
    ...userPdfOptions,
    header: userPdfOptions.header ?? fromChrome.header,
    footer: userPdfOptions.footer ?? fromChrome.footer,
  };
}
