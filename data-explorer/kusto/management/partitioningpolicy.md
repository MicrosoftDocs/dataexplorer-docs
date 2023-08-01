---
title: Partitioning policy
description: Learn how to use the partitioning policy to improve query performance.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/01/2023
---
# Partitioning policy

The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

The main purpose of the partitioning policy is to improve performance of queries in [specific scenarios](#supported-scenarios).

> [!NOTE]
> By default, extents are partitioned by time of creation (ingestion), and in most cases there's no need to set a data partitioning policy.

## Supported scenarios

The following are the only scenarios in which setting a data partitioning policy is recommended. In all other scenarios, setting the policy isn't advised.

* **Frequent filters on a medium or high cardinality `string` or `guid` column**:
  * For example: multi-tenant solutions, or a metrics table where most or all queries filter on a column of type `string` or `guid`, such as the `TenantId` or the `MetricId`.
  * Medium cardinality is at least 10,000 distinct values.
  * Set the [hash partition key](#hash-partition-key) to be the `string` or `guid` column, and set the [`PartitionAssigmentMode` property](#partition-properties) to `uniform`.
* **Frequent aggregations or joins on a high cardinality `string` or `guid` column**:
  * For example, IoT information from many different sensors, or academic records of many different students. 
  * High cardinality is at least 1,000,000 distinct values, where the distribution of values in the column is approximately even.
  * In this case, set the [hash partition key](#hash-partition-key) to be the column frequently grouped-by or joined-on, and set the [`PartitionAssigmentMode` property](#partition-properties) to `ByPartition`.
* **Out-of-order data ingestion**:
  * Data ingested into a table might not be ordered and partitioned into extents (shards) according to a specific `datetime` column that represents the data creation time and is commonly used to filter data. This could be due to a backfill from heterogeneous source files that include datetime values over a large time span. 
  * In this case, set the [uniform range datetime partition key](#uniform-range-datetime-partition-key) to be the `datetime` column.
  * If you need retention and caching policies to align with the datetime values in the column, instead of aligning with the time of ingestion, set the `OverrideCreationTime` property to `true`.

> [!CAUTION]
>
> * There are no hard-coded limits set on the number of tables with the partitioning policy defined.
>   * However, every additional table adds overhead to the background data partitioning process that runs on the cluster's nodes. Setting a policy on more tables will result in more cluster resources being used, and higher cost due to underlying storage transactions.
>   * For more information, see [capacity](#partitioning-capacity).
> * It isn't recommended to set a partitioning policy if the compressed size of data per partition is expected to be less than 1GB.
> * Before applying a partitioning policy on a materialized view, review the recommendations for [materialized views partitioning policy](materialized-views/materialized-view-policies.md#partitioning-policy).

## Partition keys

The following kinds of partition keys are supported.

|Kind                                                   |Column Type |Partition properties                                               |Partition value                                        |
|-------------------------------------------------------|------------------|-------------------------------------------------------------------|-------------------------------------------------------|
|[Hash](#hash-partition-key)                            |`string` or `guid`|`Function`, `MaxPartitionCount`, `Seed`, `PartitionAssignmentMode` | `Function`(`ColumnName`, `MaxPartitionCount`, `Seed`) |
|[Uniform range](#uniform-range-datetime-partition-key) |`datetime`        |`RangeSize`, `Reference`, `OverrideCreationTime`                   | `bin_at`(`ColumnName`, `RangeSize`, `Reference`)      |

### Hash partition key

> [!NOTE]
> The data partitioning operation adds significant processing load. We recommend applying a hash partition key on a table only under the following conditions:
> * If the majority of queries use equality filters (`==`, `in()`).
> * The majority of queries aggregate/join on a specific column of type `string` or `guid` which is of *large-dimension* (cardinality of 10M or higher), such as an `device_ID`, or `user_ID`.
> * The usage pattern of the partitioned tables is in high concurrency query load, such as in monitoring or dashboarding applications. 

* A hash-modulo function is used to partition the data.
* Data in homogeneous (partitioned) extents is ordered by the hash partition key.
  * You don't need to include the hash partition key in the [row order policy](roworderpolicy.md), if one is defined on the table.
* Queries that use the [shuffle strategy](../query/shufflequery.md), and in which the `shuffle key` used in `join`, `summarize` or `make-series` is the table's hash partition key, are expected to perform better because the amount of data required to move across cluster nodes is reduced.

#### Partition properties

|Property | Description | Supported value(s)| Recommended value |
|---|---|---|---|
| `Function` | The name of a hash-modulo function to use.| `XxHash64` | |
| `MaxPartitionCount` | The maximum number of partitions to create (the modulo argument to the hash-modulo function) per time period. | In the range `(1,2048]`. |  Higher values lead to greater overhead of the data partitioning process on the cluster's nodes, and a higher number of extents for each time period. The recommended value is `128`. Higher values will significantly increase the overhead of partitioning the data post-ingestion, and the size of metadata - and are therefore not recommended.
| `Seed` | Use for randomizing the hash value. | A positive integer. | `1`, which is also the default value. |
| `PartitionAssignmentMode` | The mode used for assigning partitions to nodes in the cluster. | `ByPartition`: All homogeneous (partitioned) extents that belong to the same partition are assigned to the same node. <br> `Uniform`: An extents' partition values are disregarded. Extents are assigned uniformly to the cluster's nodes. | If queries don't join or aggregate on the hash partition key, use `Uniform`. Otherwise, use `ByPartition`. |

#### Hash partition key example

A hash partition key over a `string`-typed column named `tenant_id`.
It uses the `XxHash64` hash function, with `MaxPartitionCount` set to the recommended value `128`, and the default `Seed` of `1`.

```json
{
  "ColumnName": "tenant_id",
  "Kind": "Hash",
  "Properties": {
    "Function": "XxHash64",
    "MaxPartitionCount": 128,
    "Seed": 1,
    "PartitionAssignmentMode": "Uniform"
  }
}
```

### Uniform range datetime partition key

> [!NOTE] 
> Only apply a uniform range datetime partition key on a `datetime`-typed column in a table when data ingested into the table is unlikely to be ordered according to this column.

In these cases, you can reshuffle the data between extents so that each extent includes records from a limited time range. This process results in filters on the `datetime` column being more effective at query time.

The partition function used is [bin_at()](../query/binatfunction.md) and isn't customizable.

#### Partition properties

|Property                | Description                                                                                                                                                     | Recommended value                                                                                                                                                                                                                                                            |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `RangeSize`            | A `timespan` scalar constant that indicates the size of each datetime partition.                                                                                | Start with the value `1.00:00:00` (one day). Don't set a shorter value, because it may result in the table having a large number of small extents that can't be merged.                                                                                                      |
| `Reference`            | A `datetime` scalar constant that indicates a fixed point in time, according to which datetime partitions are aligned.                                          | Start with `1970-01-01 00:00:00`. If there are records in which the datetime partition key has `null` values, their partition value is set to the value of `Reference`.                                                                                                      |
| `OverrideCreationTime` | A `bool` indicating whether or not the result extent's minimum and maximum creation times should be overridden by the range of the values in the partition key. | Defaults to `false`. Set to `true` if data isn't ingested in-order of time of arrival. For example, a single source file may include datetime values that are distant, and/or you may want to enforce retention or caching based on the datetime values rather than the time of ingestion.<br/><br/>When `OverrideCreationTime` is set to `true`, extents may be missed in the merge process. Extents are missed if their creation time is older than the `Lookback` period of the table's [Extents merge policy](mergepolicy.md). To make sure that the extents are discoverable, set the `Lookback` property to `HotCache`.|

#### Uniform range datetime partition example

The snippet shows a uniform datetime range partition key over a `datetime` typed column named `timestamp`.
It uses `datetime(2021-01-01)` as its reference point, with a size of `7d` for each partition, and doesn't
override the extents' creation times.

```json
{
  "ColumnName": "timestamp",
  "Kind": "UniformRange",
  "Properties": {
    "Reference": "2021-01-01T00:00:00",
    "RangeSize": "7.00:00:00",
    "OverrideCreationTime": false
  }
}
```

## The policy object

By default, a table's data partitioning policy is `null`, in which case data in the table won't be repartitioned after it's ingested.

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
  * This property is optional. If it isn't specified, the policy will take effect for data ingested after the policy was applied.
  	
> [!CAUTION]
> * You can set a datetime value in the past and partition already-ingested data. However, this practice may significantly increase resources used in the partitioning process.
> * In most cases, it is recommended to only have newly ingested data partitioned, and to avoid partitioning large amounts of historical data.
> * If you choose to partition historical data, consider doing so gradually, by setting the *EffectiveDateTime* to a previous `datetime` in steps of up to a few days each time you alter the policy.

### Data partitioning example

Data partitioning policy object with two partition keys.
1. A hash partition key over a `string`-typed column named `tenant_id`.
    * It uses the `XxHash64` hash function, with `MaxPartitionCount` set to the recommended value `128`, and the default `Seed` of `1`.
1. A uniform datetime range partition key over a `datetime` type column named `timestamp`.
    * It uses `datetime(2021-01-01)` as its reference point, with a size of `7d` for each partition.

```json
{
  "PartitionKeys": [
    {
      "ColumnName": "tenant_id",
      "Kind": "Hash",
      "Properties": {
        "Function": "XxHash64",
        "MaxPartitionCount": 128,
        "Seed": 1,
        "PartitionAssignmentMode": "Uniform"
      }
    },
    {
      "ColumnName": "timestamp",
      "Kind": "UniformRange",
      "Properties": {
        "Reference": "2021-01-01T00:00:00",
        "RangeSize": "7.00:00:00",
        "OverrideCreationTime": false
      }
    }
  ]
}
```

## Additional properties

The following properties can be defined as part of the policy. These properties are optional and we recommend not changing them.

|Property | Description | Recommended value | Default value |
|---|---|---|---|
| **MinRowCountPerOperation** |  Minimum target for the sum of row count of the source extents of a single data partitioning operation. | | `0` |
| **MaxRowCountPerOperation** |  Maximum target for the sum of the row count of the source extents of a single data partitioning operation. | Set a value lower than 5M if you see that the partitioning operations consume a large amount of memory or CPU per operation. | `0`, with a default target of 5,000,000 records. |
| **MaxOriginalSizePerOperation** |  Maximum target for the sum of the original size (in bytes) of the source extents of a single data partitioning operation. | If the partitioning operations consume a large amount of memory or CPU per operation, set a value lower than 5 GB. | `0`, with a default target of 5,368,709,120 bytes (5 GB). |

## The data partitioning process

* Data partitioning runs as a post-ingestion background process in the cluster.
  * A table that is continuously ingested into is expected to always have a "tail" of data that is yet to be partitioned (nonhomogeneous extents).
* Data partitioning runs only on hot extents, regardless of the value of the `EffectiveDateTime` property in the policy.
  * If partitioning cold extents is required, you need to temporarily adjust the [caching policy](cachepolicy.md).

You can monitor the partitioning process on each table in a database by using [.show database extents partitioning statistics](show-database-extents-partitioning-statistics).

### Partitioning capacity

* The data partitioning process results in the creation of more extents. The cluster may gradually increase its [extents merge capacity](../management/capacitypolicy.md#extents-merge-capacity), so that the process of [merging extents](../management/extents-overview.md) can keep up.
* If there's a high ingestion throughput, or a large enough number of tables that have a partitioning policy defined, then the cluster may gradually increase its [Extents partition capacity](../management/capacitypolicy.md#extents-partition-capacity), so that [the process of partitioning extents](#the-data-partitioning-process) can keep up.
* To avoid consuming too many resources, these dynamic increases are capped. You may be required to gradually and linearly increase them beyond the cap, if they're used up entirely.
  * If increasing the capacities causes a significant increase in the use of the cluster's resources, you can scale the cluster
    [up](../../manage-cluster-vertical-scaling.md)/[out](../../manage-cluster-horizontal-scaling.md), either manually, or by enabling autoscale.

### Limitations

* Attempts to partition data in a database that already has more than 5,000,000 extents will be throttled.
  * In such cases, the `EffectiveDateTime` property of partitioning policies of tables in the database will be automatically delayed by several hours, so that you can reevaluate your configuration and policies.

## Outliers in partitioned columns

* The following situations can contribute to imbalanced distribution of data across the cluster's nodes, and degrade query performance:
    * If a hash partition key includes values that are much more prevalent than others, for example, an empty string, or a generic value (such as `null` or `N/A`).
    * The values represent an entity (such as `tenant_id`) that is more prevalent in the data set.
* If a uniform range datetime partition key has a large enough percentage of values that are "far" from the majority of the values in the column, the overhead of the data partitioning process is increased and may lead to many small extents that the cluster will need to keep track of. An example of such a situation is datetime values from the distant past or future.

In both of these cases, either "fix" the data, or filter out any irrelevant records in the data before or at ingestion time, to reduce the overhead of the data partitioning on the cluster. For example, use an [update policy](updatepolicy.md).

## Next steps

Use the [partitioning policy management commands](./show-table-partitioning-policy-command.md) to manage data partitioning policies for tables.
