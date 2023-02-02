---
title: Materialized view rename - Azure Data Explorer
description: This article describes rename materialized view command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 11/22/2021
---
# .rename materialized-view

Renames a materialized view.

## Permissions

This command requires [database or materialized view admin](../access-control/role-based-access-control.md) permissions.

## Syntax
`.rename` `materialized-view` *OldName* `to` *NewName*

## Properties

| Property | Type| Description |
|----------------|-------|-----|
| OldName| String| Name of the materialized view to rename.|
| NewName| String| New name to assign to the view.|

## Returns

The command returns all materialized views in the database, after the rename, which is the output of the [show materialized view](materialized-view-show-commands.md#show-materialized-view) command.

## Example

```kusto
.rename materialized-view ViewName to NewName
```
