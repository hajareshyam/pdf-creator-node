/**
 * @author Shyam Hajare <hajareshyam@gmail.com>
 */

import { registerHandlebarsHelpers } from "./registerHandlebarsHelpers";
import { create } from "./createPdf";

registerHandlebarsHelpers();

export { create };
export type {
  Document,
  IfCondOptions,
  PdfCreateOptions,
  PdfDocument,
  PdfDocumentBuffer,
  PdfDocumentFile,
  PdfDocumentStream,
} from "./types";

const api = { create };
export default api;
