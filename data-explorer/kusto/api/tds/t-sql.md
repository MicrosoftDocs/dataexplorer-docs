---
title: T-SQL - Azure Data Explorer
description: This article describes T-SQL in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/09/2023
---
# T-SQL support

Azure Data Explorer supports the use of T-SQL in addition to its primary query language, [Kusto query language (KQL)](../../query/index.md). While KQL is the recommended query language, T-SQL can be useful for tools that are unable to use KQL or for users who are already familiar with SQL.

It's important to note that Kusto only supports T-SQL `select` statements and doesn't support DDL commands, such as `CREATE`, `ALTER`, or `DROP`. For more information about the limitations of using T-SQL with Kusto, see the section on [SQL known issues](./sqlknownissues.md).

## Query with T-SQL

To run a T-SQL query in Azure Data Explorer, begin the query with an empty T-SQL comment line: `--`. The `--` syntax tells Azure Data Explorer to interpret the following query as T-SQL and not KQL.

### Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PV5SpOzUlNLlHQUkgrys9VCC7JL8p1LUvNKykGAE+HDTgcAAAA" target="_blank">Run the query</a>

```sql
--
select * from StormEvents
```

## T-SQL to Kusto query language

Kusto supports the ability to translate T-SQL queries into its own query language, KQL. This translation feature can be helpful for users who are familiar with SQL and want to learn more about KQL.

To get the equivalent KQL for a T-SQL `select` statement, add the keyword `explain` before the query. The output will be the KQL version of the query, which can be useful for understanding the corresponding KQL syntax and concepts.

Remember to preface T-SQL queries with a T-SQL comment line, `--`, to tell Azure Data Explorer to interpret the following query as T-SQL and not KQL.

### Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwXBQQqAIBAF0P2cYpYVCHWH2gedwPQXgToyDpG37z3nCF9N/inUkBCMTeqwzCNPdKlkPkw0by+KNRKNUD47rz77G7tKhVrniBZ+iyMp/UkAAAA=" target="_blank">Run the query</a>

```sql
--
explain
select top(10) *
from StormEvents
order by DamageProperty desc
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
