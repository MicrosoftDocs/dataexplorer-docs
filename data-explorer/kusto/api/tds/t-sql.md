---
title: T-SQL - Azure Data Explorer
description: This article describes T-SQL in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/24/2023
---
# T-SQL support

The Azure Data Explorer query editor supports the use of T-SQL in addition to its primary query language, [Kusto query language (KQL)](../../query/index.md). While KQL is the recommended query language, T-SQL can be useful for tools that are unable to use KQL or for users who are already familiar with SQL.

> [!NOTE]
> The query editor only supports T-SQL `SELECT` statements and doesn't support DDL commands, such as `CREATE`, `ALTER`, or `DROP`. For more information about the limitations of using T-SQL with Kusto, see the section on [SQL known issues](./sqlknownissues.md).

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

## Next steps

* Learn more about [MS-TDS and T-SQL support](index.md)
* Connect and query from common [MS-TDS clients](clients.md)
