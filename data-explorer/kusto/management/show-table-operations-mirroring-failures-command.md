---
title:  .show table operations mirroring-failures command
description: Learn how to use the `.show table operations mirroring-failures` command to check the mirroring operations failures.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 12/10/2024
---
# .show table operations mirroring-failures command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

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
