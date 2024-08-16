---
title:  .show table mirroring operations exported artifacts command
description: Learn how to use the `.show table mirroring operations exported artifacts` command to check the mirroring operations exported artifacts.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 05/28/2024
---
# .show table mirroring operations exported artifacts command

Returns the table's [mirroring policy](mirroring-policy.md) operations details related to the mirroring artifacts export. It helps track the operation and the artifacts exported.

## Syntax

`.show` `table` *TableName* `operations` `mirroring-exported-artifacts`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark: | The name of the table for which to show the mirroring exported artifacts. |

## Returns

| Property | Type | Description |
|-------------------|----------|----------------------------------------|
| Timestamp         | `datetime` | Timestamp of the artifacts export. |
| ExternalTableName | `string` | The name of the external table. |
| Path              | `string` | The output path. |
| NumRecords        | `long` | The number of records exported to the path. |
| SizeInBytes        | `long` | The size of the exported artifacts. |
| Stats | `string` | Statistical information related to the artifacts export. |
| PartitionValues| `string` | Values related to the mirroring policy partition.   |

## Example

The following example requests mirroring artifact export operations details of the *myTable* table.

```kusto
.show table mytable operations mirroring-exported-artifacts
```
