---
title:  .alter table policy partitioning command
description: Learn how to use the `.alter table policy partitioning` command to change the table's partitioning policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .alter table policy partitioning command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Change's the table's [partitioning policy](partitioning-policy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `partitioning` *PolicyObject*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark: | The name of the table to alter. |
| *PolicyObject* | `string` |  :heavy_check_mark: | A serialized JSON policy object. See [partitioning policy](partitioning-policy.md). |

### Examples

Set a policy with a hash partition key:

~~~kusto
.alter table [table_name] policy partitioning ```
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
    }
  ]
}```
~~~

Set a policy with a uniform range datetime partition key:

~~~kusto
.alter table [table_name] policy partitioning ```
{
  "PartitionKeys": [
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
~~~

Set a policy with two kinds of partition keys:

~~~kusto
.alter table [table_name] policy partitioning ```
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
~~~
