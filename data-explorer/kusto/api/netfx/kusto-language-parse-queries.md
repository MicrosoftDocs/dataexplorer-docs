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

Semantic analysis allows you to identify the exact columns, variables, functions, or tables associated with different parts of the query syntax.

In the previous section, there wasn't a distinction made between the column `a` declared by the `project` operator and the column `a` that originally existed in the table. In order to correctly distinguish between the two, have the parser perform semantic analysis.

The following steps provide an example of how to perform semantic analysis with the parser.

1. [Define schemas](kusto-language-define-schemas.md) for the entities referenced in your queries.

    ```csharp
    var globals = GlobalState.Default.WithDatabase(
        new DatabaseSymbol("db",
        new TableSymbol("T", "(a: real, b: real)")));
    ```

1. Use the `KustoCode.ParseAndAnalyze` method with the globals that contain the relevant entity schemas.

    ```dotnetcli
    var query = "T | project a = a + b | where a > 10.0";
    var code = KustoCode.ParseAndAnalyze(query, globals);
    ```

1. Navigate the tree and access new properties, such as `ReferencedSymbol` and `ResultType`. The following example uses the ReferencedSymbol property to check how many times the column `a` from the original table was referenced.

    ```csharp
    var columnA = globals.Database.Tables.First(t => t.Name == "db").GetColumn("a");
    var referencesToA = code.Syntax.GetDescendants<NameReference>(n => n.ReferencedSymbol == columnA);
    Assert.AreEqual(1, referencesToA.Count);
    ```

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

## Find the table for a column

If a column is part of a database table, find that table using the `GetTable` method on the `GlobalState` that includes the database table definition.

```csharp
var table = code.Globals.GetTable(column);
```

## Find the database for a table

If a table symbol is declared as part of a database, discover which database is associated with the table using the `GetDatabase` method on the `GlobalState` that includes the definition of the database and table.

```csharp
var database = code.Globals.GetDatabase(table);
```

## Find the cluster for a database

Find the cluster that a database belongs to using the `GetCluster` method on the `GlobalState` that includes the definition of both the cluster and database symbols.

```csharp
var cluster = code.Globals.GetCluster(database);
```

## Next steps

* Use [Kusto.Toolkit](https://www.nuget.org/packages/Kusto.Toolkit/) to find all of the columns or tables referenced in a query
