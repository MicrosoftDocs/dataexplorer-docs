---
title: Materialized view rename - Azure Data Explorer
description: This article describes rename materialized view command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# .rename materialized-view

Renames a materialized view.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.rename` `materialized-view` *OldName* `to` *NewName*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *OldName* | string | &check; | The old name of the materialized view. |
| *NewName* | string | &check; | The new name to assign to the materialized view. |

## Returns

The command returns all materialized views in the database, after the rename, which is the output of the [show materialized view](materialized-view-show-commands.md#show-materialized-view) command.

## Example

```kusto
.rename materialized-view ViewName to NewName
```
