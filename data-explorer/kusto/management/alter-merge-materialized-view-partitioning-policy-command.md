---
title:  .alter-merge materialized-view policy partitioning command
description: Learn how to use the `.alter-merge materialized-view policy partitioning` command to create the materialized view's partitioning policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/28/2023
---
# .alter-merge materialized-view policy partitioning command

Creates the materialized view's [partitioning policy](partitioning-policy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `materialized-view` *MaterializedViewName* `policy` `partitioning` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string| :heavy_check_mark:|The name of the materialized view.|
|*PolicyObject*|string| :heavy_check_mark:|A serialized array of one or more JSON policy objects. For more information, see [partitioning policy](partitioning-policy.md).|

## Example

Change the policy at the materialized view level:

```kusto
.alter-merge materialized-view MyMaterializeView policy partitioning '{"EffectiveDateTime":"2023-01-01"}'
```
