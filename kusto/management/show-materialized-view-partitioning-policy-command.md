---
title: .show materialized-view policy partitioning command
description: Learn how to use the `.show materialized-view policy partitioning` command to show the materialized view's partitioning policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .show materialized-view policy partitioning command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Displays the materialized view's [partitioning policy](partitioning-policy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName* `policy` `partitioning`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*| `string` | :heavy_check_mark:|The name of the materialized view.|

## Returns

Returns a JSON representation of the policy.

### Example

Delete the policy at the materialized view level:

```kusto
.show materialized-view MyMaterializeView policy partitioning 
```
