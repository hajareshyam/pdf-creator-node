/**
 * PDF engine options (formerly html-pdf / PhantomJS; now mapped to Puppeteer).
 * Kept compatible with the previous option shape where possible.
 */
export interface PdfRenderOptions {
  directory?: string;
  height?: string;
  width?: string;
  format?: "A3" | "A4" | "A5" | "Legal" | "Letter" | "Tabloid";
  orientation?: "portrait" | "landscape";
  border?:
    | string
    | {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
      };
  paginationOffset?: number;
  header?: {
    height?: string;
    contents?: string;
  };
  footer?: {
    height?: string;
    contents?: {
      first?: string;
      [page: number]: string | undefined;
      default?: string;
      last?: string;
    };
  };
  base?: string;
  zoomFactor?: string;
  type?: "png" | "jpeg" | "pdf";
  quality?: string;
  /** @deprecated No effect in v4 (Puppeteer). */
  phantomPath?: string;
  /** @deprecated No effect in v4 (Puppeteer). */
  phantomArgs?: string[];
  /** @deprecated No effect in v4 (Puppeteer). */
  localUrlAccess?: boolean;
  /** @deprecated No effect in v4 (Puppeteer). */
  script?: string;
  timeout?: number;
  renderDelay?: "manual" | number;
  httpHeaders?: {
    [header: string]: string;
  };
  childProcessOptions?: {
    detached?: boolean;
  };
  httpCookies?: Array<{
    name: string;
    value: string;
    domain?: string;
    path: string;
    httponly?: boolean;
    secure?: boolean;
    expires?: number;
  }>;
}

/** Result shape when writing to disk (same as previous html-pdf FileInfo). */
export interface PdfFileInfo {
  filename: string;
}
