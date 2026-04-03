/**
 * @author Shyam Hajare <hajareshyam@gmail.com>
 */

import { registerHandlebarsHelpers } from "./handlebars/registerHandlebarsHelpers";
import { create } from "./create";

registerHandlebarsHelpers();

export { create };
export { buildPdfChrome } from "./pdf/chrome";
export { htmlPdfTokensToPuppeteer } from "./pdf/puppeteer";
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
export type { PdfFileInfo, PdfRenderOptions } from "./pdf/renderOptions";
export type { PdfFileInfo as FileInfo } from "./pdf/renderOptions";

const api = { create };
export default api;
