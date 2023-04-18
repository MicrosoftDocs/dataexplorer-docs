---
title: Query SQL Server external tables - Azure Data Explorer
description: This article describes how to query external tables based on SQL Server tables.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/18/2023
---

# Query SQL Server external tables

You can query a SQL Server external table just as you would query an Azure Data Explorer table. For a full example, see [Query data in Azure Data Lake](../../data-lake-query-data.md).

## How it works

SQL external table queries are translated from Kusto Query Language (KQL) to SQL. The implementation of SQL external table queries pushes down the KQL operators and filters, such as [where](../query/whereoperator.md), [project](../query/projectoperator.md), and [count](../query/countoperator.md), into the SQL query. These operators are then executed directly in the SQL query against the external table.

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

> [!NOTE]
>
> * Use the external table to query the SQL table when the query requires reading the entire table (or relevant columns) for further execution on Kusto side.
> * When a SQL query can be optimized in T-SQL, use the [sql_request plugin](../query/sqlrequestplugin.md).
