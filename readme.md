# Follow these steps to convert HTML to PDF

- Step 1 - install the pdf creator package using the following command

  `$ npm i pdf-creator-node --save`

  > --save flag adds package name to package.json file.

- Step 2 - Add required packages and read HTML template

  ```javascript
  //Required package
  var pdf = require("pdf-creator-node");
  var fs = require("fs");

  // Read HTML Template
  var html = fs.readFileSync("template.html", "utf8");
  ```

- Step 3 - Create your HTML Template

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
        <br />
        {{/each}}
      </ul>
    </body>
  </html>
  ```

- Step 4 - Provide format and orientation as per your need

  > "height": "10.5in", // allowed units: mm, cm, in, px

  > "width": "8in", // allowed units: mm, cm, in, px

  - or -

  > "format": "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid

  > "orientation": "portrait", // portrait or landscape

    ```javascript
        var options = {
            format: "A3",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "45mm",
                contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
            },
            footer: {
                height: "28mm",
                contents: {
                    first: 'Cover page',
                    2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            }
        };
    ```
    
- Step 5 - Provide HTML, user data and PDF path for output

  ```javascript
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
  ```

- Step 6 - After setting all parameters, just pass document and options to `pdf.create` method.

  ```javascript
  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
  ```

## Reference

Please refer to the following if you want to use conditions in your HTML template:

- https://handlebarsjs.com/builtin_helpers.html

### End

### License

pdf-creator-node is [MIT licensed](./LICENSE).
