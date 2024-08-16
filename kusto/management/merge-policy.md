---
title: Extents merge policy
description: Learn how to use the merge policy to define how extents are merged.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 08/11/2024
---
# Merge policy

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The merge policy defines if and how [Extents (data shards)](../management/extents-overview.md) should get merged.

There are two types of merge operations: `Merge`, which rebuilds indexes, and `Rebuild`, which completely reingests the data.

Both operation types result in a single extent that replaces the source extents.

By default, `Rebuild` operations are preferred. If there are extents that don't fit the criteria for being rebuilt, then an attempt will be made to merge them.

> [!NOTE]
>
> * Tagging extents using *different* `drop-by` tags will cause such extents to not be merged, even if a merge policy has been set. For more information, see [Extent tags](../management/extent-tags.md).
> * Extents whose union of tags exceeds the length of 1M characters will not be merged.
> * The database's or table's [Sharding policy](sharding-policy.md) also has some effect on how extents get merged.

## Merge policy properties

The merge policy contains the following properties:

* **RowCountUpperBoundForMerge**:
  * Defaults to 16,000,000.
  * Maximum allowed row count of the merged extent.
  * Applies to Merge operations, not Rebuild.  
* **OriginalSizeMBUpperBoundForMerge**:
  * Defaults to 30,000.
  * Maximum allowed original size (in MBs) of the merged extent.
  * Applies to Merge operations, not Rebuild.  
* **MaxExtentsToMerge**:
  * Defaults to 100.
  * Maximum allowed number of extents to be merged in a single operation.
  * Applies to Merge operations.
  * This value shouldn't be changed.
* **AllowRebuild**:
  * Defaults to 'true'.
  * Defines whether `Rebuild` operations are enabled (in which case, they're preferred over `Merge` operations).
* **AllowMerge**:
  * Defaults to 'true'.
  * Defines whether `Merge` operations are enabled, in which case, they're less preferred than `Rebuild` operations.
* **MaxRangeInHours**:
  * Defaults to 24.
  * The maximum allowed difference, in hours, between any two different extents' creation times, so that they can still be merged.
  * Timestamps are of extent creation, and don't relate to the actual data contained in the extents.
  * Applies to both Merge and Rebuild operations.
  * In [materialized views](materialized-views/materialized-view-overview.md): defaults to 336 (14 days), *unless* recoverability is disabled in the materialized view's effective [retention policy](retention-policy.md).
  * This value should be set according to the effective [retention policy](retention-policy.md) *SoftDeletePeriod*, or [cache policy](cache-policy.md) *DataHotSpan* values. Take the lower value of *SoftDeletePeriod* and *DataHotSpan*. Set the *MaxRangeInHours* value to between 2-3% of it. See the [examples](#maxrangeinhours-examples) .
* **Lookback**:
  * Defines the timespan during which extents are considered for rebuild/merge.
  * Supported values:
    * `Default` - The system-managed default. This is the recommended and default value, whose period is currently set to 14 days.
    * `All` - All extents, hot and cold, are included.
    * `HotCache` - Only hot extents are included.
    * `Custom` - Only extents whose age is under the provided `CustomPeriod` are included. `CustomPeriod` is a timespan value.

## Default policy example

The following example shows the default policy:

```json
{
  "RowCountUpperBoundForMerge": 16000000,
  "OriginalSizeMBUpperBoundForMerge": 30000,
  "MaxExtentsToMerge": 100,,
  "MaxRangeInHours": 24,
  "AllowRebuild": true,
  "AllowMerge": true,
  "Lookback": {
    "Kind": "Default",
    "CustomPeriod": null
  }
}
```

## MaxRangeInHours examples

|min(SoftDeletePeriod (Retention Policy), DataHotSpan (Cache Policy))|Max Range in hours (Merge Policy)|
|--------------------------------------------------------------------|---------------------------------|
|7 days (168 hours)                                                  | 4                               |
|14 days (336 hours)                                                 | 8                               |
|30 days (720 hours)                                                 | 18                              |
|60 days (1,440 hours)                                               | 36                              |
|90 days (2,160 hours)                                               | 60                              |
|180 days (4,320 hours)                                              | 120                             |
|365 days (8,760 hours)                                              | 250                             |

> [!WARNING]
> Consult with the support team before altering an extents merge policy.

When a database is created, it's set with the default merge policy values mentioned above. The policy is by default inherited by all tables created in the database, unless their policies are explicitly overridden at table-level.

For more information, see [management commands that allow you to manage merge policies for databases or tables](show-table-merge-policy-command.md).
