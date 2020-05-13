---
title: T-SQL - Azure Data Explorer
description: This article describes T-SQL in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# T-SQL support

[Kusto query language (KQL)](../../query/index.md) is the preferred query language.
T-SQL support, however, is useful for tools that can't be easily converted to use KQL.  
T-SQL support is also useful for casual use by people familiar with SQL.

Kusto can interpret and run T-SQL queries with some language limitations.

> [!NOTE]
> Kusto doesn't support DDL commands. Only T-SQL `select` statements are supported. 
> For more information about the main differences with regards to T-SQL, 
> see [SQL known issues](./sqlknownissues.md).

## Querying from Kusto.Explorer with T-SQL

The Kusto.Explorer tool supports T-SQL queries to Kusto.
To instruct Kusto.Explorer to execute a query, begin the query with an empty T-SQL comment line (`--`). 
For example:

```sql
--
select * from StormEvents
```

## From T-SQL to Kusto query language

Kusto supports translating T-SQL queries to Kusto query language (KQL). 
This translation can help people familiar with SQL to better understand KQL.
To get back the equivalent KQL from some T-SQL `select` statement, add `explain` before the query.

For example, the following T-SQL query:

```sql
--
explain
select top(10) *
from StormEvents
order by DamageProperty desc
```

produces this output:

```kusto
StormEvents
| sort by DamageProperty desc nulls first
| take 10
```
