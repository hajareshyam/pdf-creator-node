# pdf-creator-node

Convert **HTML + Handlebars** templates to **PDF** in Node.js using **[Puppeteer](https://pptr.dev/)** (headless **Chromium**). PhantomJS / `html-pdf` are no longer used as of **v4**.

**Requirements:** [Node.js](https://nodejs.org/) 18 or newer.

**Install size:** `puppeteer` downloads a compatible Chromium build on `npm install` (hundreds of MB). In CI you can cache the browser directory or set [`PUPPETEER_CACHE_DIR`](https://pptr.dev/guides/configuration) / `PUPPETEER_SKIP_DOWNLOAD` as needed.

### Strengths and trade-offs

| | |
| --- | --- |
| **Strengths** | **HTML + Handlebars** — quick to build **invoices, reports, and letters** without drawing coordinates. **v4+** uses **Chromium**, so you get **modern CSS** (flexbox, grid, web fonts) and a **maintained** rendering stack — not deprecated PhantomJS. **`pdfChrome`** helps with layout, headers, footers, and copyright in one place. |
| **Trade-offs** | **Footprint:** Chromium adds install size and **RAM** per browser instance. **Throughput:** launching a browser is heavier than a pure-JS library like **PDFKit** for tiny one-off jobs; for **high volume**, reuse browsers ([Puppeteer patterns](https://pptr.dev/)), queue work, or run workers. **Model:** this package is **HTML → PDF**; if you need a **drawing API** (paths, precise vector control) without HTML, use PDFKit / pdf-lib instead. **Print pipeline:** PDFs use Chrome’s **print** path — edge cases can differ from on-screen CSS (true for any headless-Chrome PDF approach). |

**Practical verdict:** strong fit for **small and medium** projects and **production** workloads where you control **memory** and **concurrency**; for **very large scale** (always-on millions of PDFs/day), plan **infrastructure** (pooling, autoscaling, or a dedicated rendering service) like any Chromium-based pipeline.

### Upgrading from v2.x (Phantom / html-pdf)

- **v4** is a **major** release: PDFs are rendered with Chromium, so layout can differ slightly from Phantom.
- Options are still the same shape for most fields (`format`, `orientation`, `border`, `header`, `footer`, `pdfChrome`).
- **Footer `contents`:** only one template is applied. We use `default`, else `first`, else `last`. Per-page keys (e.g. page `2`) are **not** supported in v4.
- **`phantomPath`**, **`phantomArgs`**, etc. are **ignored** (see `PdfRenderOptions` in types).
- `{{page}}` / `{{pages}}` in header/footer HTML are converted to Puppeteer’s print tokens automatically.

## Install

```bash
npm i pdf-creator-node
```

## Quick usage

```javascript
const pdf = require("pdf-creator-node");
const fs = require("fs");

const html = fs.readFileSync("template.html", "utf8");

const options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
};

const document = {
  html,
  data: { users: [{ name: "Ada", age: 36 }] },
  path: "./output.pdf",
  // type: ""  // optional; omit or use "" / "file" for file output
};

pdf
  .create(document, options)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

### TypeScript

```typescript
import pdf from "pdf-creator-node";
import type { PdfDocument, PdfCreateOptions } from "pdf-creator-node";

const document: PdfDocument = {
  html: "<p>{{title}}</p>",
  data: { title: "Hello" },
  path: "./out.pdf",
};

const options: PdfCreateOptions = {
  format: "A4",
  orientation: "portrait",
};

await pdf.create(document, options);
```

### Output type

- **File (default):** set `path`. You can omit `type`, or use `type: ""` or `type: "file"`.
- **Buffer:** `type: "buffer"`.
- **Stream:** `type: "stream"`.

### Layout, header, footer, and copyright (`pdfChrome`)

Use **`pdfChrome`** on the second argument for common paper layout and repeating header/footer. Plain `title` / `copyright` strings are HTML-escaped.

- **`layout`:** `format`, `orientation`, `width`, `height`, `border` (mapped to Puppeteer’s PDF / margin options).
- **`header`:** `html` (raw HTML per page) **or** `title` (centered text). Default height `45mm` when content is set.
- **`footer`:** `html` **or** combine **`copyright`** with optional **`showPageNumbers`** (`{{page}}` / `{{pages}}`). With `copyright` only, page numbers default **on** unless you set `showPageNumbers: false`. For **page numbers only**, set `showPageNumbers: true` and omit `copyright`. Default footer height `28mm` when content is set.

Anything you set directly on the options object (`format`, `header`, `footer`, …) **overrides** the matching field from `pdfChrome`.

```javascript
pdf.create(document, {
  pdfChrome: {
    layout: { format: "A4", orientation: "portrait", border: "12mm" },
    header: { title: "Quarterly report" },
    footer: { copyright: "© 2026 My Company", showPageNumbers: true },
  },
});
```

Advanced: `buildPdfChrome(pdfChrome)` returns partial `PdfRenderOptions` if you want to compose manually (also exported).

### Optional Handlebars helpers

Pass `handlebarsHelpers` on the **second** argument (alongside PDF options). Helpers apply only to that render (isolated Handlebars instance). Built-in `ifCond` is always registered.

```javascript
pdf.create(
  {
    html: "<p>{{upper name}}</p>",
    data: { name: "test" },
    path: "./out.pdf",
  },
  {
    format: "A4",
    handlebarsHelpers: {
      upper: (s) => String(s).toUpperCase(),
    },
  }
);
```

### Validation errors

You may see explicit errors such as:

- `document.html` must be a non-empty string
- `document.data` is required (use `{}` if there are no variables)
- `document.path` is required when writing a file (or use `buffer` / `stream`)
- `template rendering failed:` … (Handlebars compile/render issue)

## HTML template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hello world!</title>
  </head>
  <body>
    <h1>User List</h1>
    <ul>
      {{#each users}}
      <li>Name: {{this.name}}</li>
      <li>Age: {{this.age}}</li>
      {{/each}}
    </ul>
  </body>
</html>
```

## PDF options (Puppeteer)

Examples:

- **Size:** `"height": "10.5in"`, `"width": "8in"` (CSS units), **or** `"format": "Letter"` (A3, A4, A5, Legal, Letter, Tabloid) with `"orientation"`.
- **`border`:** margin around the page content (string or per-side object).
- **`header` / `footer`:** `contents` is HTML. In the footer, prefer **`contents.default`** for the repeating footer; `{{page}}` and `{{pages}}` work as with older versions (mapped for Chromium print).

```javascript
const options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
  header: {
    height: "45mm",
    contents: '<div style="text-align: center;">Author: Shyam Hajare</div>',
  },
  footer: {
    height: "28mm",
    contents: {
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
    },
  },
};
```

## `ifCond` helper

Compare two values in the template:

```handlebars
{{#ifCond inputData "===" toCheckValue}}
  …
{{/ifCond}}
```

Example with `each`:

```html
<ul>
  {{#each users}}
  <li>
    {{this.name}}
    {{#ifCond this.age "===" "26"}}
      (twenty-six)
    {{/ifCond}}
  </li>
  {{/each}}
</ul>
```

Supported operators: `==`, `===`, `!=`, `!==`, `<`, `<=`, `>`, `>=`, `&&`, `||`.

**Note:** Only two operands are compared per `ifCond`.

## License

[MIT](LICENSE)
