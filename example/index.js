var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");

var html = fs.readFileSync(path.join(__dirname, "./template.html"), "utf8");

/**
 * Options use pdfChrome for layout + repeating header/footer (copyright + page numbers).
 * You can still set format/header/footer directly on options — they override pdfChrome.
 */
var options = {
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

var users = [
  { name: "Shyam", age: "26" },
  { name: "Navjot", age: "26" },
  { name: "Vitthal", age: "26" },
];

// Default is file output. Use type: "buffer" | "stream" for in-memory output.
var document = {
  html: html,
  data: { users },
  path: "./output.pdf",
  type: "",
};

pdf
  .create(document, options)
  .then(function (res) {
    console.log(res);
  })
  .catch(function (error) {
    console.error(error);
  });
