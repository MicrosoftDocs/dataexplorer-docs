---
title: .clear materialized view data - Azure Data Explorer
description: This article describes the `.clear materialized-view data` command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/02/2021
---
# .clear materialized-view data

Clears the data of an existing materialized view. 

The data is cleared from the `materialized part` of the view only. For more details about the  `materialized part`, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work). After the materialized view data is cleared, the view will continue processing the source table records ingested since the last materialization time. Use the [.show materialized-view](materialized-view-show-commands.md#show-materialized-view) command to get the last materialization timestamp.

The difference between this command and dropping and recreating the view (with no `backfill`) is that using this command preserves all policies set on the materialized view.

## Permissions

You must have [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `materialized-view` *MaterializedViewName* `data`

## Example 

```kusto
.clear materialized-view UsersView data 
```
