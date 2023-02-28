---
title: .alter materialized view folder - Azure Data Explorer
description: This article describes .alter materialized view folder in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# .alter materialized-view folder

Alters the folder value of an existing materialized view. 

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `folder` *Folder*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view.|
|*Folder*|string|&check;|The folder value to attach to the materialized view.|

## Example

```kusto
.alter materialized-view MyView folder "Updated folder"
```

```kusto
.alter materialized-view MyView folder @"First Level\Second Level"
```
