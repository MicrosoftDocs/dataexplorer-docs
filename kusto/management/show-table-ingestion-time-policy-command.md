---
title: .show table policy ingestiontime command
description: Learn how to use the `.show table policy ingestiontime` command to display the table's ingestion time policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .show table policy ingestiontime command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Display a table's [ingestion time policy](ingestion-time-policy.md). This policy creates a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `ingestiontime`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

### Examples

To show the policy:

```kusto
.show table table_name policy ingestiontime 
```
