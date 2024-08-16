---
title:  .alter-merge table policy partitioning command
description: Learn how to use the `.alter-merge table policy partitioning` command to change the table's partitioning policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .alter-merge table policy partitioning command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Changes the table's [partitioning policy](partitioning-policy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *TableName* `policy` `partitioning` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table.|
|*PolicyObject*| `string` | :heavy_check_mark:|A serialized array of one or more JSON policy objects. For more information, see [partitioning policy](partitioning-policy.md).|

### Example

Alter merge the policy at the table level:

```kusto
.alter-merge table MyTable policy partitioning '{"EffectiveDateTime":"2023-01-01"}'
```
