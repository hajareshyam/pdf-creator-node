/**
 * @author Shyam Hajare <hajareshyam@gmail.com>
 */

import { registerHandlebarsHelpers } from "./registerHandlebarsHelpers";
import { create } from "./createPdf";

registerHandlebarsHelpers();

export { create };
export { buildPdfChrome } from "./pdfChrome";
export { htmlPdfTokensToPuppeteer } from "./pdfPuppeteer";
export type {
  Document,
  IfCondOptions,
  PdfChromeOptions,
  PdfCreateOptions,
  PdfDocument,
  PdfDocumentBuffer,
  PdfDocumentFile,
  PdfDocumentStream,
  PdfFooterConfig,
  PdfHeaderConfig,
  PdfLayout,
} from "./types";
export type { PdfFileInfo, PdfRenderOptions } from "./pdfRenderOptions";
export type { PdfFileInfo as FileInfo } from "./pdfRenderOptions";

const api = { create };
export default api;
