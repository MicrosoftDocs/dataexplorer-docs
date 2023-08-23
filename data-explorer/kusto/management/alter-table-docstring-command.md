---
title:  .alter table docstring command
description: Learn how to use the `.alter table docstring` command to alter the `docstring` value of an existing table. 
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/20/2023
---
# .alter table docstring command

Alters the `docstring` value of an existing table.

`docstring` is free text that you can attach to a table/function/column describing the entity. This string is presented in various UX settings next to the entity names.

> [!NOTE]
> If the table doesn't exist, an error is returned. To create a new table, see [`.create table`](create-table-command.md)

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `docstring` *Documentation*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to alter.|
| *Documentation* | string | &check; | Free text to describe the table.|

## Example

```kusto
.alter table LyricsAsTable docstring "This is the theme to Garry's show"
```
