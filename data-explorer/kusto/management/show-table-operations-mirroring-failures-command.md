---
title:  .show table operations mirroring-failures command
description: Learn how to use the `.show table operations mirroring-failures` command to check the mirroring operations failures.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 04/14/2026
monikerRange: "microsoft-fabric"
---
# .show table operations mirroring-failures command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)]

Returns the table's [mirroring policy](mirroring-policy.md) operations table export failures. It helps you identify failures or issues related to your table's mirroring operations.

## Syntax

`.show` `table` *TableName* `operations` `mirroring-failures`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

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

The following example requests operations mirroring export failures of the *myTable* table.

```kusto
.show table MyTable operations mirroring-failures

```
