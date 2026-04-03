import type { CreateOptions } from "html-pdf";
import type { HelperDelegate } from "handlebars";

/** Options passed to Handlebars `ifCond` helper inverse/fn blocks */
export interface IfCondOptions {
  fn: (context: any) => string;
  inverse: (context: any) => string;
}

/**
 * Output to a file. Use `type: "file"` or `""`, or omit `type` when `path` is set.
 */
export interface PdfDocumentFile {
  html: string;
  data: any;
  path: string;
  type?: "file" | "";
}

/** Output a PDF buffer */
export interface PdfDocumentBuffer {
  html: string;
  data: any;
  type: "buffer";
}

/** Output a PDF read stream */
export interface PdfDocumentStream {
  html: string;
  data: any;
  type: "stream";
}

export type PdfDocument =
  | PdfDocumentFile
  | PdfDocumentBuffer
  | PdfDocumentStream;

/** @deprecated Use `PdfDocument` — kept for compatibility with earlier typings */
export type Document = PdfDocument;

/** Page size / margins — maps to html-pdf paper options */
export interface PdfLayout {
  format?: "A3" | "A4" | "A5" | "Legal" | "Letter" | "Tabloid";
  orientation?: "portrait" | "landscape";
  width?: string;
  height?: string;
  border?: CreateOptions["border"];
}

/** Repeating header — use `html` or a plain `title` (escaped) */
export interface PdfHeaderConfig {
  height?: string;
  /** Raw HTML shown on each page */
  html?: string;
  /** Centered plain text (HTML-escaped). Ignored if `html` is set */
  title?: string;
}

/** Repeating footer — use `html`, or `copyright` / `showPageNumbers` */
export interface PdfFooterConfig {
  height?: string;
  /** Raw HTML for the default footer slot */
  html?: string;
  /** Plain copyright line (HTML-escaped) */
  copyright?: string;
  /**
   * Include `{{page}}` / `{{pages}}`. If `copyright` is set, defaults to true unless `false`.
   * For page numbers only, set `showPageNumbers: true` and omit `copyright`.
   */
  showPageNumbers?: boolean;
}

/**
 * High-level layout + header/footer/copyright. Merged before `html-pdf` runs; any
 * explicit `format`, `header`, `footer` on the same options object overrides these.
 */
export interface PdfChromeOptions {
  layout?: PdfLayout;
  header?: PdfHeaderConfig;
  footer?: PdfFooterConfig;
}

/**
 * Options for `html-pdf`, plus optional Handlebars helpers for this render only
 * (rendering uses an isolated Handlebars instance).
 */
export type PdfCreateOptions = CreateOptions & {
  handlebarsHelpers?: Record<string, HelperDelegate>;
  /** Convenience presets merged into html-pdf options (explicit keys override) */
  pdfChrome?: PdfChromeOptions;
};
