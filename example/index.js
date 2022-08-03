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

var users = [
  {
    name: "Shyam",
    age: "26",
  },
  {
    name: "Navjot",
    age: "26",
  },
  {
    name: "Vitthal",
    age: "26",
  },
];
var document = {
  html: html,
  data: {
    users: users,
  },
  path: "./output.pdf",
  type: "",
};
// By default a file is created but you could switch between Buffer and Streams by using "buffer" or "stream" respectively.

var document = {
  html: html,
  data: {
    users,
  },
  path: "./output.pdf",
  type: "", // "stream" || "buffer" || "" ("" defaults to pdf)
};

pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
