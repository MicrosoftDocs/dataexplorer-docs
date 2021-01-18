---
title: Data partitioning policy management - Azure Data Explorer | Microsoft Docs
description: This article describes Data partitioning policy management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/04/2020
---
# partitioning policy command

The data partitioning policy is detailed [here](../management/partitioningpolicy.md).

## show policy

```kusto
.show table [table_name] policy partitioning
```

The `.show` command displays the partitioning policy that is applied on the table.

### Output

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|DataPartitioning | Table name | JSON serialization of the policy object | null | Table

## alter and alter-merge policy

```kusto
.alter table [table_name] policy partitioning @'policy object, serialized as JSON'

.alter-merge table [table_name] policy partitioning @'partial policy object, serialized as JSON'
```

The `.alter` command allows changing the partitioning policy that is applied on the table.

The command requires [DatabaseAdmin](access-control/role-based-authorization.md) permissions.

Changes to the policy could take up to 1 hour to take effect.

### Examples

#### Setting a policy with a hash partition key

```kusto
.alter table [table_name] policy partitioning @'{'
  '"PartitionKeys": ['
    '{'
      '"ColumnName": "my_string_column",'
      '"Kind": "Hash",'
      '"Properties": {'
        '"Function": "XxHash64",'
        '"MaxPartitionCount": 256,'
      '}'
    '}'
  ']'
'}'
```

#### Setting a policy with a uniform range datetime partition key

```kusto
.alter table [table_name] policy partitioning @'{'
  '"PartitionKeys": ['
    '{'
      '"ColumnName": "my_datetime_column",'
      '"Kind": "UniformRange",'
      '"Properties": {'
        '"Reference": "1970-01-01T00:00:00",'
        '"RangeSize": "1.00:00:00"'
        '"OverrideCreationTime": false'
      '}'
    '}'
  ']'
'}'
```

#### Setting a policy with both kinds of partition keys

```kusto
.alter table [table_name] policy partitioning @'{'
  '"PartitionKeys": ['
    '{'
      '"ColumnName": "my_string_column",'
      '"Kind": "Hash",'
      '"Properties": {'
        '"Function": "XxHash64",'
        '"MaxPartitionCount": 256,'
      '}'
    '},'
    '{'
      '"ColumnName": "my_datetime_column",'
      '"Kind": "UniformRange",'
      '"Properties": {'
        '"Reference": "1970-01-01T00:00:00",'
        '"RangeSize": "1.00:00:00"'
        '"OverrideCreationTime": false'
      '}'
    '}'
  ']'
'}'
```

#### Setting a specific property of the policy explicitly at table level

To set the `EffectiveDateTime` of the policy to a different value, use the following command:

```kusto
.alter-merge table [table_name] policy partitioning @'{"EffectiveDateTime":"2020-01-01"}'
```

## delete policy

```kusto
.delete table [table_name] policy partitioning
```

The `.delete` command deletes the partitioning policy of the given table.
