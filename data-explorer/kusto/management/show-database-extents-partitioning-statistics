---
title: .show database extents partitioning statistics
description: Learn how to use the `.show database extents partitioning statistics` command to display the database's partitioning statistics.
ms.reviewer: ?
ms.topic: reference
ms.date: 08/01/2023
---
# .show database extents partitioning statistics

Displays the database's [partitioning policy](partitioningpolicy.md) statistics.  The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `extents` `partitioning` `statistics`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to show the partitioning statistics.|

## Returns

|Column name       |Column type|Description                                                                  |
|------------------|-----------|-----------------------------------------------------------------------------|
|TableName      |`string`   |The name of the table
|PartitioningPolicy |`dynamic`   | JSON representation of the policy
|TotalRowCount           |`long`   |Total number of rows in the table
|PartitionedRowCount         |`long`     |Number of rows partitioned
|PartitionedRowPercentage|`real`   |Percentage of partitioned row over total number of rows
