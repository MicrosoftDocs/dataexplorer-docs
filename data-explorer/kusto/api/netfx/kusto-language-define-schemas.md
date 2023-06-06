---
title:  Define schemas for semantic analysis with Kusto.Language
description: This article describes how to define schemas for semantic analysis with the Kusto.Language library.
ms.topic: reference
ms.date: 06/06/2023
---

# Define schemas for semantic analysis with Kusto.Language

[Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/) offers semantic analysis, which is a process that determines the specific entities referred to in a query and checks for any semantic errors. It allows you to identify the exact columns, variables, functions, or tables associated with different parts of the query syntax.

In order to perform semantic analysis, define schemas for the entities referenced in your queries. This article explains how to define schemas directly or use schemas from the server.

## Get started

1. Install [Microsoft.Azure.Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/).

1. Include the following namespaces in your code:

    ```csharp
    using Kusto.Language;
    using Kusto.Language.Symbols;
    using Kusto.Language.Syntax;
    ```

## Declare schemas

To make sure that the parser recognizes your specific database, tables, and functions, you need to declare the schemas of these entities as shown in the following steps.

1. Create `TableSymbol` instances for each table in your database. For example:

    ```csharp
    var shapes = new TableSymbol("Shapes", "(id: string, width: real, height: real)");
    ```

1. Create `FunctionSymbol` instances for each function in your database. For example:

    ```csharp
    var tallshapes = new FunctionSymbol("TallShapes", "{ Shapes | width < height; }");
    var shortshapes = new FunctionSymbol("ShortShapes", "(maxHeight: real)", "{ Shapes | height < maxHeight; }");
    ```

1. Declare a `DatabaseSymbol` with the created `TableSymbol` and `FunctionSymbol` instances. For example:

    ```csharp
    var mydb = new DatabaseSymbol("mydb", shapes, tallshapes, shortshapes);
    ```

1. Add the DatabaseSymbol to the GlobalState.

    ```csharp
    var globalsWithMyDb = GlobalState.Default.WithDatabase(mydb);
    ```

1. Use `globalsWithMyDb` to perform semantic analysis. For example:

    ```csharp
    var query = "Shapes | where width > 10.0";
    var code = KustoCode.ParseAndAnalyze(query, globalsWithMyDb);
    ```

## Use schemas from the server

If you already have a database, manually declaring all the entity schemas can be a tedious and unnecessary task. Instead, you can query the database and retrieve the required schema information. The [Kusto.Toolkit](https://www.nuget.org/packages/Kusto.Toolkit/) library provides APIs to load symbols directly from your cluster.

## Work with multiple databases or clusters

1. If you need to include multiple databases, create a `ClusterSymbol`. For example:

    ```csharp
    var mycluster = new ClusterSymbol("mycluster.kusto.windows.net", mydb);
    ```

1. Add the `ClusterSymbol` to the `GlobalState` as the default cluster with a default database, or add it as an additional cluster. Access any non-default clusters or databases using the `cluster()` or `database()` functions.

    ```csharp
    // Option 1: Add the cluster as the default with a specified default database.
    var globalsWithMyDefaultCluster = GlobalState.Globals.WithCluster(mycluster).WithDatabase(mydb);
    // Option 2: Add the cluster to the list of known clusters.
    var globalsWithMyClusterAdded = GlobalState.Globals.AddOrReplaceCluster(mycluster);
    ```

1. Use the relevant globals in the `ParseAndAnalyze` method to perform semantic analysis.

## Next steps

* [Parse queries and commands](kusto-language-parse-queries.md)
* See the [source code](https://github.com/microsoft/Kusto-Query-Language)
