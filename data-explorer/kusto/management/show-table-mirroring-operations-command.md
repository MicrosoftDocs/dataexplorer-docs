---
title: .show table mirroring operations command
description: Learn how to use the `.show table mirroring operations` command to check the mirroring policy operations.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 05/21/2024
---
# .show table mirroring operations command

::: zone pivot="fabric"

Check the table's [mirroring policy](mirroring-policy.md) operations mirroring status. Mirroring status allows you to verify the latency and status of your data export.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `operations` `mirroring-status`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the mirroring status.|

## Returns

| Property | Type | Description |
|-----|-----|-----|
|TableName | `string` | The name of the table. |
|IsEnabled | `bool` | A boolean value indicating whether or not the mirroring policy is enabled. |
|ExportProperties |	`string` | A JSON string with various data export properties. |
|ManagedIdentityIdentifier|`string` |ASSUME THIS GOES OUT |
|IsExportRunning |`bool` | A Boolean value indicating whether an export is currently running. |
|LastExportStartTime | `datetime`| A time value defining when the last export began. |
|LastExportResult | `string` | A status of the last export result. |
|LastExportedDataTime |`datetime`| A timestamp when the data was last exported. |
|Latency | `timespan`| Time duration value indicating the time between the last export and the next export. |

## Example

The following example requests operations mirroring status of the Automotive table.

```kusto
.show table Automotive operations mirroring-status 
```

::: zone-end

::: zone pivot="azuredataexplorer, azuremonitor, azurestorage"

This feature isn't supported.

::: zone-end
