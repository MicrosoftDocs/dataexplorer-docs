---
title: Data partitioning policy (Preview) - Azure Data Explorer | Microsoft Docs
description: This article describes Data partitioning policy (Preview) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/28/2020
---
# Data partitioning policy (Preview)

The partitioning policy defines if and how [Extents (data shards)](../management/extents-overview.md) should be partitioned, for a specific table.

> [!NOTE]
> The data partitioning feature is in *preview*.

The main purpose of the policy is to improve performance of queries which are known to be narrowed to a small subset of values in the partitioned column(s).
A secondary potential benefit is better compression of the data.

While there are no hard-coded limits set on the amount of tables that can have the policy defined on them, every additional table adds
overhead to the background data partitioning process running on the cluster's nodes, and may require additional resources from the cluster.

## Partition keys

The following kinds of partition keys are supported:

|Kind                                                   |Column Type |Partition properties                    |Partition value                                        |
|-------------------------------------------------------|------------|----------------------------------------|-------------------------------------------------------|
|[Hash](#hash-partition-key)                            |`string`    |`Function`, `MaxPartitionCount`, `Seed` | `Function`(`ColumnName`, `MaxPartitionCount`, `Seed`) |
|[Uniform range](#uniform-range-datetime-partition-key) |`datetime`  |`RangeSize`, `Reference`                | `bin_at`(`ColumnName`, `RangeSize`, `Reference`)      |

### Hash partition key

Applying a hash partition key on a `string`-typed column in a table is appropriate when the *majority* of queries use equality filters (`==`, `in()`)
on a specific `string`-typed column of *large-dimension*, such as `application_ID`, `tenant_ID` or `user_ID`.

* A hash-modulo function is used to partition the data.
* All *homogeneous* (partitioned) extents that belong to the same partition are assigned to the same data node.
* Data in *homogeneous* (partitioned) extents is ordered by the hash partition key.
  * It's not required include the partition key in a [row order policy](roworderpolicy.md), if one is defined on the table.
* *Future* optimizations will also benefit queries which perform `join` and/or `summarize` when the `shufflekey` is the table's [hash partition key](#hash-partition-key).

#### Partition properties

* `Function` is the name of a hash-modulo function to use.
  * Supported value: `XxHash64`.
* `MaxPartitionCount` is the maximum number of partitions to create (the modulo argument to the hash-modulo function) per time period.
  * Supported are values in the range `(1,1024]`.
    * The value is expected to be:
      * Larger than the amount of nodes in the cluster
      * Smaller than the cardinality of the column.
    * The higher the value is, the larger the overhead of the data partitioning process on the cluster's nodes will be, and the higher the amount of extents for each time period will be.
    * A recommended value to start with is `256`.
      * If required, it can be adjusted (usually upwards), based on the aforementioned considerations, and/or based on measuring the benefit in query query performance 
        vs. overhead of partitioning the data post-ingestion.
* `Seed` is the value to use for randomizing the hash value.
  * The value should be a positive integer.
  * The recommended (and default, if unspecified) value is `1`.

#### Example

The following is a hash partition key over a `string`-typed column named `tenant_id`.

It uses the `XxHash64` hash function, with a `MaxPartitionCount` of `256`, and the default `Seed` of `1`.

```json
{
  "ColumnName": "tenant_id",
  "Kind": "Hash",
  "Properties": {
    "Function": "XxHash64",
    "MaxPartitionCount": 256,
    "Seed": 1
  }
}
```

### Uniform range datetime partition key

Applying a uniform range datetime partition key on a `datetime`-typed column in a table is appropriate when data ingested into the table is
*unlikely* to be ordered according to this column. In such cases, it can be helpful to re-shuffle the data between extents so that each extent
ends up including records from a limited time range, resulting with filters on the `datetime` column at query time being more efficient.

* The partition function used is [bin_at()](../query/binatfunction.md) and isn't customizable.

#### Partition properties

* `RangeSize` is a `timespan` scalar constant that indicates the size of each datetime partition.
* `Reference` is a `datetime` scalar constant of type that indicates a fixed point in time according to which datetime partitions are aligned.

#### Example

The following is a uniform datetime range partition key over a `datetime`typed column named `timestamp`

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

By default, a table's data partitioning policy is `null`, in which case data in the table will not be partitioned.

The data partitioning policy has the following main properties:

* **PartitionKeys**:
  * A collection of [partition keys](#partition-keys) which define how to partition the data in the table.
  * A table can have up to `2` partition keys, with one of the following 3 options:
    * 1 [hash partition key](#hash-partition-key).
    * 1 [uniform range datetime partition key](#uniform-range-datetime-partition-key).
    * 1 [hash partition key](#hash-partition-key) and 1 [uniform range datetime partition key](#uniform-range-datetime-partition-key).
  * Each partition key has the following properties:
    * `ColumnName`: `string ` - The name of the column according to which the data will be partitioned.
    * `Kind`: `string` - The data partitioning kind to apply (`Hash` or `UniformRange`).
    * `Properties`: `property bag` - defines parameters according to which partitioning is done.

* **EffectiveDateTime**:
  * The UTC datetime from which the policy is effective.
  * This property is *optional* - if not specified, the policy will take effect on data ingested after the policy was applied.
  * Any non-homogeneous (non-partitioned) extents that are bound to soon be dropped due to retention (that is, their creation time
    precedes 90% of the table's effective soft-delete period) are disregarded by the partitioning process.

### Example

The following is a data partitioning policy object with two partition keys:
1. A hash partition key over a `string`-typed column named `tenant_id`.
    - It uses the `XxHash64` hash function, with a `MaxPartitionCount` of 256, and the default `Seed` of `1`.
2. A uniform datetime range partition key over a `datetime`typed column named `timestamp`
    - It uses `datetime(1970-01-01)` as its reference point, with a size of `1d` for each partition.

```json
{
  "PartitionKeys": [
    {
      "ColumnName": "tenant_id",
      "Kind": "Hash",
      "Properties": {
        "Function": "XxHash64",
        "MaxPartitionCount": 256,
        "Seed": 1
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

The following properties can be defined as part of the policy, but are *optional* and it is not recommended to change them.

* **MinRowCountPerOperation**:
  * Minimum target for the sum of row count of the source extents of a single data partitioning operation.
  * This property is *optional*, with its default value being `0`.

* **MaxRowCountPerOperation**:
  * Maximum target for the sum of row count of the source extents of a single data partitioning operation.
  * This property is *optional*, with its default value being `0` (in which case, a default target of 5,000,000 records is in effect).

## Notes

### The data partitioning process

* Data partitioning runs as a post-ingestion background process in the cluster.
  * A table which is continuously being ingested into is expected to always have a "tail" of data which is yet to be partitioned (*non-homogeneous* extents).
* Data partitioning runs only on hot extents, regardless of the value of the `EffectiveDateTime` property in the policy.
  * If partitioning cold extents is required, you need to temporarily adjust the [caching policy](cachepolicy.md) accordingly.

#### Monitoring

* You can monitor the progress/state of partitioning in a cluster using the [.show diagnostics](../management/diagnostics.md#show-diagnostics) command:

```kusto
.show diagnostics
| project MinPartitioningPercentageInSingleTable,
          TableWithMinPartitioningPercentage
```

The output includes:

  * `MinPartitioningPercentageInSingleTable`: the minimal percentage of partitioned data across all tables that have a data partitioning policy in the cluster.
      * If this percentage remains constantly under 90%, evaluate the cluster's partitioning capacity (see [below](partitioningpolicy.md#capacity)).
  * `TableWithMinPartitioningPercentage`: the fully qualified name of the table whose partitioning percentage is shown above.

#### Capacity

* As the data partitioning process results in the creation of more extents, you might be required to increase the cluster's
  [Extents merge capacity](../management/capacitypolicy.md#extents-merge-capacity) so that the [extents merging](../management/extents-overview.md) process is able to keep up.
* If it's required (for instance, in case of high ingestion throughput, and/or a large enough number of tables that require partitioning), the cluster's
  [Extents partition capacity](../management/capacitypolicy.md#extents-partition-capacity) can be increased to allow running a higher number of
  concurrent partitioning operations.
  * In case increasing the partitioning causes a significant increase in the use of the cluster's resources, scale the cluster
    up/out, either manually, or by enabling auto-scale.

### Outliers in partitioned columns

* If a hash partition key has a large enough percentage of values which aren't populated properly (for example, they are empty, or have a generic value), that could contribute to having
  a non-balanced distribution of data across the cluster's nodes.
* If a uniform range datetime partition key has a large enough percentage of values which are "far" from the majority of the values in the column (for example, datetime values from the distant
  past or future).

In both of these cases, you should either "fix" the data, or filter out any irrelevant records in the data before or at ingestion time (for example, using an
[update policy](updatepolicy.md)), to reduce the overhead of the data partitioning on the cluster).

## Next steps

Use the [partitioning policy control commands](../management/partitioning-policy.md) to manage data partitioning policies for tables.