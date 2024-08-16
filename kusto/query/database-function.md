---
title:  database()
description: Learn how to use the database() function to change the reference of the query to a specific database.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# database()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

:::moniker range="azure-data-explorer"
Changes the reference of the query to a specific database within the cluster scope.

> [!NOTE]
>
> * For more information, see [cross-database and cross-cluster queries](cross-cluster-or-database-queries.md).
> * For accessing remote cluster and remote database, see [`cluster()`](cluster-function.md) scope function.
:::moniker-end

:::moniker range="microsoft-fabric"
Changes the reference of the query to a specific database within the Eventhouse scope.
<!-- add link in the note to the Cross-database and cross-Eventhouse doc once it is created -->
> [!NOTE]
>
> * For accessing remote cluster and remote database, see [`cluster()`](cluster-function.md) scope function.
:::moniker-end
``

## Syntax

`database(`*databaseName*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *databaseName* | `string` | The name of the database to reference. The *databaseName* can be either the `DatabaseName` or `PrettyName`. The argument must be a constant value and can't come from a subquery evaluation.|

## Examples

### Use database() to access table of other database

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLElMSixO1VAPTswtyEktVtfUCy7JL8p1LUvNKylWqFFIzi/NKwEAS+mhvycAAAA=" target="_blank">Run the query</a>
:::moniker-end

```kusto
database('Samples').StormEvents | count
```

**Output**

|Count|
|---|
|59066|

### Use database() inside let statements

The query above can be rewritten as a query-defined function (let statement) that
receives a parameter `dbName` - which is passed into the database() function.

```kusto
let foo = (dbName:string)
{
    database(dbName).StormEvents | count
};
foo('help')
```

**Output**

|Count|
|---|
|59066|

### Use database() inside stored functions

The same query as above can be rewritten to be used in a function that
receives a parameter `dbName` - which is passed into the database() function.

```kusto
.create function foo(dbName:string)
{
    database(dbName).StormEvents | count
};
```

:::moniker range="azure-data-explorer"
> [!NOTE]
> Such functions can be used only locally and not in the cross-cluster query.
:::moniker-end

:::moniker range="microsoft-fabric"
> [!NOTE]
> Such functions can be used only locally and not in the cross-Eventhouse query.
:::moniker-end

