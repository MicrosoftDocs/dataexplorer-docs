---
title:  Define schemas for semantic analysis with Kusto.Language
description: This article describes how to define schemas for semantic analysis with the Kusto.Language library.
ms.topic: reference
ms.date: 06/06/2023
---

# Define schemas for semantic analysis with Kusto.Language

[Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/) offers semantic analysis, which is a process that determines the specific entities referred to in a query and checks for any semantic errors. It allows you to identify the exact columns, variables, functions, or tables associated with different parts of the query syntax.

In order to perform semantic analysis, you need to define schemas for the entities referenced in your queries. This article explains how to define schemas directly or use schemas from the server.

## Symbols

In Kusto.Language, the process of defining symbols is a fundamental aspect of declaring schemas. It involves creating objects that represent tables and functions within your database, which are then used to construct a database object. Optionally, the database objects can be used to create a cluster object. This approach follows a bottom-up methodology, where lower-level entities are defined first, and then higher-level entities are constructed using these lower-level components.

Symbols can be thought of as schema entity objects that encapsulate the metadata and characteristics of tables and functions. Symbols act as placeholders or references for these entities within the schema definition. By using symbols, you can define the structure, properties, and relationships of the tables and functions in your database.

The following table overviews the symbols.

|Entity|Symbol syntax|
|--|--|
|Table|`new` `TableSymbol(`*TableName*`,` *TableSchema*`)`|
|Function|`new` `FunctionSymbol(`*FunctionName*`,` *FunctionParameters*, *FunctionDefinition*`)`|
|Database|`new` `DatabaseSymbol(`*DatabaseName*`,` *DatabaseEntity* [`,` ...]`)`|
|Cluster|`new` `ClusterSymbol(`*ClusterName*`,` *Database* [`,` ...]`)`|

## Declare schemas

This section shows how to define schemas with Kusto.Language. Once schemas are defined, the parser can use them to perform semantic analysis.

1. Create `TableSymbol` instances for each table in your database.

    The following example creates a `TableSymbol` for the `Shapes` table, which has three columns: `id`, `width`, and `height`.

    ```csharp
    var shapes = new TableSymbol("Shapes", "(id: string, width: real, height: real)");
    ```

1. Create `FunctionSymbol` instances for each function in your database.

    The following example creates a `FunctionSymbol` for a function called `TallShapes` and another symbol for a function called `ShortShapes`. The `TallShapes` function takes no arguments, and returns all rows in which the `width` column value is smaller than the `height` column value in the `Shapes` table. The `ShortShapes` function takes a single argument, `maxHeight`. The function returns all rows in which the value in the `height` column is less than the `maxHeight` provided.

    ```csharp
    var tallshapes = new FunctionSymbol("TallShapes", "{ Shapes | width < height; }");
    var shortshapes = new FunctionSymbol("ShortShapes", "(maxHeight: real)", "{ Shapes | height < maxHeight; }");
    ```

1. Declare a `DatabaseSymbol` with the created `TableSymbol` and `FunctionSymbol` instances.

    The following example creates a `DatabaseSymbol` for a database named `mydb`. The database `mydb` contains the three previously created symbols for the shapes table, the tall shapes function, and the short shapes function.

    ```csharp
    var mydb = new DatabaseSymbol("mydb", shapes, tallshapes, shortshapes);
    ```

1. Add the `DatabaseSymbol` to the `GlobalState`. The `GlobalState` provides the cluster and database context for the parser.

    ```csharp
    var globalsWithMyDb = GlobalState.Default.WithDatabase(mydb);
    ```

1. Use the returned `GlobalState`, in this case `globalsWithMyDb`, to perform semantic analysis.

    The following query will use the schemas of the entities in `mydb` to parse the query with semantic analysis.

    ```csharp
    var query = "Shapes | where width > 10.0";
    var code = KustoCode.ParseAndAnalyze(query, globalsWithMyDb);
    ```

## Use schemas from the server

If you already have a database, manually declaring all the entity schemas can be a tedious and unnecessary task. Instead, you can query the database and retrieve the required schema information. The [Kusto.Toolkit](https://www.nuget.org/packages/Kusto.Toolkit/) library provides APIs to load symbols directly from your cluster.

## Work with multiple databases or clusters

1. To include multiple databases in your `GlobalState`, create a `ClusterSymbol`.

    The following example creates a cluster that contains the `DatabaseSymbol` from the previous section.

    ```csharp
    var mycluster = new ClusterSymbol("mycluster.kusto.windows.net", mydb);
    ```

1. Add the `ClusterSymbol` to the `GlobalState` as the default cluster with a default database, or add it as an extra cluster. Access any nondefault clusters or databases using the `cluster()` or `database()` functions.

    ```csharp
    // Option 1: Add the cluster as the default with a specified default database.
    var globalsWithMyDefaultCluster = GlobalState.Globals.WithCluster(mycluster).WithDatabase(mydb);
    // Option 2: Add the cluster to the list of known clusters.
    var globalsWithMyClusterAdded = GlobalState.Globals.AddOrReplaceCluster(mycluster);
    ```

1. Use the relevant globals in the `ParseAndAnalyze` method to [parse a query with semantic analysis](kusto-language-parse-queries.md#parse-a-query-with-semantic-analysis).

## Add built-in functions and aggregates

Even if functions don't exist in the server, you can add them to the global state instance when you call the `ParseAndAnalyze` method.

The following example adds a fake `minmax` function for use in the query analysis.

```csharp
var fnMinMax = new FunctionSymbol("minmax", ScalarTypes.Real, new Parameter("x", ScalarTypes.Real));
var globals = GlobalState.Default.WithAggregates(globals.Aggregates.Concat(new [] {fnMinMax}).ToArray());
var code = KustoCode.ParseAndAnalyze("T | summarize minmax(c)", globals);
```

> [!NOTE]
> If you remove functions or aggregates from the global state, the parser will produce an error when they're used.

## Next steps

* [Parse queries and commands](kusto-language-parse-queries.md)
* See the [source code](https://github.com/microsoft/Kusto-Query-Language)
