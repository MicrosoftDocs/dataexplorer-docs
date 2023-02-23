---
title: drop external table control command - Azure Data Explorer
description: This article describes the drop external table control command in Azure Data Explorer 
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# .drop external table

Drops an external table.

The external table definition can't be restored following this operation.

This command is relevant to any external table of any type. For an overview of external tables, see [external tables](../query/schema-entities/externaltables.md).

## Permissions

You must have at least [External Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax  

`.drop` `external` `table` *TableName* [`ifexists`]

## Output

Returns the properties of the dropped external table. For more information, see [`.show external tables`](show-external-tables.md).

## Examples

```kusto
.drop external table ExternalBlob
```

| TableName   | TableType | Folder         | DocString | Properties | ConnectionStrings | Partitions | PathFormat |
|-------------|-----------|----------------|-----------|------------|-------------------|------------|------------|
| ExternalBlob|           |                |           |            |                   |            |            |
