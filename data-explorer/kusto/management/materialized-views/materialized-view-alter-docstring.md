---
title: .alter materialized view docstring - Azure Data Explorer
description: This article describes the `.alter materialized-view docstring` command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 08/08/2021
---
# .alter materialized-view docstring

Alters the DocString value of an existing materialized view.

`DocString` is free text that you can attach to a table/function/column describing the entity. This string is presented in various UX settings next to the entity names.

`.alter` `materialized-view` *MaterializedViewName* `docstring` *Documentation*

## Permissions

You must have [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Example

```kusto
.alter materialized-view MyView docstring "docs here..."
```
