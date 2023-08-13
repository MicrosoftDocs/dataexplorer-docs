---
title:  .clear materialized view data
description: This article describes the `.clear materialized-view data` command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .clear materialized-view data

Clears the data of an existing materialized view.

The data is cleared from the `materialized part` of the view only. For more information about the  `materialized part`, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work). After the materialized view data is cleared, the view will continue processing the source table records ingested since the last materialization time. Use the [`.show materialized-view`](materialized-view-show-command.md#show-materialized-views) command to get the last materialization timestamp.

The difference between this command and dropping and recreating the view (with no `backfill`) is that using this command preserves all policies set on the materialized view.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `materialized-view` *MaterializedViewName* `data`

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | string | &check;  | Name of the materialized view. |

## Returns

Following is the schema of the output returned:

| Name              | Type     | Description                                                                                                                                                                                                          |
|-------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ExtentId          | guid     | Globally unique identifier of the extent containing information for the materialized part of the materialized view which has been removed.                                                                           |
| TableName         | string   | Internal name by which the engine refers to the materialized part of the materialized view. It consists of the prefix `_MV_` followed by the name the user assigned to the materialized view when it was created.    |
| CreatedOn         | datetime | Date and time when the extent was originally created.                                                                                                                                                                |

## Examples

### Clear data from one materialized view

The following command clears all data from the materialized part of view UsersView:

```kusto
.clear materialized-view UsersView data 
```
