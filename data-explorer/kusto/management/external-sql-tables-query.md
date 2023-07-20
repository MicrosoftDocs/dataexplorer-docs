---
title:  Query SQL external tables
description: This article describes how to query external tables based on SQL tables.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/18/2023
---

# Query SQL external tables

You can query a SQL external table table just as you would query an Azure Data Explorer table. For a full example, see [Query data in Azure Data Lake](../../data-lake-query-data.md).

## How it works

SQL external table queries are translated from Kusto Query Language (KQL) to SQL. The operators after the [external_table](../query/externaltablefunction.md) function call, such as [where](../query/whereoperator.md), [project](../query/projectoperator.md), [count](../query/countoperator.md), and so on, are pushed down and translated into a single SQL query to be executed against the target SQL table.

## Example

For example, consider an external table named `MySqlExternalTable` with two columns `x` and `s`. In this case, the following KQL query is translated into the following SQL query.

**KQL query**

```kusto
external_table(MySqlExternalTable)
| where x > 5 
| count
```

**SQL query**

```SQL
SELECT COUNT(*) FROM (SELECT x, s FROM MySqlTable WHERE x > 5) AS Subquery1
```
