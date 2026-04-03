import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";
import type { Browser, PDFOptions } from "puppeteer";
import puppeteer from "puppeteer";
import { Readable } from "stream";
import type { PdfFileInfo, PdfRenderOptions } from "./renderOptions";

/** Maps html-pdf `{{page}}` / `{{pages}}` to Puppeteer header/footer template tokens. */
export function htmlPdfTokensToPuppeteer(html: string): string {
  return html
    .replace(/\{\{\s*page\s*\}\}/gi, '<span class="pageNumber"></span>')
    .replace(/\{\{\s*pages\s*\}\}/gi, '<span class="totalPages"></span>');
}

function wrapPrintTemplate(html: string): string {
  return `<div style="font-size:10px;width:100%;box-sizing:border-box;padding:4px 12px;">${htmlPdfTokensToPuppeteer(
    html
  )}</div>`;
}

function borderToMargin(
  border: PdfRenderOptions["border"]
): { top: string; right: string; bottom: string; left: string } | undefined {
  if (border == null) return undefined;
  if (typeof border === "string") {
    return { top: border, right: border, bottom: border, left: border };
  }
  return {
    top: border.top ?? "0",
    right: border.right ?? "0",
    bottom: border.bottom ?? "0",
    left: border.left ?? "0",
  };
}

function ensureFullHtmlDocument(html: string): string {
  const trimmed = html.trim();
  if (/^<!DOCTYPE/i.test(trimmed) || /<html[\s>]/i.test(trimmed)) {
    return html;
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`;
}

/**
 * v4+: Puppeteer only supports one footer template — we use `default`, else `first`, else `last`.
 * Per-page numeric keys are ignored.
 */
function pickFooterHtml(footer: PdfRenderOptions["footer"]): string | undefined {
  const c = footer?.contents;
  if (!c) return undefined;
  if (c.default != null && String(c.default).trim() !== "") return String(c.default);
  if (c.first != null && String(c.first).trim() !== "") return String(c.first);
  if (c.last != null && String(c.last).trim() !== "") return String(c.last);
  return undefined;
}

async function withBrowser<T>(fn: (browser: Browser) => Promise<T>): Promise<T> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}

function buildPdfOptions(opts: PdfRenderOptions): PDFOptions {
  const margin = borderToMargin(opts.border);
  const headerHtml = opts.header?.contents;
  const footerHtml = pickFooterHtml(opts.footer);
  const hasHeader = Boolean(headerHtml && headerHtml.trim());
  const hasFooter = Boolean(footerHtml && footerHtml.trim());

  const format = opts.width && opts.height ? undefined : opts.format ?? "A4";
  const landscape = opts.orientation === "landscape";

  const pdfOpts: PDFOptions = {
    printBackground: true,
    landscape,
  };

  if (hasHeader || hasFooter) {
    pdfOpts.displayHeaderFooter = true;
    pdfOpts.headerTemplate = hasHeader
      ? wrapPrintTemplate(headerHtml!)
      : "<span></span>";
    pdfOpts.footerTemplate = hasFooter
      ? wrapPrintTemplate(footerHtml!)
      : "<span></span>";
  }

  if (margin) {
    pdfOpts.margin = margin;
  }
  if (opts.width && opts.height) {
    pdfOpts.width = opts.width;
    pdfOpts.height = opts.height;
  } else if (format) {
    pdfOpts.format = format;
  }

  return pdfOpts;
}

/**
 * Renders HTML to PDF bytes using headless Chromium (Puppeteer).
 */
export async function renderPdfToBuffer(
  html: string,
  options: PdfRenderOptions
): Promise<Buffer> {
  const fullHtml = ensureFullHtmlDocument(html);
  const pdfOpts = buildPdfOptions(options);
  const timeout = options.timeout ?? 30000;

  return withBrowser(async (browser) => {
    const page = await browser.newPage();
    page.setDefaultTimeout(timeout);
    if (options.httpHeaders && Object.keys(options.httpHeaders).length > 0) {
      await page.setExtraHTTPHeaders(options.httpHeaders);
    }
    if (options.httpCookies?.length) {
      await page.setCookie(...options.httpCookies);
    }

    await page.setContent(fullHtml, {
      waitUntil: "load",
      timeout,
      ...(options.base ? { baseURL: options.base } : {}),
    });

    if (typeof options.renderDelay === "number" && options.renderDelay > 0) {
      await new Promise((r) => setTimeout(r, options.renderDelay as number));
    }

    const buf = await page.pdf(pdfOpts);
    return Buffer.from(buf);
  });
}

export async function writePdfToFile(
  path: string,
  buffer: Buffer
): Promise<PdfFileInfo> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, buffer);
  return { filename: path };
}

export function bufferToStream(buffer: Buffer): Readable {
  return Readable.from(buffer);
}
