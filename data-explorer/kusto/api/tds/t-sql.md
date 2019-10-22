---
title: T-SQL - Azure Data Explorer | Microsoft Docs
description: This article describes T-SQL in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2019

---
# T-SQL

The Kusto service can interpret and run T-SQL queries with some language limitations.
While the [Kusto query language](../../query/index.md) is the preferred language
for Kusto, such support is useful for existing tool that can't be easily converted
to use the preferred query language, and for casual use of Kusto by people familiar
with SQL.

> [!NOTE]
> Kusto doesn't support a DDL command in this manner, only T-SQL
> `SELECT` statements are supported. See [SQL known issues](./sqlknownissues.md) for
> details on the main differences between SQL Server and Kusto with regards to
> T-SQL.

## Querying Kusto from Kusto.Explorer with T-SQL

The Kusto.Explorer tool supports sending T-SQL queries to Kusto.
To instruct Kusto.Explorer to execute a query in this mode,
prepend the query an empty T-SQL comment line. For example:

```sql
--
select * from StormEvents
```

## From T-SQL to Kusto query language

Kusto supports translating T-SQL queries to Kusto query language. This can be
used, for example, by people familiar with SQL who want to understand the
Kusto query language better. To get back the equivalent Kusto query language
to some T-SQL `SELECT` statement, simply add `EXPLAIN` before the query.

For example, the following T-SQL query:

```sql
--
explain
select top(10) *
from StormEvents
order by DamageProperty desc
```

Produces this output:

```kusto
StormEvents
| sort by DamageProperty desc nulls first
| take 10
```