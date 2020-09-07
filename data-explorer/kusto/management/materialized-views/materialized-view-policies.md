---
title: Materialized views policies - Azure Data Explorer
description: This article describes materialized views policies in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---
# Materialized views policies

A materialized view can define policies (caching, retention, merge) similarly to a table in Azure 
Data Explorer.

* By default, the materialized view derives the database effective policy (with an exception in merge policy, explained below).
* Policies can be altered post creation using control commands below.
* The policies apply to the *materialized* part of the view (see [Materialized views: behind the scenes](materialized-view-behind-the-scenes.md) for details).

The cluster's [Capacity policy](../capacitypolicy.md) includes settings for the concurrency in which materialized views are executed. This is explained in [this section](#materialized-view-capacity-policy). 

## Materialized view policies control commands

The following policies can be set on materialized-views:

1. [Retention policy](../retentionpolicy.md).
2. [Cache policy (hot and cold cache)](../cachepolicy.md).
3. [Merge policy](../mergepolicy.md). 

The syntax for `alter | alter-merge | show | delete` is identical to the corresponding table commands, with `materialized-view` instead of `table` (see, for example, [Alter retention policy](../retention-policy.md#alter-retention-policy)). 

> [!WARNING]
> Consult with the Azure Data Explorer team before altering the materialized view's merge policy.

**Examples**:

Search the documentation for the corresponding table commands for more examples.

<!-- csl -->
```
.alter-merge materialized-view ViewName policy retention softdelete = 100d recoverability = enabled
.delete materialized-view ViewName policy retention  

.show materialized-view ViewName policy caching
.alter materialized-view ViewName policy caching hot = 30d
```

### Retention policy

* **Retention policy of source table:** If the source table records are not required for anything other than the materialized view, the retention policy of the source table can be dropped to a minimum, and the materialized view will still store the data, according to the retention policy set on the view. As long as the materialized views are in preview mode, the recommendation is to allow a minimum of at least seven days and recoverability set to true, to allow fast recovery in case of errors and for diagnostic purposes. **Zero retention policy on the source table is currently not supported.**

* **Retention policy of materialized view:** The retention policy on the materialized view is relative to the last update of a record - for instance, if the view aggregation is      `T | summarize count() by Day=bin(Timestamp, 1d)`, and soft delete is 30 day, records for `Day=d` will be dropped 30 days after the last update for the record (exact deletion time is imprecise, as for regular tables - see notes [in this article](../retentionpolicy.md)).

### Merge policy

A materialized view's merge policy will be automatically set by the system, to optimize the view's performance. Specifically, the value of `MaxRangeInHours` in the merge policy may be increased to avoid small [Extents (data shards)](../extents-overview.md) in the materialized view. The value will be increased only if the effective retention policy of the materialized view has `Recoverability` set to `true`, as this indicates that the materialized view's retention policy is not strict (records may be deleted later than configured, if this can improve the performance of the materialized view). Manually setting the `MaxRangeInHours` in the merge policy, or disabling `Recoverability` in the retention policy, will disable the automatic intervention in the policy (but may badly impact the view's performance). Please consult with the Azure Data Explorer team if you have reservations concerning this. 

## Materialized view capacity policy

Materialized Views capacity policy is part of the cluster's [Capacity policy](../capacitypolicy.md), and has the following JSON representation:

<!-- csl -->
``` 
{
   "MaterializedViewsCapacity": {
    "ClusterMaximumConcurrentOperations": 1,
    "ExtentsRebuildCapacity": {
      "ClusterMaximumConcurrentOperations": 50,
      "MaximumConcurrentOperationsPerNode": 5
    }
  }
}
```

The policy can be used to change concurrency settings for materialized views. This may be required when there is more than a single materialized view defined on a cluster, and cluster cannot keep up with the materialization of all views. By default, concurrency settings are relatively low to ensure materialization does not impact cluster's performance.

* `ClusterMaximumConcurrentOperations` - the maximum number of materialized views that the cluster is able to materialize concurrently. This is 1 by default, while materialization itself (of a single individual view) may run many concurrent operations. If there is more than a single materialized view defined on the cluster, and if the cluster's resources are in good state (low CPU, available memory), it is recommended to increase this value.

* `ExtentsRebuildCapacity` - this property determines the number of concurrent extents rebuild operations, executed *for all materialized views* during the materialization process 
(if several views are executing concurrently, since `ClusterMaximumConcurrentOperation` is greater than 1, they will all share the quota defined by this property, and the maximum
number of concurrent extents rebuild operations will not exceed this value).
Please see the [Materialized views: behind the scenes](materialized-view-behind-the-scenes.md) article about extents rebuild operations.

  * The maximum number of extents rebuild is calculated by:
    
        Maximum(`ClusterMaximumConcurrentOperations`, `Number of nodes in cluster` * `MaximumConcurrentOperationsPerNode`)
    
  * Default values are as in the JSON above - 50 total concurrency rebuilds and maximum 5 per node.
  * The `ExtentsRebuildCapacity` policy serves as an *upper limit only*. The actual value used is dynamically determined by the system, based on current cluster's conditions (memory, CPU) and an estimation of the amount of resources required by the rebuild operation. So, in practice, concurrency can be much lower than the value specified in capacity policy.
    * The `MaterializedViewExtentsRebuild` and `MaterializedViewExtentsRebuildConcurrency` metrics (see [Materialized views monitoring](materialized-view-monitoring.md) provide information about how many extents were rebuilt in each materialization cycle, and the concurrency used.

* Changing the capacity policy is done using the [alter cluster policy capacity](../capacity-policy.md#alter-cluster-policy-capacity) (requires `AllDatabasesAdmin` permissions).

> [!WARNING]
> Materialized View capacity policy should only be increased if the cluster's resources are well 
> (low CPU, available memory). Increasing these values, when resources are limited may result in
> resources exhaustion and will badly impact the cluster's performance. If you are uncertain about
> changing these values, please consult with the Azure Data Explorer team.