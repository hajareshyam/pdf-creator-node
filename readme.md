# pdf-creator-node

Convert **HTML + Handlebars** templates to **PDF** in Node.js (via [html-pdf](https://www.npmjs.com/package/html-pdf)).

**Requirements:** [Node.js](https://nodejs.org/) 18 or newer.

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

Use **`pdfChrome`** on the second argument for common paper layout and repeating header/footer without hand-writing `html-pdf` structures. Plain `title` / `copyright` strings are HTML-escaped.

- **`layout`:** `format`, `orientation`, `width`, `height`, `border` (same meaning as [html-pdf](https://www.npmjs.com/package/html-pdf) / Phantom paper size).
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

Advanced: `buildPdfChrome(pdfChrome)` returns partial html-pdf options if you want to compose manually (also exported from the package).

### Optional Handlebars helpers

Pass `handlebarsHelpers` on the **second** argument (alongside `html-pdf` options). Helpers apply only to that render (isolated Handlebars instance). Built-in `ifCond` is always registered.

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

## PDF options (html-pdf)

Examples:

- **Size:** `"height": "10.5in"`, `"width": "8in"` (units: mm, cm, in, px)
- **Or:** `"format": "Letter"` (A3, A4, A5, Legal, Letter, Tabloid) and `"orientation": "portrait"` or `"landscape"`

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
      first: "Cover page",
      2: "Second page",
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
      last: "Last Page",
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
