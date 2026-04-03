import Handlebars from "handlebars";
import {
  bufferToStream,
  renderPdfToBuffer,
  writePdfToFile,
} from "./pdfPuppeteer";
import { mergePdfCreateOptions } from "./pdfChrome";
import { registerHandlebarsHelpers } from "./registerHandlebarsHelpers";
import type { PdfCreateOptions, PdfDocument } from "./types";
import type { PdfFileInfo } from "./pdfRenderOptions";
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
 * Renders the Handlebars template and generates a PDF via Puppeteer (headless Chromium).
 */
export function create(
  document: PdfDocument,
  options: PdfCreateOptions
): Promise<Buffer | NodeJS.ReadableStream | PdfFileInfo> {
  return (async () => {
    try {
      validatePdfDocument(document);
    } catch (e) {
      throw e;
    }

    let html: string;
    try {
      html = renderHtml(document, options);
    } catch (e) {
      throw e;
    }

    const pdfOptions = mergePdfCreateOptions(options);
    const buffer = await renderPdfToBuffer(html, pdfOptions);

    switch (document.type) {
      case "buffer":
        return buffer;
      case "stream":
        return bufferToStream(buffer);
      default:
        return writePdfToFile(document.path!, buffer);
    }
  })();
}
