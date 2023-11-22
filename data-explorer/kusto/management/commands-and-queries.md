---
title: .show commands-and-queries
description: Learn how to use the `.show commands and queries` command to view a table with admin commands and queries that have reached a final state.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/22/2023
---
# .show commands-and-queries

`.show` `commands-and-queries` returns a table with admin commands and queries on the cluster that have reached a final state. These commands and queries are available for 30 days.

The information presented in the output of the command is similar to [`.show` commands](commands.md)
and [`.show` queries](queries.md), however it essentially lets you join both result sets in a simple manner.

## Syntax

`.show` `commands-and-queries`

## Returns

Returns a table containing previously run admin commands and queries across all databases in the cluster and their completion statistics. You can use KQL queries to explore the results.

The output schema is as follows:

| ColumnName               | ColumnType |
|--------------------------|------------|
| ClientActivityId         | string     |
| CommandType              | string     |
| Text                     | string     |
| Database                 | string     |
| StartedOn                | datetime   |
| LastUpdatedOn            | datetime   |
| Duration                 | timespan   |
| State                    | string     |
| FailureReason            | string     |
| RootActivityId           | guid       |
| User                     | string     |
| Application              | string     |
| Principal                | string     |
| ClientRequestProperties  | dynamic    |
| TotalCpu                 | timespan   |
| MemoryPeak               | long       |
| CacheStatistics          | dynamic    |
| ScannedExtentsStatistics | dynamic    |
| ResultSetStatistics      | dynamic    |
| WorkloadGroup            | string     |

> [!NOTE]
> For queries, the value of `CommandType` is `Query`.

## Related content

* [.cancel query](cancel-query-command.md)
