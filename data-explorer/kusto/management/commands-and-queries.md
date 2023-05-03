---
title:  Commands and queries management
description: This article describes Commands and queries management in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/19/2019
---
# Commands and queries management

## .show commands-and-queries 

`.show` `commands-and-queries` returns a table with admin commands and queries that have reached a final state. These commands and queries are available for 30 days.

The information presented in the output of the command is similar to [`.show` commands](commands.md) 
and [`.show` queries](queries.md), however it essentially lets you join both result sets in a simple manner.

**Syntax**

`.show` `commands-and-queries`
 
**Output**
 
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
