---
title: Extents merge policy - Azure Data Explorer | Microsoft Docs
description: This article describes Extents merge policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/26/2019
---
# Extents merge policy
The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the Kusto cluster should get merged.

There are 2 flavors for merge operations: `Merge` (which rebuilds indexes), and `Rebuild` (which completely re-ingests the data).

Both operation kinds result with a single extent which replaces the source extents.

By default, Rebuild operations are preferred, and only if there are any remaining extents which didn't fit the criteria for
being rebuilt, they are attempted to be Merged.  

*Notes:*
- Tagging extents using *different* `drop-by` tags will cause such extents to not be merged together, even if a Merge Policy has been set 
(see [Extent Tagging](../management/extents-overview.md#extent-tagging)).
- Extents whose union of tags exceeds the length of 1M characters will not be merged together.
- The database's / table's [Sharding policy](./shardingpolicy.md) also has some effect on how extents get merged together.

The merge policy contains the following properties:

- **RowCountUpperBoundForMerge**:
    - Defaults to 0.
    - Maximum allowed row count of the merged extent.
    - Applies to Merge operations, not Rebuild.  
- **MaxExtentsToMerge**:
    - Defaults to 100.
    - Maximum allowed number of extents to be merged in a single operation.
    - Applies to Merge operations.
- **LoopPeriod**:
    - Defaults to 01:00:00 (1 hour).
    - The maximum time to wait between starting 2 consecutive iterations of merge/rebuild operations 
    (performed by the Data Management service).
    - Applies to both Merge and Rebuild operations.
- **AllowRebuild**:
    - Defaults to 'true'.
    - Defines whether `Rebuild` operations are enabled (in which case, they are preferred over `Merge` operations).
- **AllowMerge**:
    - Defaults to 'true'.
    - Defines whether `Merge` operations are enabled (in which case, they are less preferred than `Rebuild` operations).
- **MaxRangeInHours**:
    - Defaults to 8.
    - Maximum allowed difference (in hours) between any 2 different extents' creation times, so that they can still be merged.
    - Timestamps are those of extent creation, and do not relate to the actual data contained in the extents.
    - Applies to both Merge and Rebuild operations.
    - A best practice is for this value to be correlated with the database's / table's
    [Retention policy](./retentionpolicy.md)'s 
    *SoftDeletePeriod*, or the [Cache policy](./cachepolicy.md)'s
    *DataHotSpan* (the lower of the two), so that it is between 2-3% of the latter.

**`MaxRangeInHours` examples:**
|min(SoftDeletePeriod (Retention Policy), DataHotSpan (Cache Policy))|Max Range In Hours (Merge Policy)
|---|---
|7 days (168 hours)| 4
|14 days (336 hours)| 8
|30 days (720 hours)| 18
|60 days (1,440 hours)| 36
|90 days (2,160 hours)| 60
|180 days (4,320 hours)| 120
|365 days (8,760 hours)| 250

> [!WARNING]
> It is rarely recommended to alter an Extents Merge Policy without consulting with the Kusto team first.

When a database is created, it is set with the default Merge policy (a policy with the default values mentioned above), which is, by default, inherited by
all tables created in the database (unless their policies are explicitly overridden at table-level).

Control commands which allow to manage Merge policies for databases / tables can be found [here](../management/merge-policy.md).