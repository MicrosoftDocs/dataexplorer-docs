---
title:  .show table mirroring operations failures
description: Learn how to use the `.show table mirroring operations failures` command to check the mirroring operations failures.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 05/28/2024
---
# .show table mirroring operations failures

Returns all failures logged as part of the mirroring operations export. Filter the results by the Timestamp column in the command to view only time range of interest.
<!--The command will not return any results if executed on a [follower database](../../../follower.md), it must be executed against the leader database.-->

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `operations` `mirroring-failures`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark: | The name of the table for which to show the mirroring failure. |

## Returns

| Property | Type | Description |
|-------------------|----------|----------------------------------------|
| Timestamp | `datetime` | Timestamp of the mirroring failure. |
| LastSuccessRun | Timestamp | The last successful run of the export.   |
| FailureKind | `string` | Either `Failure` or `PartialFailure`. `PartialFailure` indicates some artifacts were exported successfully before the failure occurred.|
| Details | `string` | Failure error details.  |

## Example

```kusto
.show table MyTable operations mirroring-exported-artifacts

```
