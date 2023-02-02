---
title: .alter table partitioning policy command- Azure Data Explorer
description: This article describes the .alter table partitioning policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 01/13/2022
---
# .alter table partitioning policy

Changes a table [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

This command requires [database admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter` `table` *TableName* `policy` `partitioning` *PolicyObject*

## Arguments

- *TableName* - Specify the name of the table.  
- *PolicyObject* - Define a policy object, see also [partitioning policy](partitioningpolicy.md).

### Example

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
