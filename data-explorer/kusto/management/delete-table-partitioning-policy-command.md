---
title: .delete table policy partitioning command
description: Learn how to use the `.delete table policy partitioning` command to delete a table's partitioning policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .delete table policy partitioning command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Deletes a table's [partitioning policy](partitioning-policy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `partitioning`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to delete the policy.|

### Example

The following command deletes the partitioning policy at the table level.

```kusto
.delete table MyTable policy partitioning 
```
