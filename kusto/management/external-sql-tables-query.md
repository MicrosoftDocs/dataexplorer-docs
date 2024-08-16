---
title:  Query SQL external tables
description: This article describes how to query external tables based on SQL tables.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---

# Query SQL external tables

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

You can query a SQL external table just as you would query an Azure Data Explorer or a table in a KQL Database.

## How it works

Azure SQL external table queries are translated from Kusto Query Language (KQL) to SQL. The operators after the [external_table](../query/external-table-function.md) function call, such as [where](../query/where-operator.md), [project](../query/project-operator.md), [count](../query/count-operator.md), and so on, are pushed down and translated into a single SQL query to be executed against the target SQL table.

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
