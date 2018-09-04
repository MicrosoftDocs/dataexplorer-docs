---
title: monaco-kusto - Azure Kusto | Microsoft Docs
description: This article describes monaco-kusto in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# monaco-kusto

Monaco-kusto provides kusto language support for the [monaco editor](https://microsoft.github.io/monaco-editor/).

## Installation


This package is not yet available externally, but we're working on it.

## Usage
1. add the following to your `index.html` (or other entry point)
    ```xml
    <script src="../node_modules/kusto-language-service/bridge.js"></script>
    <script src="../node_modules/kusto-language-service/kusto.javascript.client.js"></script>
    <script src="../node_modules/kusto-language-service/Kkusto.Language.Bridge.js"></script>
    ```

    This is done since this package has a dependency on `kusto-language-service` butfor now, `Bridge.Net` isn't capable of producing valid modules, with valid typescript typings.
1. `monaco-editor` and `monaco-kusto` need to be deployed to your site (usually they are loaded in runtime and not packaged together with the application)
1. once you have monaco-editor loaded (for example by using `require()`, you would also need to load `monaco-kusto`)
1. In order to provide schema to the library:
    ```javascript 
    const model = editor.getModel();
    const workerAccessor = await monaco.languages.kusto.getKustoWorker();
    this.worker = await workerAccessor(model.uri);
    await worker.setSchema(schema);
    ```
## Code Sample


Code samples are not yet avaiable externally, but we're working on it.

## Features
1. code completion (including documentation popup)
1. syntax highlighting
1. code formatting
1. code folding
1. validation (in experimental mode)
1. ~~go to definition~~ 
1. ~~hovers~~