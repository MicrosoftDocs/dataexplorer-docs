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

## Set request properties

[Request properties](kusto/api/rest/request-properties.md) control how a query executes and returns results. To set request properties with T-SQL, use the following syntax.

**Syntax**

`DECLARE` `@__kql_set_`*requestPropertyName* *type* `=` *value*`;`

**Parameters**

|Name|Type|Required|Description|
|--|--|--|--|
|*requestPropertyName*|string|&check;|The name of the [request property](kusto/api/rest/request-properties.md) to set.|
|*type*|string|&check;|The [T-SQL data type](/sql/t-sql/data-types/data-types-transact-sql?view=sql-server-ver16) of the value.|
|*value*|scalar|&check;|The value to assign to the request property.|

> [!NOTE]
> * Set statements impact only the tabular expression statements that immediately follow them.
> * Two statements must be separated by a semicolon, and there should be no empty line before the query.

**Examples**

|Request property|Example|
|--|--|
|`query_datetimescope_to`|DECLARE @__kql_set_query_datetimescope_to DATETIME = '2023-03-31 03:02:01';|
|`request_app_name`|DECLARE @__kql_set_request_app_name NVARCHAR = 'kuku';|
|`query_results_cache_max_age`|DECLARE @__kql_set_query_results_cache_max_age TIME = '00:05:00';|
|`truncationmaxsize`|DECLARE @__kql_set_truncationmaxsize BIGINT = 4294967297;|
|`maxoutputcolumns`|DECLARE @__kql_set_maxoutputcolumns INT = 3001;|
|`notruncation`|DECLARE @__kql_set_notruncation BIT = 1;|
|`noprejoin`|DECLARE @__kql_set_noprejoin BIT = 0;|

To set request properties with KQL, see [set statement](kusto/query/setstatement.md)

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

## Related content

* Learn about [SQL Server emulation](sql-server-emulation-overview.md) in Azure Data Explorer
* Use the [SQL to Kusto Query Language cheat sheet](kusto/query/sqlcheatsheet.md)
