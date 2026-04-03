/**
 * Example: generate a PDF from a Handlebars HTML template.
 * Depends on the parent package: from `example/` run `npm install` then `npm start`.
 * Uses the public API only (`require("pdf-creator-node")` — same as consumers).
 */

const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");

/**
 * Options use pdfChrome for layout + repeating header/footer (copyright + page numbers).
 * You can still set format/header/footer directly on options — they override pdfChrome.
 */
const options = {
  pdfChrome: {
    layout: {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
    },
    header: { title: "User list" },
    footer: {
      copyright: "© pdf-creator-node example",
      showPageNumbers: true,
    },
  },
};

const users = [
  { name: "Shyam", age: "26" },
  { name: "Navjot", age: "26" },
  { name: "Vitthal", age: "26" },
];

/** Default is file output. Use type: "buffer" | "stream" for in-memory output. */
const document = {
  html,
  data: { users },
  path: path.join(__dirname, "output.pdf"),
  type: "",
};

async function main() {
  try {
    const res = await pdf.create(document, options);
    console.log(res);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
