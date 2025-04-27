---
title: .show graph_snapshots command
description: Learn how to list all graph snapshots for a graph model or all graph models
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# .show graph_snapshots (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Lists all graph snapshots for a specific graph model or for all graph models.

## Syntax

`.show` `graph_snapshots` *GraphModelName*

`.show` `graph_snapshots` `*`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|No|The name of the graph model for which to show snapshots. If specified, only snapshots for this model are returned.|
|`*`|Symbol|No|If specified instead of a graph model name, snapshots for all graph models are returned.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|GraphModelName|String|The name of the graph model that the snapshot belongs to.|
|SnapshotName|String|The name of the graph snapshot.|
|GraphModelVersion|String|The version of the graph model used to create this snapshot.|
|NodeCount|Long|The number of nodes in the graph snapshot.|
|EdgeCount|Long|The number of edges in the graph snapshot.|
|Created|DateTime|The date and time when the snapshot was created.|
|Status|String|The current status of the snapshot (e.g., "Ready", "Creating", "Failed").|

## Examples

### Show all snapshots for a specific graph model

```kusto
.show graph_snapshots SocialNetwork
```

**Output**

|GraphModelName|SnapshotName|GraphModelVersion|NodeCount|EdgeCount|Created|Status|
|---|---|---|---|---|---|---|
|SocialNetwork|DailySnapshot|v3|15426|67845|2025-04-25T08:15:30Z|Ready|
|SocialNetwork|WeeklySnapshot|v2|12352|54781|2025-04-18T09:20:45Z|Ready|
|SocialNetwork|MonthlySnapshot|v1|8945|42365|2025-03-28T14:10:22Z|Ready|

### Show snapshots for all graph models

```kusto
.show graph_snapshots *
```

**Output**

|GraphModelName|SnapshotName|GraphModelVersion|NodeCount|EdgeCount|Created|Status|
|---|---|---|---|---|---|---|
|SocialNetwork|DailySnapshot|v3|15426|67845|2025-04-25T08:15:30Z|Ready|
|SocialNetwork|WeeklySnapshot|v2|12352|54781|2025-04-18T09:20:45Z|Ready|
|SocialNetwork|MonthlySnapshot|v1|8945|42365|2025-03-28T14:10:22Z|Ready|
|ProductRecommendations|DailySnapshot|v2.0|7254|35281|2025-04-26T07:05:18Z|Ready|
|ProductRecommendations|WeeklySnapshot|v1.0|5132|25471|2025-04-19T06:30:42Z|Ready|
|NetworkTraffic|HourlySnapshot|v3|3128|18754|2025-04-26T14:00:05Z|Ready|
|NetworkTraffic|DailySnapshot|v2|2354|12458|2025-04-25T08:00:15Z|Ready|

## Notes

- The `.show graph_snapshots` command is useful for listing all available snapshots, which can be queried or managed.
- The results are ordered alphabetically by graph model name, and then by creation date within each model.
- To get more detailed information about a specific snapshot, use the [.show graph_snapshot](graph-snapshot-show.md) command.

## Required permissions

To run this command, the user needs [Database Viewer permissions](../../management/access-control/role-based-access-control.md).

## Related content

* [Graph model overview](graph-model-overview.md)
* [.make graph_snapshot](graph-snapshot-make.md)
* [.show graph_snapshot](graph-snapshot-show.md)
* [.drop graph_snapshot](graph-snapshot-drop.md)
* [.drop graph_snapshots](graph-snapshots-drop.md)