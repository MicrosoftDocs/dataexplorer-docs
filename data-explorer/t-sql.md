---
title: T-SQL - Azure Data Explorer
description: This article describes T-SQL in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/08/2023
---
# Query data using T-SQL

The Azure Data Explorer query editor supports the use of T-SQL in addition to its primary query language, [Kusto query language (KQL)](kusto/query/index.md). While KQL is the recommended query language, T-SQL can be useful for tools that are unable to use KQL.

> [!NOTE]
> Only Data Query Language (DQL) commands are supported. For more information, see [Coverage](#coverage).

## Query with T-SQL

To run a T-SQL query, begin the query with an empty T-SQL comment line: `--`. The `--` syntax tells the query editor to interpret the following query as T-SQL and not KQL.

### Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PV5eUKdvVxdQ5R0FJwC/L3VQguyS/KdS1LzSspBgDWLMPrHQAAAA==" target="_blank">Run the query</a>

```sql
--
SELECT * FROM StormEvents
```

## T-SQL to Kusto Query Language

The query editor supports the ability to translate T-SQL queries into KQL. This translation feature can be helpful for users who are familiar with SQL and want to learn more about KQL.

To get the equivalent KQL for a T-SQL `SELECT` statement, add the keyword `explain` before the query. The output will be the KQL version of the query, which can be useful for understanding the corresponding KQL syntax and concepts.

Remember to preface T-SQL queries with a T-SQL comment line, `--`, to tell the query editor to interpret the following query as T-SQL and not KQL.

### Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PV5eVKrSjISczM4+UKdvVxdQ5RKMkv0DA00FTQ4uVyC/L3VQguyS/KdS1LzSsp5uXyD3JxDVJwilRwScxNTE8NKMovSC0qqVRwcQ12BgDaKWaSTQAAAA==" target="_blank">Run the query</a>

```sql
--
explain
SELECT top(10) *
FROM StormEvents
ORDER BY DamageProperty DESC
```

**Output**

```kusto
StormEvents
| project
    StartTime,
    EndTime,
    EpisodeId,
    EventId,
    State,
    EventType,
    InjuriesDirect,
    InjuriesIndirect,
    DeathsDirect,
    DeathsIndirect,
    DamageProperty,
    DamageCrops,
    Source,
    BeginLocation,
    EndLocation,
    BeginLat,
    BeginLon,
    EndLat,
    EndLon,
    EpisodeNarrative,
    EventNarrative,
    StormSummary
| sort by DamageProperty desc nulls first
| take int(10)
```

## Run stored functions

When using T-SQL, we recommend that you create optimized KQL queries and encapsulate them in [stored functions](kusto/query/schema-entities/stored-functions.md), as doing so minimizes T-SQL code and may increase performance. For example, if you have a stored function as described in the following table, you can execute it as shown in the code example.

|Name |Parameters|Body|Folder|DocString
|---|---|---|---|---|
|MyFunction |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Demo function with parameter|

```sql
SELECT * FROM kusto.MyFunction(10)
```

> [!NOTE]
> To distinguish between stored functions and emulated SQL system stored procedures, execute stored functions with an explicit reference to the `kusto` schema. In the example, the stored function is executed using `kusto.Myfunction`.

## Coverage

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
|`AT TIME ZONE`|Not supported|
|SQL cursors|Not supported|
|Correlated subqueries|Not supported|
|Recursive CTEs|Not supported|
|Dynamic statements|Not supported|
|Flow control statements|Only `IF` `THEN` `ELSE` statements with an identical schema for `THEN` and `ELSE` are supported.|
|Duplicate column names|Not supported. The original name is preserved for one column.|
|Data types|Data returned may differ in type from SQL Server. For example, `TINYINT` and `SMALLINT` have no equivalent in Azure Data Explorer, and may return as `INT32` or `INT64` instead of `BYTE` or `INT16`.|

## Next steps

* Learn about [SQL Server emulation](sql-server-emulation-overview.md) in Azure Data Explorer
* Use the [SQL to Kusto Query Language cheat sheet](kusto/query/sqlcheatsheet.md)
