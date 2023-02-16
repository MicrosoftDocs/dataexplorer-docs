---
title: .alter materialized view docstring - Azure Data Explorer
description: This article describes the `.alter materialized-view docstring` command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/16/2023
---
# .alter materialized-view docstring

Alters the DocString value of an existing materialized view.

`DocString` is free text that you can attach to a table/function/column describing the entity. This string is presented in various UX settings next to the entity names.

> [!NOTE]
> You must either be the [database user](../access-control/role-based-access-control.md) who created the materialized view or have [database admin permission](../access-control/role-based-access-control.md) to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `docstring` *Documentation*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view.|
|*Documentation*|string|&check;|The free text you want to use to describe the materialized view.|

## Example

```kusto
.alter materialized-view MyView docstring "docs here..."
```
