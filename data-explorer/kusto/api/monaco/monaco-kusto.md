---
title: Integrate the Monaco Editor with Kusto Query Language support in your app
description: Learn how to integrate the Monaco Editor with Kusto query support in your app.
ms.reviewer: izlisbon
ms.topic: how-to
ms.date: 11/22/2022
---
# Integrate the Monaco Editor with Kusto Query Language support in your app

You can integrate the [Monaco Editor](https://microsoft.github.io/monaco-editor) with Kusto Query Language support (*monaco-kusto*) into your app. Integrating *monaco-kusto* into your app offers you an editing experience such as completion, colorization, refactoring, renaming, and go-to-definition. It requires you to build a solution for authentication, query execution, result display, and schema exploration. It offers you full flexibility to fashion the user experience that fits your needs.

In this article, you'll learn how to add *monaco-kusto* to the Monaco Editor and integrate it into your app. The package is available on [GitHub](https://github.com/Azure/monaco-kusto) and on *npm*.

Use the following steps to integrate *monaco-kusto* into your app using *npm*.

**Step 1**: [Install the *monaco-kusto* package](#install-the-monaco-kusto-package)

**Step 2**: [Set up your app to use the *monaco-kusto* package](#set-up-your-app-to-use-the-monaco-kusto-package)

**Step 3**: [Add your database schema to the editor](#add-your-database-schema-to-the-editor)

Try out the integration with our [Sample project](#sample-project)!

## Prerequisites

- [Node.js](https://nodejs.org/) (v6.10.3 or later)

## Install the *monaco-kusto* package

1. Install the Monaco Editor npm package:

    ```bash
    npm i monaco-editor
    ```

    > [!NOTE]
    > To customize the native Monaco Editor, see [Monaco Editor GitHub repo](https://github.com/microsoft/monaco-editor).

1. Install the *monaco-kusto* npm package:

    ```bash
    npm i @kusto/monaco-kusto
    ```

## Set up your app to use the *monaco-kusto* package

You can set up your app to use *monaco-kusto* using one of the following methods:

### [AMD module system](#tab/amd)

1. Add the following HTML to pages where the Monaco Editor is used, such as your *index.html* file. They're required due to a dependency the package has on `kusto-language-service`.

    ```html
    <script src="%PUBLIC_URL%/monaco-editor/min/vs/language/kusto/bridge.min.js"></script>
    <script src="%PUBLIC_URL%/monaco-editor/min/vs/language/kusto/kusto.javascript.client.min.js"></script>
    <script src="%PUBLIC_URL%/monaco-editor/min/vs/language/kusto/newtonsoft.json.min.js"></script>
    <script src="%PUBLIC_URL%/monaco-editor/min/vs/language/kusto/Kusto.Language.Bridge.min.js"></script>
    ```

1. Copy the static files from the *monaco* and *monaco-kusto* packages to the **monaco-editor** folder on your web server. Your app will need to access these static files.
1. Use monaco to load them. For examples, see the [samples](https://github.com/Azure/monaco-kusto/tree/master/samples).

### [ESM (webpack)](#tab/esm)

The following steps describe how to set up your app to use *monaco-kusto* using webpack. The default entry point for a project is the *src/index.js* file and the default configuration file is the *src/webpack.config.js* file. The following steps assume that you're using the default webpack project setup to bundle your app.

1. In the configuration file, add the following snippets:
    1. Under **resolve.alias**, add the following aliases:

        ```javascript
        'vs/language/kusto/kustoMode': 'kustoMode',
        'bridge.min': '@kusto/monaco-kusto/release/esm/bridge.min',
        'kusto.javascript.client.min': '@kusto/monaco-kusto/release/esm/kusto.javascript.client.min.js',
        'Kusto.Language.Bridge.min': '@kusto/monaco-kusto/release/esm/Kusto.Language.Bridge.min.js',
        'Kusto': '@kusto/monaco-kusto/release/esm/Kusto.Language.Bridge.min.js',
        'monaco.contribution': '@kusto/monaco-kusto/release/esm/monaco.contribution'
        ```

    1. Under **module.rules**, add the following loaders and dependencies:

        ```javascript
        // Loaders
        { test: /bridge\.js/, parser: { system: false } },
        { test: /kusto\.javascript\.client\.min\.js/, parser: { system: false } },
        { test: /Kusto\.Language\.Bridge\.min\.js/, parser: { system: false } },
        { test: /kustoLanguageService/, parser: { system: false } },
        // Dependencies
        { test: /Kusto\.Language\.Bridge\.min/, loader: 'exports-loader?window.Kusto!imports-loader?bridge.min,kusto.javascript.client.min' },
        { test: /kustoMonarchLanguageDefinition/, loader: 'imports-loader?Kusto' },
        ```

    1. Under **entry**, add the following entry point. Make a note the worker path returned, you'll need it later.

        ```javascript
        `@kusto/monaco-kusto/release/esm/kusto.worker.js`
        ```

1. In the *KustoLanguageService-loader.js* file, add the following custom loader. It replaces the use of `importScripts` in the configuration file:

    ```javascript
    module.exports = function loader(source) {
        source = `var Kusto = require("@kusto/language-service-next/Kusto.Language.Bridge.min");\n${source}`;

        return source.replace(/importScripts.*/g,'');;
    }
    ```

1. In your app, add the following code:

    1. Define the **MonacoEnvironment** function on your `window` object. Replace `<path_and_full_name_of_kusto_worker>` with the worker path you noted earlier.

        ```javascript
        window.MonacoEnvironment = { globalAPI: true, getWorkerUrl: function() { return "<path_and_full_name_of_kusto_worker>"} };
        ```

    1. Create the `monaco.editor` object from an HTML element:

        ```javascript
        this.editor = monaco.editor.create(editorElement, editorConfig)
        ```

    1. Call the `monaco.contribution` API to register the Kusto language:

        ```javascript
        import('monaco.contribution').then(async (contribution: any) => {
            const model = this.monaco && this.monaco.editor.createModel("", 'kusto');
            this.editor.setModel(model);
            const workerAccessor: monaco.languages.kusto.WorkerAccessor = await monaco.languages.kusto.getKustoWorker();
            const worker: monaco.languages.kusto.KustoWorker = await workerAccessor(model.uri);
        })
        ```

---

## Add your database schema to the editor

The *monaco-kusto* package provides a way to add your database schema to the editor. The schema enables the editor to provide auto-complete suggestions and other features.

Use the following structure to define the schema:

```javascript
const schema = {... <YOUR_DATABASE_SCHEMA> ...};

export function setSchema(editor) {
  window.monaco.languages.kusto.getKustoWorker().then((workerAccessor) => {
    const model = editor.getModel();
    workerAccessor(model.uri).then((worker) => {
      //EITHER: Set schema from a show schema command
      // worker.setSchemaFromShowSchema(
      //     schema,
      //     clusterURI,
      //     database
      // );
      //OR: Set schema from a manually created schema
      // worker.setSchema(schema);
    });
  });
}
```

You can get your database schema using one of the following methods:

### [From your cluster](#tab/show)

1. In the Azure Data Explorer web UI, on the left menu, select **Query**.
1. Select the database for which you want to create a schema.
1. In the query window, run the following query:

    ```kusto
    .show schema as json
    ```

1. Copy the result of the query and paste it as the **schema** constant. The result of the query is a list of databases (see interface `Result` in the *schema.ts* file).
1. Use the `setSchemaFromShowSchema()` method to set the schema in the editor. You  must also specify the cluster URI and the name of the database to use in the editor.

### [Create manually](#tab/manual)

1. Create a schema object that contains the database schema. For more information, see the `clusterType` interface in the *src/schema.ts* file. The following example shows a schema object that contains a single database and a single table:

    ```json
    {
      "clusterType":"Engine",
      "cluster":{
        "connectionString":"<CONNECTION_STRING>",
        "databases":[ {
          "database": {
            "name": "<DATABASE_NAME>",
            "majorVersion": 5,
            "minorVersion": 0,
            "tables": [ {
              "name": "<TABLE_NAME>",
              "entityType": "Table",
              "columns": [ {
                "name": "<COLUMN_NAME>",
                "type": "<COLUMN_TYPE>"
              }, ... ]
            }, ... ]
          }
        }, ... ]
      },
      // Defines schema for the required database.
      // The schema must also be defined in the cluster object.
      "database": {
        "name": "<DATABASE_NAME>",
        "majorVersion": 5,
        "minorVersion": 0,
        "tables": [ {
          "name": "<TABLE_NAME>",
          "entityType": "Table",
          "columns": [ {
            "name": "<COLUMN_NAME>",
            "type": "<COLUMN_TYPE>"
          }, ... ]
        }, ... ]
      }
    }
    ```

1. Use the `setSchema()` method to set the schema in the editor.

---

## Sample project

You can find a sample project that uses the *monaco-kusto* package. To use the sample, clone the [*monaco-kusto* GitHub repo](https://github.com/Azure/monaco-kusto). You'll find the sample in the *samples/react* folder.

### Set up and test your sample project

Run the following commands from the root of the cloned repo:

1. Install dependencies and build the project:

    ```bash
    npm install
    ```

1. Verify the project is working. If successful, the *index.html* will open.

    ```bash
    npm run watch
    ```

## Related content

- [Kusto Query Language (KQL) overview](../../query/index.md)
- [Write Kusto queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
