---
title:  extent_id()
description: Learn how to use the extent_id() function to return an identifier of the current record's data shard
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# extent_id()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a unique identifier that identifies the data shard ("extent") that the current record resides in at the time the query was run.

Applying this function to calculated data that isn't attached to a data shard returns an empty guid (all zeros).

> **Deprecated aliases:** extentid()

> [!CAUTION]
>
> The value returned by this function isn't guaranteed to remain stable over time. The system continuously performs data grooming operations in the background
> and these can result with changes to existing extents and their IDs.

## Syntax

`extent_id()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

A value of type `guid` that identifies the current record's data shard at the time the query was run,
or an empty guid (all zeros).

## Example

The following example shows how to get a list of all the data shards
that currently have records from an hour ago with a specific value for the
column `ActivityId`. It demonstrates that some query operators (here,
the `where` operator, and also `extend` and `project`)
preserve the information about the data shard hosting the record.

```kusto
T
| where Timestamp > ago(1h)
| where ActivityId == 'dd0595d4-183e-494e-b88e-54c52fe90e5a'
| extend eid=extent_id()
| summarize by eid
```

