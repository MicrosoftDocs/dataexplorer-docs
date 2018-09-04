---
title: The Kusto.IntelliSense JavaScript Library - Azure Kusto | Microsoft Docs
description: This article describes The Kusto.IntelliSense JavaScript Library in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# The Kusto.IntelliSense JavaScript Library

The Kusto.IntelliSense is a JavaScript client library for doing Kusto query language
IntelliSense and syntax highlighting.

> [!WARNING]
> For performance and complexity reasons, the parser used by Kusto.IntelliSense
> is only an approximation to the parser used by the service itself. Therefore,
> it does not promise 100% accurate results in tokenization and syntax validation.
> It's use should be limited to providing end-users with quick-and-potentially-inaccurate
> feedback during query authoring or viewing.

The code behind is written on C# and is available as part of [Kusto Client Library](../using-the-kusto-client-library.md) 
for .NET developers. The JavaScript library takes dependency on [Bridge.NET](http://bridge.net) open-source 
components for C#-to-JavaScript cross-compilation.

## Getting the package
the packaeg is published to the [kusto npm pacakge feed](https://1essharedassets.visualstudio.com/1esPkgs/_packaging?feed=Kusto&_a=feed).
to intstall it, connect to the feed and then run `npm install --save @kusto/language-service` 

Inside the ZIP package, you will find inside both minimized and non-minimized versions of JavaScript components.

currently (due to Bridge.net limitations), this is not an actual javascript module, in order to use the code you should include the required files in a `<script>` tag in your index.html file.

## Package Contents

1.	Dependencies
2.	IntelliSense and Syntax Highlighting libraries
3.	Unit tests
4.	Demo.html and JavaScript that constructs all together (by running unit-tests)

Here is the content of $\Bridge\www\demo.html

```html
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>Bridge Kusto.JavaScript.Client</title>
    <script src="../output/bridge.js"></script>
    <script src="../output/Kusto.JavaScript.Client.js"></script>
</head>
<body>
    <!--
        Right-Click on this file and select "View in Browser"
    -->
    <script>
        Bridge.ready(Kusto.JavaScript.Client.App.Test)
    </script>
</body>
</html>
```