---
title: .show database extents partitioning statistics command
description: Learn how to use the `.show database extents partitioning statistics` command to display the database's partitioning statistics.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 08/17/2023
---
# .show database extents partitioning statistics

Displays statistics of data partitioning for all tables in the database that have a [data partitioning policy](partitioning-policy.md) defined.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `extents` `partitioning` `statistics`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to show the partitioning statistics.|

## Returns

| Column name   | Column type | Description |
| --- | --- | --- |
| TableName | `string` | The name of the table |
| PartitioningPolicy |`dynamic` | JSON representation of the policy |
| TotalRowCount | `long` | Total number of rows in the table`*` |
| PartitionedRowCount | `long` | Number of partitioned rows in the table`*` |
| PartitionedRowPercentage | `real` | Percentage of partitioned rows from all rows in the table`*` |

`*` *Values may be up to 15 minutes old, as they're taken from a cached summary of the table's extents.*

