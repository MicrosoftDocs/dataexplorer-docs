---
title: .drop external table command
description: Learn how to use the `.drop external table` command to drop an external table. 
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/24/2023
---
# .drop external table command

Drops an external table.

The external table definition can't be restored following this operation.

This command is relevant to any external table of any type. For an overview of external tables, see [external tables](../query/schema-entities/external-tables.md).

## Permissions

You must have at least [External Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax  

`.drop` `external` `table` *TableName* [`ifexists`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark: | The name of the external table to drop. |
|`ifexists`| `string` || If specified, the command won't fail if the table doesn't exist.|

## Returns

Returns the properties of the dropped external table. For more information, see [`.show external tables`](show-external-tables.md).

## Examples

```kusto
.drop external table ExternalBlob
```

| TableName | TableType | Folder         | DocString | Schema       | Properties |
|-----------|-----------|----------------|-----------|-----------------------------------------------------|------------|
| T         | Blob      | ExternalTables | Docs      | [{ "Name": "x",  "CslType": "long"},<br> { "Name": "s",  "CslType": "string" }] | {}         |
