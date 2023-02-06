---
title: T-SQL in Kusto vs. Microsoft SQL Server - Azure Data Explorer
description: This article describes T-SQL differences between Kusto and Microsoft SQL Server in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/06/2023
---
# T-SQL limitations

Azure Data Explorer offers limited support for T-SQL. The following table outlines the T-SQL statements and features that aren't supported or are partially supported.

|T-SQL statement or feature|Description|
|---|---|
|`CREATE`, `INSERT`, `DROP`, and `ALTER`|Not supported|
|Schema or data modifications|Not supported|
|`ANY`, `ALL`, and `EXISTS`|Not supported|
|`WITHIN GROUP`|Not supported|
|`TOP` `PERCENT`|Not supported|
|`TOP` `WITH TIES`|Evaluated as regular `TOP`|
|`TRUNCATE`|Returns the nearest value|
|`SELECT` `*` | Column order may differ from expectation. Use column names if order matters.|
|SQL cursors|Not supported|
|Correlated subqueries|Not supported|
|Recursive CTEs|Not supported|
|Dynamic statements|Not supported|
|Flow control statements|Only `IF` `THEN` `ELSE` statements with an identical schema for `THEN` and `ELSE` are supported.|
|Duplicate column names|Not supported. The original name is preserved for one column.|
|Data types|Data returned may differ in type from SQL Server. For example, `TINYINT` and `SMALLINT` have no equivalent in Azure Data Explorer, and may return as `INT32` or `INT64` instead of `BYTE` or `INT16`.|
