---
title: T-SQL - Azure Data Explorer | Microsoft Docs
description: This article describes T-SQL in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# T-SQL

The Kusto service can interpret and run T-SQL queries with some language limitations.
While the [Kusto query language](../../query/index.md) is the preferred language
for Kusto, such support is useful for existing tool that cannot be easily converted
to use the preferred query language, and for casual use of Kusto by people familiar
with SQL.

Note that Kusto does not support any DDL command in this manner -- only T-SQL
`SELECT` statements are supported. See [this topic](./sqlknownissues.md) for
details on the main differences between SQL Server and Kusto with regards to
T-SQL.



## From T-SQL to Kusto query language

Kusto supports translating T-SQL queries to Kusto query language. This can be
used, for example, by people familiar with SQL who want to understand the
Kusto query language better. To get back the equivalent Kusto query language
to some T-SQL `SELECT` statement, simply add `EXPLAIN` before the query.

For example, the following T-SQL query:

```sql
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