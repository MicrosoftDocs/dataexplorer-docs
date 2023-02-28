---
title: .alter table docstring - Azure Data Explorer
description: This article describes the `.alter table docstring` command in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/21/2023
---
# .alter table docstring

Alters the `DocString` value of an existing table.

`DocString` is free text that you can attach to a table/function/column describing the entity. This string is presented in various UX settings next to the entity names.

`.alter` `table` *TableName* `docstring` *Documentation*

> [!NOTE]
> If the table doesn't exist, an error is returned. To create a new table, see [`.create table`](create-table-command.md)

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Example

```kusto
.alter table LyricsAsTable docstring "This is the theme to Garry's show"
```
