---
title: .alter materialized view folder - Azure Data Explorer
description: This article describes .alter materialized view folder in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/08/2021
---
# .alter materialized-view folder

Alters the folder value of an existing materialized view. 

`.alter` `materialized-view` *MaterializedViewName* `folder` *Folder*

## Permissions

This command requires at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions.

## Example

```kusto
.alter materialized-view MyView folder "Updated folder"
```

```kusto
.alter materialized-view MyView folder @"First Level\Second Level"
```
