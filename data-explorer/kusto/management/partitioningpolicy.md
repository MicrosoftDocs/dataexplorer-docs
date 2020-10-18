---
title: Data partitioning policy - Azure Data Explorer
description: This article describes Data partitioning policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 06/10/2020
---
# Data partitioning policy

The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table.

The main purpose of the policy is to improve performance of queries that are known to narrow the data set by filtering on the partitioned columns, or aggregate/join on a high cardinality string column. The policy may also result in better compression of the data.

> [!CAUTION]
> There are no hard-coded limits set on the number of tables with the partitioning policy defined. However, every additional table adds overhead to the background data partitioning process that runs on the cluster's nodes. Adding tables may result in more cluster resources being used. For more information, see [Monitoring](#monitoring) and [Capacity](#capacity).

## Partition keys

The following kinds of partition keys are supported.

|Kind                                                   |Column Type |Partition properties                    |Partition value                                        |
|-------------------------------------------------------|------------|----------------------------------------|----------------------|
|[Hash](#hash-partition-key)                            |`string`    |`Function`, `MaxPartitionCount`, `Seed` | `Function`(`ColumnName`, `MaxPartitionCount`, `Seed`) |
|[Uniform range](#uniform-range-datetime-partition-key) |`datetime`  |`RangeSize`, `Reference`                | `bin_at`(`ColumnName`, `RangeSize`, `Reference`)      |

### Hash partition key

> [!NOTE]
> Apply a hash partition key on a `string`-type column in a table only in the following instances:
> * If the majority of queries use equality filters (`==`, `in()`).
> * The majority of queries aggregate/join on a specific `string`-typed column of *large-dimension* (cardinality of 10M or higher) such as an `application_ID`, a `tenant_ID`, or a `user_ID`.

* A hash-modulo function is used to partition the data.
* Data in homogeneous (partitioned) extents is ordered by the hash partition key.
  * You don't need to include the hash partition key in the [row order policy](roworderpolicy.md), if one is defined on the table.
* Queries that use the [shuffle strategy](../query/shufflequery.md), and in which the `shuffle key` used in `join`, `summarize` or `make-series` is the table's hash partition key, are expected to perform better because the amount of data required to move across cluster nodes is reduced.

#### Partition properties

* `Function` is the name of a hash-modulo function to use.
  * Supported value: `XxHash64`.
* `MaxPartitionCount` is the maximum number of partitions to create (the modulo argument to the hash-modulo function) per time period.
  * Supported values are in the range `(1,2048]`.
    * The value is expected to be:
      * Larger than five times the number of nodes in the cluster.
      * Smaller than the cardinality of the column.
    * The higher the value is, the greater the overhead of the data partitioning process on the cluster's nodes, and the higher the number of extents for each time period.
    * For clusters with fewer than 50 nodes, we recommend that you start with a value of `256`.
      * Adjust the value as needed, based on the above considerations (for example, the number of nodes in the cluster grows), or based on the benefit in query performance 
        vs. the overhead of partitioning the data post-ingestion.
* `Seed` is the value to use for randomizing the hash value.
  * The value should be a positive integer.
  * The recommended value is `1`, which is the default value.
* `PartitionAssignmentMode` is the mode used for assigning partitions to nodes in the cluster.
  * Supported modes:
    * `Default`: All homogeneous (partitioned) extents that belong to the same partition are assigned to the same node.
    * `Uniform`: An extents' partition values are disregarded, and extents are assigned uniformly to the cluster's nodes.
  * If queries don't join or aggregate on the hash partition key, use `Uniform`. Otherwise, use `Default`.

#### Example

A hash partition key over a `string`-typed column named `tenant_id`.
It uses the `XxHash64` hash function, with a `MaxPartitionCount` of `256`, and the default `Seed` of `1`.

```json
{
  "ColumnName": "tenant_id",
  "Kind": "Hash",
  "Properties": {
    "Function": "XxHash64",
    "MaxPartitionCount": 256,
    "Seed": 1,
    "PartitionAssignmentMode": "Default"
  }
}
```

### Uniform range datetime partition key

> [!NOTE] 
> Only apply a uniform range datetime partition key on a `datetime`-typed column in a table when data ingested into the table is unlikely to be ordered according to this column.

In such cases, it can be helpful to reshuffle the data between extents so that each extent ends up including records from a limited time range. This process will result with filters on that `datetime` column being more effective at query time.

The partition function used is [bin_at()](../query/binatfunction.md) and isn't customizable.

#### Partition properties

* `RangeSize` is a `timespan` scalar constant that indicates the size of each datetime partition.
  Recommendations:
  * Start with the value `1.00:00:00` (one day).
  * Don't set a shorter value, because it may result in the table having a large number of small extents that can't be merged.
* `Reference` is a `datetime` scalar constant that indicates a fixed point in time, according to which datetime partitions are aligned.
  * We recommend you start with `1970-01-01 00:00:00`.
  * If there are records in which the datetime partition key has `null` values, their partition value is set to the value of `Reference`.

#### Example

The code snippet shows a uniform datetime range partition key over a `datetime` typed column named `timestamp`.
It uses `datetime(1970-01-01)` as its reference point, with a size of `1d` for each partition.

```json
{
  "ColumnName": "timestamp",
  "Kind": "UniformRange",
  "Properties": {
    "Reference": "1970-01-01T00:00:00",
    "RangeSize": "1.00:00:00"
  }
}
```

## The policy object

By default, a table's data partitioning policy is `null`, in which case data in the table won't be partitioned.

The data partitioning policy has the following main properties:

* **PartitionKeys**:
  * A collection of [partition keys](#partition-keys) that define how to partition the data in the table.
  * A table can have up to `2` partition keys, with one of the following options:
    * One [hash partition key](#hash-partition-key).
    * One [uniform range datetime partition key](#uniform-range-datetime-partition-key).
    * One [hash partition key](#hash-partition-key) and one [uniform range datetime partition key](#uniform-range-datetime-partition-key).
  * Each partition key has the following properties:
    * `ColumnName`: `string ` - The name of the column according to which the data will be partitioned.
    * `Kind`: `string` - The data partitioning kind to apply (`Hash` or `UniformRange`).
    * `Properties`: `property bag` - Defines parameters according to which partitioning is done.

* **EffectiveDateTime**:
  * The UTC datetime from which the policy is effective.
  * This property is optional. If it isn't specified, the policy will take effect on data ingested after the policy was applied.
  * Any non-homogeneous (non-partitioned) extents that may be dropped because of retention are ignored by the partitioning process. The extents are ignored because their creation time precedes 90% of the table's effective soft-delete period.
  * **Note:** It's possible to set a datetime value in the past, and have that result with already ingested data getting partitioned.
    However, doing so may significantly increase use of resources in the partitioning process, and so you should weigh the benefits.

### Example

Data partitioning policy object with two partition keys.
1. A hash partition key over a `string`-typed column named `tenant_id`.
    * It uses the `XxHash64` hash function, with a `MaxPartitionCount` of 256, and the default `Seed` of `1`.
1. A uniform datetime range partition key over a `datetime` type column named `timestamp`.
    * It uses `datetime(1970-01-01)` as its reference point, with a size of `1d` for each partition.

```json
{
  "PartitionKeys": [
    {
      "ColumnName": "tenant_id",
      "Kind": "Hash",
      "Properties": {
        "Function": "XxHash64",
        "MaxPartitionCount": 256,
        "Seed": 1,
        "PartitionAssignmentMode": "Default"
      }
    },
    {
      "ColumnName": "timestamp",
      "Kind": "UniformRange",
      "Properties": {
        "Reference": "1970-01-01T00:00:00",
        "RangeSize": "1.00:00:00"
      }
    }
  ]
}
```

### Additional properties

The following properties can be defined as part of the policy. These properties are optional and we recommend not changing them.

* **MinRowCountPerOperation**:
  * Minimum target for the sum of row count of the source extents of a single data partitioning operation.
  * This property is optional. Its default value is `0`.

* **MaxRowCountPerOperation**:
  * Maximum target for the sum of the row count of the source extents of a single data partitioning operation.
  * This property is optional. Its default value is `0`, with a default target of 5,000,000 records.
    * You can set a value lower than 5M if you see that the partitioning operations consume a large amount
      of memory or CPU, per operation. For more information, see [Monitoring](#monitoring).

## Notes

### The data partitioning process

* Data partitioning runs as a post-ingestion background process in the cluster.
  * A table that is continuously ingested into is expected to always have a "tail" of data that is yet to be partitioned (non-homogeneous extents).
* Data partitioning runs only on hot extents, regardless of the value of the `EffectiveDateTime` property in the policy.
  * If partitioning cold extents is required, you need to temporarily adjust the [caching policy](cachepolicy.md).

#### Monitoring

Use the [.show diagnostics](../management/diagnostics.md#show-diagnostics) command to monitor the progress or state of partitioning in a cluster.

```kusto
.show diagnostics
| project MinPartitioningPercentageInSingleTable, TableWithMinPartitioningPercentage
```

The output includes:

  * `MinPartitioningPercentageInSingleTable`: The minimal percentage of partitioned data across all tables that have a data partitioning policy in the cluster.
    * If this percentage remains constantly under 90%, then evaluate the cluster's partitioning [capacity](partitioningpolicy.md#capacity).
  * `TableWithMinPartitioningPercentage`: The fully qualified name of the table whose partitioning percentage is shown above.

Use [.show commands](commands.md) to monitor the partitioning commands and their resource use. For example:

```kusto
.show commands 
| where StartedOn > ago(1d)
| where CommandType == "ExtentsPartition"
| parse Text with ".partition async table " TableName " extents" *
| summarize count(), sum(TotalCpu), avg(tolong(ResourcesUtilization.MemoryPeak)) by TableName, bin(StartedOn, 15m)
| render timechart with(ysplit = panels)
```

#### Capacity

* The data partitioning process results in the creation of more extents. The cluster may gradually increase its [extents merge capacity](../management/capacitypolicy.md#extents-merge-capacity), so that the process of [merging extents](../management/extents-overview.md) can keep up.
* If there's a high ingestion throughput, or a large enough number of tables that have a partitioning policy defined, then the cluster may gradually increase its
  [Extents partition capacity](../management/capacitypolicy.md#extents-partition-capacity), so that [the process of partitioning extents](#the-data-partitioning-process) can keep up.
* To avoid consuming too many resources, these dynamic increases are capped. You may be required to gradually and linearly increase them beyond the cap, if they're used up entirely.
  * If increasing the capacities causes a significant increase in the use of the cluster's resources, you can scale the cluster
    [up](../../manage-cluster-vertical-scaling.md)/[out](../../manage-cluster-horizontal-scaling.md), either manually, or by enabling autoscale.

### Outliers in partitioned columns

* If a hash partition key includes values that are much more prevalent than others, for example, an empty string, or a generic value (such as `null` or `N/A`), or they represent an entity (such as `tenant_id`) that is more prevalent in the data set, that could contribute to imbalanced distribution of data across the cluster's nodes, and degrade query performance.
* If a uniform range datetime partition key has a large enough percentage of values that are "far" from the majority of the values in the column, for example, datetime values from the distant past or future, then that could increase the overhead of the data partitioning process, and lead to many small extents that the cluster will need to keep track of.

In both of these cases, either "fix" the data, or filter out any irrelevant records in the data before or at ingestion time, to reduce the overhead of the data partitioning on the cluster. For example, use an [update policy](updatepolicy.md).

## Next steps

Use the [partitioning policy control commands](../management/partitioning-policy.md) to manage data partitioning policies for tables.
