import type { PdfDocument } from "./types";

/**
 * Validates `document` before PDF generation. Throws with a clear message if invalid.
 */
export function validatePdfDocument(document: PdfDocument): void {
  if (!document || typeof document !== "object") {
    throw new Error("pdf-creator-node: `document` is required.");
  }
  if (
    document.html == null ||
    typeof document.html !== "string" ||
    document.html.trim() === ""
  ) {
    throw new Error(
      "pdf-creator-node: `document.html` must be a non-empty string."
    );
  }
  if (document.data === undefined || document.data === null) {
    throw new Error(
      'pdf-creator-node: `document.data` is required (use `{}` if the template has no variables).'
    );
  }

  const kind = document.type;
  const isFile = kind !== "buffer" && kind !== "stream";
  if (isFile) {
    if (
      document.path == null ||
      typeof document.path !== "string" ||
      document.path.trim() === ""
    ) {
      throw new Error(
        'pdf-creator-node: `document.path` is required when writing a PDF file (use `type: "buffer"` or `type: "stream"` for in-memory output).'
      );
    }
  }
}
