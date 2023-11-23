---
title:  Define schemas for semantic analysis with Kusto.Language
description: This article describes how to define schemas for semantic analysis with the Kusto.Language library.
ms.topic: reference
ms.date: 06/29/2023
---

# Define schemas for semantic analysis with Kusto.Language

[Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/) includes semantic analysis capabilities that identify and associate entities such as columns, variables, functions, and tables with the different parts of the query syntax. Semantic analysis also performs checks for semantic errors to help ensure the correctness of your queries.

In order to perform semantic analysis, you need to define schemas for the entities referenced in your queries. This article explains how to define schemas directly or use schemas from the server.

## Symbols

In Kusto.Language, the process of defining symbols is a fundamental aspect of declaring schemas. It involves creating objects that represent tables and functions within your database, which are then used to construct a database object. Optionally, the database objects can be used to create a cluster object. This approach follows a bottom-up methodology, where lower-level entities are defined first, and then higher-level entities are constructed using these lower-level components.

The following table overviews the symbols.

|Entity|Symbol syntax|
|--|--|
|Table|`new` `TableSymbol(`*TableName*`,` *TableSchema*`)`|
|Function|`new` `FunctionSymbol(`*FunctionName*`,` *FunctionParameters*, *FunctionDefinition*`)`|
|Database|`new` `DatabaseSymbol(`*DatabaseName*`,` *DatabaseEntity* [`,` ...]`)`|
|Cluster|`new` `ClusterSymbol(`*ClusterName*`,` *Database* [`,` ...]`)`|

## Declare schemas

This section shows how to declare and use table, function, and database symbols to define the schema used by the parser for semantic analysis.

The following steps outline how to create and use the symbols. Then, the code sample demonstrates these steps in action.

1. Create `TableSymbol` instances for each table in your database.
1. Create `FunctionSymbol` instances for each function in your database.
1. Declare a `DatabaseSymbol` that includes the previously created `TableSymbol` and `FunctionSymbol` instances.
1. Add the `DatabaseSymbol` to the `GlobalState`, which provides the cluster and database context for the parser.
1. Use the returned global state in the `ParseAndAnalyze` method to [parse a query with semantic analysis](kusto-language-parse-queries.md#parse-a-query-with-semantic-analysis).

```csharp
// 1. Define the schema for the Shapes table, including its columns: id, width, and height.
var shapes = new TableSymbol("Shapes", "(id: string, width: real, height: real)");

// 2. Define the functions TallShapes and ShortShapes with their respective parameters and logic.
var tallshapes = new FunctionSymbol("TallShapes", "{ Shapes | width < height; }");
var shortshapes = new FunctionSymbol("ShortShapes", "(maxHeight: real)", "{ Shapes | height < maxHeight; }");

// 3. Create a database symbol named "mydb" and include the previously defined symbols.
var mydb = new DatabaseSymbol("mydb", shapes, tallshapes, shortshapes);

// 4. Add the database symbol to the global state and set it as the default database.
//    A cluster symbol is also created to contain the database, and that cluster is set as the default.
var globalsWithMyDb = GlobalState.Default.WithDatabase(mydb);

// 5. Use the schemas to parse and perform semantic analysis on the query.
var query = "Shapes | where width > 10.0";
var code = KustoCode.ParseAndAnalyze(query, globalsWithMyDb);
```

## Use schemas from the server

If you already have a database, manually declaring all the entity schemas can be a tedious and unnecessary task. Instead, you can query the database and retrieve the required schema information. The [Kusto.Toolkit](https://www.nuget.org/packages/Kusto.Toolkit/) library provides APIs to load symbols directly from your cluster.

The following example uses the `SymbolLoader` family of classes to access database schemas directly from the cluster.

```csharp
// Find available databases.
var connection = new KustoConnectionStringBuilder(...);
var loader = new ServerSymbolLoader(connection);
var names = await loader.LoadDatabaseNamesAsync();

// Load database schema into a symbol.
var loader = new ServerSymbolLoader(connection);
var db = await loader.LoadDatabaseAsync(dbName);

// Load database schema into the global state as the default database.
var globals = GlobalState.Default;
var loader = new ServerSymbolLoader(connection);
var globalsWithDB = await loader.AddOrUpdateDefaultDatabaseAsync(globals, dbName);
var parsed = KustoCode.ParseAndAnalyze(query, globalsWithDB);
```

For more examples, see [SymbolLoader](https://github.com/mattwar/Kusto.Toolkit/blob/master/src/Toolkit/docs/SymbolLoader.md) and [SymbolResolver](https://github.com/mattwar/Kusto.Toolkit/blob/master/src/Toolkit/docs/SymbolResolver.md).

## Work with multiple databases or clusters

1. To include multiple databases in your `GlobalState`, create a `ClusterSymbol`.

    The following example creates a cluster that contains the `DatabaseSymbol` from the previous section.

    ```csharp
    var mycluster = new ClusterSymbol("mycluster.kusto.windows.net", mydb);
    ```

1. Add the `ClusterSymbol` to the `GlobalState` as the default cluster with a default database, or add it as an extra cluster. Access any nondefault clusters or databases using the [cluster()](../../query/clusterfunction.md) or [database()](../../query/databasefunction.md) functions.

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

## Related content

* [Parse queries and commands](kusto-language-parse-queries.md)
* See the [source code](https://github.com/microsoft/Kusto-Query-Language)
