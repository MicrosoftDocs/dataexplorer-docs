---
title: .create-merge table - Azure Data Explorer
description: This article describes .create-merge table in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/11/2021
---
# .create-merge table

Creates a new table or extends an existing table.

The command must run in context of a specific database.

## Permissions

This command requires [Database User](access-control/role-based-access-control.md) permissions, and [Table Admin](access-control/role-based-access-control.md) permissions for extending existing tables.

## Syntax

`.create-merge` `table` *TableName* ([columnName:columnType], ...)  [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`]

If the table doesn't exist, functions exactly as `.create table` command.

If table T exists, and you send a `.create-merge table T (<columns specification>)` command, then:

* Any column in \<columns specification> that didn't previously exist in T will be added to the end of T's schema.
* Any column in T that is not in \<columns specification> won't be removed from T.
* Any column in \<columns specification> that exists in T, but with a different data type will cause the command to fail.

## See also

* [`.create-merge tables`](create-merge-tables-command.md)
* [`.create table`](create-table-command.md)
