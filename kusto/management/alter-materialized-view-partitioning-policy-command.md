---
title:  .alter materialized-view policy partitioning command
description: Learn how to use the `.alter materialized-view policy partitioning` command to change the materialized view's partitioning policy. 
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/25/2023
---
# .alter materialized-view policy partitioning command

Changes the materialized view's [partitioning policy](partitioning-policy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `policy` `partitioning` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*| `string` | :heavy_check_mark:| The name of the materialized view.|
|*PolicyObject*| `string` | :heavy_check_mark:|A policy object used to set the partitioning policy. For more information, see [partitioning policy](partitioning-policy.md).|

### Example

Set a policy on the materialized view with two kinds of partition keys:

```kusto
.alter materialized-view [materialized_view_table_name] policy partitioning ```
{
  "PartitionKeys": [
    {
      "ColumnName": "my_string_column",
      "Kind": "Hash",
      "Properties": {
        "Function": "XxHash64",
        "MaxPartitionCount": 128,
        "PartitionAssignmentMode": "Uniform"
      }
    },
    {
      "ColumnName": "my_datetime_column",
      "Kind": "UniformRange",
      "Properties": {
        "Reference": "1970-01-01T00:00:00",
        "RangeSize": "1.00:00:00",
        "OverrideCreationTime": false
      }
    }
  ]
}```
```
