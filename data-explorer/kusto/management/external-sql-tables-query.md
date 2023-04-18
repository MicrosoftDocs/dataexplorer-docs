---
title: Query SQL Server external tables - Azure Data Explorer
description: This article describes how to query external tables based on SQL Server tables.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/09/2023
---

# Query SQL Server external tables

You can query a SQL Server external table. For an example, see [Query data in Azure Data Lake](../../data-lake-query-data.md). 

## How it works

SQL external table query implementation will execute `SELECT x, s FROM MySqlTable` statement, where `x` and `s` are external table column names. The rest of the query will execute on the Kusto side.

## Example

Consider the following external table query:

```kusto
external_table('MySqlExternalTable') | count
```

Kusto will execute a `SELECT x, s FROM MySqlTable` query to the SQL database, followed by a count on Kusto side. 
In such cases, performance is expected to be better if written in T-SQL directly (`SELECT COUNT(1) FROM MySqlTable`) 
and executed using the [sql_request plugin](../query/sqlrequestplugin.md), instead of using the external table function. 
Similarly, filters are not pushed to the SQL query.  

> [!NOTE]
> * Use the external table to query the SQL table when the query requires reading the entire table (or relevant columns) for further execution on Kusto side. 
> * When an SQL query can be optimized in T-SQL, use the [sql_request plugin](../query/sqlrequestplugin.md).