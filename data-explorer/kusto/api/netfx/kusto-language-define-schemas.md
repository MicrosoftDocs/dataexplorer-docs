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

    Now, you can use `globalsWithMyDb` to [Perform semantic analysis](#perform-semantic-analysis).

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

## Use schemas from the server

If you already have a database, manually declaring all the entity schemas can be a tedious and unnecessary task. Instead, you can query the database and retrieve the required schema information. The [Kusto.Toolkit](https://www.nuget.org/packages/Kusto.Toolkit/) library provides APIs to load symbols directly from your cluster.

## Perform semantic analysis

To parse with semantic analysis, use the `KustoCode.ParseAndAnalyze` method. This method allows you to specify a `GlobalState` instance that contains the definition for the database tables and functions that the query may reference. These definitions are called symbols.

The following example uses the `globalsWithMyDb` from the [Declare schemas](#declare-schemas) section.

```csharp
var query = "Shapes | project width = height / 2 | where width > 10.0";
var code = KustoCode.ParseAndAnalyze(query, globals);
```

Now when you navigate the syntax tree you can access the `ReferencedSymbol` and `ResultType` properties that tell you what is being referenced and the type of any expression.

For this example, check the `ReferencedSymbol` property to see if it matches the instance of the `ColumnSymbol` that was defined as part of table `Shapes` when you declared the schema.

```csharp
// Search syntax tree for references to specific columns.
var widthColumn = globals.Database.Tables.First(t => t.Name == "Shapes").GetColumn("width");
var referencesToWidth = code.Syntax.GetDescendants<NameReference>(n => n.ReferencedSymbol == widthColumn);

// There's only one reference to the column named "width" from the table "Shapes".
Assert.AreEqual(1, referencesToWidth.Count);
```
