---
title: .alter materialized view folder - Azure Data Explorer
description: This article describes .alter materialized view folder in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/16/2023
---
# .alter materialized-view folder

Alters the folder value of an existing materialized view. 

> [!NOTE]
> You must either be the [database user](../access-control/role-based-access-control.md) who created the materialized view or have [database admin permission](../access-control/role-based-access-control.md) to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `folder` *Folder*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view.|
|*Folder*|string|&check;|The folder value to attach to the materialized view.|

## Examples

```kusto
.alter materialized-view MyView folder "Updated folder"
```

```kusto
.alter materialized-view MyView folder @"First Level\Second Level"
```
