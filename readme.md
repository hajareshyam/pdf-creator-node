# Follow the following steps to convert HTML to pdf

- Step 1 - install the pdf creator packages by following command

    `$ npm i pdf-creator-node --save`

    > --save flag add  package name in packages.json file.

- Step 2 - Add required packages and read HTML template

    ```javascript
    //Required package
    var pdf = require("pdf-creator-node");
    var fs = require('fs');

    // Read HTML Template
    var html = fs.readFileSync('template.html', 'utf8');
    ```

- Step 3 - Create your HTML Template

    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <mate charest="utf-8" />
            <title>Hello world!</title>
        </head>
        <body>
            <h1>User List</h1>
            <ul>
                {{#each users}}
                <li>Name: {{this.name}}</li>
                <li>Age: {{this.age}}</li>
                <br>
            {{/each}}
            </ul>
        </body>
    </html>
    ```

- Step 4 - Provide Format and Orientation as per your need

    > "format": "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid

    >"orientation": "portrait", // portrait or landscape

    ```javascript
    var options = {
            format: "A3",
            orientation: "portrait",
            border: "10mm"
        };
    ```

- Step 5 - Provide HTML, User data and pdf path for output

    ```javascript
    var users = [
        {
            name:"Shyam",
            age:"26"
        },
        {
            name:"Navjot",
            age:"26"
        },
        {
            name:"Vitthal",
            age:"26"
        }
    ]
    var document = {
        html: html,
        data: {
            users: users
        },
        path: "./output.pdf"
    };
    ```

- Step 6 - After setting all parameters just pass document and options to pdf.create method.

    ```javascript
    pdf.create(document, options)
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        });
    ```

## Referance

Please refer following link if you want to use condition in html template

- https://handlebarsjs.com/builtin_helpers.html

### End
