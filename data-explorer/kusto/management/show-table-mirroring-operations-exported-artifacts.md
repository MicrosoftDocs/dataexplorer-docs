---
title:  .show table mirroring operations exported artifacts command
description: Learn how to use the `.show table mirroring operations exported artifacts` command to check the mirroring operations exported artifacts.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 05/28/2024
---
# .Show table mirroring operations exported artifacts command

Returns the table's artifacts exported by the mirroring operation. <!-- Filter the results by the Timestamp column in the command to view only records of interest. The history of exported artifacts is retained for 14 days.-->
<!--The command will not return any results if executed on a [follower database](../../../follower.md), it must be executed against the leader database.-->

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `operations` `mirroring-exported-artifacts`

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

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

```kusto
.show table mytable operations mirroring-exported-artifacts
```

