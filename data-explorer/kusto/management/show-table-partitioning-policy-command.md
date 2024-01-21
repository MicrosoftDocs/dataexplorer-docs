---
title: .show table policy partitioning command
description: Learn how to use the `.show table policy partitioning` command to display the table's partitioning policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/23/2023
---
# .show table policy partitioning command

Displays the table's [partitioning policy](partitioning-policy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `partitioning`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string| :heavy_check_mark:|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

### Example

Display the policy at the table level:

```kusto
.show table MyTable policy partitioning 
```
