---
title: T-SQL in Kusto vs. Microsoft SQL Server - Azure Data Explorer
description: This article describes T-SQL differences between Kusto and Microsoft SQL Server in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/06/2023
---
# T-SQL limitations

You can [use T-SQL to query Azure Data Explorer](t-sql-query.md). However, only a subset of T-SQL is supported. Following is a table of T-SQL statements and features that aren't supported, or are partially supported, by Azure Data Explorer.

|T-SQL statement or feature|Description|
|---|---|
|`CREATE`, `INSERT`, `DROP`, `ALTER`|Not supported|
|Schema modifications or data modifications|Not supported|
|`ANY`, `ALL`, `EXISTS`|Not supported|
|`WITHIN GROUP`|Not supported|
|`TOP` `PERCENT`|Not supported|
|`TOP` `WITH TIES`|Evaluated as regular `TOP`|
|`TRUNCATE`|Returns the nearest value|
|SQL cursors|Not supported|
|Correlated subqueries in `SELECT`, `WHERE`, and `JOIN` clauses|Not supported|
|Recursive common table expressions (CTEs)|Not supported|
|Dynamic SQL statements|Not supported|
|Flow control statements|Limited support. For example, `IF` `THEN` `ELSE` with an identical schema for `THEN` and `ELSE` are supported.|
| `SELECT` `*` | Column order may differ from expectation. Use column names if order matters.|
|Duplicate column names|Not supported. Original name preserved for one column.|
|Data types|Data returned may differ in type from SQL Server. For example, `TINYINT` and `SMALLINT` have no equivalent in Azure Data Explorer, and may return as `INT32` or `INT64` instead of `BYTE` or `INT16`.|
