/**
 * @author Shyam Hajare <hajareshyam@gmail.com>
 */

import { registerHandlebarsHelpers } from "./registerHandlebarsHelpers";
import { create } from "./createPdf";

registerHandlebarsHelpers();

export { create };
export { buildPdfChrome } from "./pdfChrome";
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

const api = { create };
export default api;
