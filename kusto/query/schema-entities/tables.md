---
title:  Tables
description:  This article describes Tables.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/30/2019
---
# Tables

Tables are named entities that hold data. A table has an ordered set of [columns](./columns.md), and zero or more rows of data. Each row holds one data value for each of the columns of the table. The order of rows in the table is unknown, and doesn't in general affect queries, except for some tabular operators (such as the [top operator](../top-operator.md)) that are inherently undetermined. For information on how to create and manage tables, see [managing tables](../../management/tables.md).

Tables occupy the same namespace as [stored functions](./stored-functions.md). If a stored function and a table both have the same name, the stored function will be chosen.

> [!NOTE]
>
> * The maximum limit of tables per database is 10,000.
> * Table names are case-sensitive. For more information, see [Identifier naming rules](entity-names.md#identifier-naming-rules).

## References tables in queries

The simplest way to reference a table is by using its name. This reference can be done for all tables that are in the database in context. For example, the following query counts the records of the current database's `StormEvents` table:

```kusto
StormEvents
| count
```

An equivalent way to write the query above is by escaping the table name:

```kusto
["StormEvents"]
| count
```

Tables may also be referenced by explicitly noting the database (or database and cluster) they are in. Then you can author queries that combine data from multiple databases and clusters. For example, the following query will work with any database in context, as long as the caller has access to the target database:

```kusto
cluster("https://help.kusto.windows.net").database("Samples").StormEvents
| count
```

It's also possible to reference a table by using the [table() special function](../table-function.md), as long as the argument to that function evaluates to a constant. For example:

```kusto
let counter=(TableName:string) { table(TableName) | count };
counter("StormEvents")
```

> [!NOTE]
> Use the `table()` special function to explicitly specify the table data scope. For example, use this function to restrict processing to the data in the table that falls in the hot cache.

## Related content

* [Estimate table size](../../management/estimate-table-size.md)
