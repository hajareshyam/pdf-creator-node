import Handlebars from "handlebars";
import pdf from "html-pdf";
import type { FileInfo } from "html-pdf";
import { mergePdfCreateOptions } from "./pdfChrome";
import { registerHandlebarsHelpers } from "./registerHandlebarsHelpers";
import type { PdfCreateOptions, PdfDocument } from "./types";
import { validatePdfDocument } from "./validation";

function renderHtml(document: PdfDocument, options: PdfCreateOptions): string {
  const hb = Handlebars.create();
  registerHandlebarsHelpers(hb);
  if (options.handlebarsHelpers) {
    for (const [name, fn] of Object.entries(options.handlebarsHelpers)) {
      hb.registerHelper(name, fn);
    }
  }
  try {
    return hb.compile(document.html)(document.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`pdf-creator-node: template rendering failed: ${msg}`);
  }
}

/**
 * Renders the Handlebars template and generates a PDF via html-pdf.
 */
export function create(
  document: PdfDocument,
  options: PdfCreateOptions
): Promise<Buffer | NodeJS.ReadableStream | FileInfo> {
  return new Promise((resolve, reject) => {
    try {
      validatePdfDocument(document);
    } catch (e) {
      reject(e);
      return;
    }

    let html: string;
    try {
      html = renderHtml(document, options);
    } catch (e) {
      reject(e);
      return;
    }

    const pdfOptions = mergePdfCreateOptions(options);
    const pdfPromise = pdf.create(html, pdfOptions);

    switch (document.type) {
      case "buffer":
        pdfPromise.toBuffer((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
        break;

      case "stream":
        pdfPromise.toStream((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
        break;

      default:
        pdfPromise.toFile(document.path!, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
        break;
    }
  });
}
