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

/**
 * Options for `html-pdf`, plus optional Handlebars helpers for this render only
 * (rendering uses an isolated Handlebars instance).
 */
export type PdfCreateOptions = CreateOptions & {
  handlebarsHelpers?: Record<string, HelperDelegate>;
};
