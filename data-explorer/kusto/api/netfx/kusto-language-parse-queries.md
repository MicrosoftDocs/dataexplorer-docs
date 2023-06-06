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

The following steps provide an example of how to parse and navigate a parsed query.

1. Provide your query as an argument to the `KustoCode.Parse` method as a string. The following example returns a `KustoCode` instance that contains the parsed syntax tree.

    ```csharp
    var query = "T | project a = a + b | where a > 10.0";
    var code = KustoCode.Parse(query);
    ```

1. Navigate the tree using a variety of API's, such as `GetDescendants`, `GetAncestors`, `GetChild`, `Parent`, `WalkNodes`, `GetTokenAt`, or `GetNodeAt`. The following example finds all the places where the name `a` was referenced.

    ```csharp
    var referencesToA = code.Syntax.GetDescendants<NameReference>(n => n.SimpleName == "a");
    Assert.AreEqual(2, referencesToA.Count);
    ```
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
