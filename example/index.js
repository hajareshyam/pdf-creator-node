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
    users,
  },
  path: "./output.pdf",
  type: "buffer", // "stream" || "buffer" || "" ("" defaults to pdf)
};

const generator = async () => {
  try {
    const genpdf = await pdf.create(document, options)
    var utf8encoded = Buffer.from(genpdf, 'base64').toString('base64');
    fs.writeFileSync('result.txt', utf8encoded);
    console.log(utf8encoded);
  } catch (error) {
    console.log(error);
  }
}
generator()
