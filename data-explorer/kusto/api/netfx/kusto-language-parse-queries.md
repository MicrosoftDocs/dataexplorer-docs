---
title:  Parse queries and commands with Kusto.Language
description: This article describes how to parse queries and commands with the Kusto.Language library.
ms.topic: reference
ms.date: 06/05/2023
---

# Parse queries and commands with Kusto.Language

With [Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/), you can parse queries and management commands to access a structured syntax tree. This article outlines the fundamental concepts and methods needed to parse queries with Kusto.Language.

## Get started

1. Install [Microsoft.Azure.Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/).

1. Include the following namespaces in your code:

    ```csharp
    using Kusto.Language;
    using Kusto.Language.Symbols;
    using Kusto.Language.Syntax;
    ```

## Parse a query

## Parse a query with semantic analysis

## Check a parsed query for errors

Use the `GetDiagnostics` method to identify syntactic and semantic errors in your queries. For queries that are parsed without semantic analysis, only syntax errors will be found.

The following example shows how to parse a query and check it for errors.

```csharp
// Parse a query.
var query = "T | project a = a + b | where a > 10";
var code = KustoCode.Parse(query);

// Check if the query has any syntax errors.
var diagnostics = code.GetDiagnostics();

// Investigate and handle the errors.
if (diagnostics.Count > 0) { ... }
```

> [!NOTE]
> Check the `Severity` property to see if the diagnostic is an error, warning, or another type of diagnostic.
