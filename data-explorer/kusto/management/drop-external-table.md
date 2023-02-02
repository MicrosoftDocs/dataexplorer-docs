---
title: drop external table control command - Azure Data Explorer
description: This article describes the drop external table control command in Azure Data Explorer 
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/20/2021
---
# .drop external table

Drops an external table.

The external table definition can't be restored following this operation.

This command is relevant to any external table of any type. For an overview of external tables, see [external tables](../query/schema-entities/externaltables.md).

## Permissions

This command requires [database admin](access-control/role-based-access-control.md) permissions.

## Syntax  

`.drop` `external` `table` *TableName* [`ifexists`]

## Output

Returns the properties of the dropped external table. For more information, see [`.show external tables`](show-external-tables.md).

## Examples

```kusto
.drop external table ExternalBlob
```

| TableName | TableType | Folder         | DocString | Schema       | Properties |
|-----------|-----------|----------------|-----------|-----------------------------------------------------|------------|
| T         | Blob      | ExternalTables | Docs      | [{ "Name": "x",  "CslType": "long"},<br> { "Name": "s",  "CslType": "string" }] | {}         |
