var pdf = require("pdf-creator-node");
// var pdf = require("../index");
var fs = require("fs");
var path = require("path");
// Read HTML Template
var html = fs.readFileSync(path.join(__dirname, "./template.html"), "utf8");

var options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
};

const orders = [
  {
    order: 1,
    type: "Address",
    address: "Pune, Maharashtra",
  },
  {
    order: 2,
    type: "item",
    description: "Item 1",
    price: "30",
  },
  {
    order: 3,
    type: "Address",
    address: "Pune, Maharashtra",
  },
];

var document = {
  html: html,
  data: {
    orders,
  },
  path: "./output.pdf",
  type: "", // "stream" || "buffer" || "" ("" defaults to pdf)
};

console.log(document);
pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
