---
title: .show graph_snapshots command
description: Learn how to list all graph snapshots for a graph model or all graph models using the .show graph_snapshots command.
ms.reviewer: herauch
ms.topic: reference
ms.date: 05/24/2025
---

# .show graph_snapshots (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

Lists all graph snapshots for a specific graph model or for all graph models.

## Permissions

To run this command, the user needs [Database viewer permissions](../../access-control/role-based-access-control.md).

## Syntax

`.show` `graph_snapshots` *GraphModelName*

`.show` `graph_snapshots` `*`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|❌|The name of the graph model for which to show snapshots. If specified, only snapshots for this model are returned.|
|`*`|Symbol|❌|If specified instead of a graph model name, snapshots for all graph models are returned.|

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|Name|String|The name of the graph snapshot.|
|SnapshotTime|DateTime|The date and time when the snapshot was created.|
|ModelName|String|The name of the graph model that the snapshot belongs to.|
|ModelId|GUID|The unique identifier of the graph model.|
|ModelCreationTime|DateTime|The date and time when the graph model was created.|

## Examples

### Show all snapshots for a specific graph model

```kusto
.show graph_snapshots SocialNetwork
```

**Output**

|Name|SnapshotTime|ModelName|ModelId|ModelCreationTime|
|---|---|---|---|---|
|DailySnapshot|2025-04-25T08:15:30Z|SocialNetwork|aaaaaaaa-0b0b-1c1c-2d2d-333333333333|2025-03-01T10:00:00Z|
|WeeklySnapshot|2025-04-18T09:20:45Z|SocialNetwork|aaaaaaaa-0b0b-1c1c-2d2d-333333333333|2025-03-01T10:00:00Z|
|MonthlySnapshot|2025-03-28T14:10:22Z|SocialNetwork|aaaaaaaa-0b0b-1c1c-2d2d-333333333333|2025-03-01T10:00:00Z|

### Show snapshots for all graph models

```kusto
.show graph_snapshots *
```

**Output**

|Name|SnapshotTime|ModelName|ModelId|ModelCreationTime|
|---|---|---|---|---|
|DailySnapshot|2025-04-25T08:15:30Z|SocialNetwork|aaaaaaaa-0b0b-1c1c-2d2d-333333333333|2025-03-01T10:00:00Z|
|WeeklySnapshot|2025-04-18T09:20:45Z|SocialNetwork|aaaaaaaa-0b0b-1c1c-2d2d-333333333333|2025-03-01T10:00:00Z|
|MonthlySnapshot|2025-03-28T14:10:22Z|SocialNetwork|aaaaaaaa-0b0b-1c1c-2d2d-333333333333|2025-03-01T10:00:00Z|
|DailySnapshot|2025-04-26T07:05:18Z|ProductRecommendations|bbbbbbbb-1c1c-2d2d-3e3e-444444444444|2025-02-15T14:30:00Z|
|WeeklySnapshot|2025-04-19T06:30:42Z|ProductRecommendations|bbbbbbbb-1c1c-2d2d-3e3e-444444444444|2025-02-15T14:30:00Z|
|HourlySnapshot|2025-04-26T14:00:05Z|NetworkTraffic|cccccccc-2d2d-3e3e-4f4f-555555555555|2025-01-20T09:15:00Z|
|DailySnapshot|2025-04-25T08:00:15Z|NetworkTraffic|cccccccc-2d2d-3e3e-4f4f-555555555555|2025-01-20T09:15:00Z|

## Notes

- The `.show graph_snapshots` command is useful for listing all available snapshots, which can be queried or managed.
- The results are ordered alphabetically by snapshot name, and then by creation time within each snapshot name.
- To get more detailed information about a specific snapshot, use the [.show graph_snapshot](graph-snapshot-show.md) command.

## Related content

* [Graph model overview](graph-model-overview.md)
* [.make graph_snapshot](graph-snapshot-make.md)
* [.show graph_snapshot](graph-snapshot-show.md)
* [.drop graph_snapshot](graph-snapshot-drop.md)
* [.drop graph_snapshots](graph-snapshots-drop.md)
