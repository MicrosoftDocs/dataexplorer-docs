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

A [materialized view](materialized-view-overview.md) defines policies similarly to table policies in Azure Data Explorer. By default, the materialized view derives the database effective policy, except for [merge policy](#merge-policy). The policies apply to the *materialized* part of the view. For an explanation of the different parts of a materialized view, see [behind the scenes](materialized-view-overview.md#how-materialized-views-work). Policies can be altered post-creation using [materialized view policies control commands](#control-commands).  The cluster's [capacity policy](../capacitypolicy.md) includes settings for the [concurrency in which materialized views](#capacity-policy) are executed.

## Control commands

The following policies can be set on materialized views:

* [Retention policy](../retentionpolicy.md)
* [Cache policy (hot and cold cache)](../cachepolicy.md)
* [Merge policy](../mergepolicy.md)

### Syntax

The syntax for `alter | alter-merge | show | delete` is identical to the corresponding table commands, using `materialized-view` instead of `table`. 

For example, see [alter retention policy](../retention-policy.md#alter-retention-policy). 

> [!WARNING]
> Consult with the Azure Data Explorer team before altering the materialized view's merge policy.

### Examples

<!-- csl -->
```
.alter-merge materialized-view ViewName policy retention softdelete = 100d recoverability = enabled
.delete materialized-view ViewName policy retention  

.show materialized-view ViewName policy caching
.alter materialized-view ViewName policy caching hot = 30d
```

## Retention policy

* **Retention policy of source table:** If the source table records aren't required for anything other than the materialized view, the retention policy of the source table can be dropped to a minimum. The materialized view will still store the data according to the retention policy set on the view. While materialized views are in preview mode, the recommendation is to allow a minimum of at least seven days and recoverability set to true. This setting allows for fast recovery for errors and for diagnostic purposes.

    > [!NOTE]
    > Zero retention policy on the source table is currently not supported.

* **Retention policy of materialized view:** The retention policy on the materialized view is related to the last update of a record. For example, if the view aggregation is: <br>
      `T | summarize count() by Day=bin(Timestamp, 1d)` <br>
 and soft delete is 30 days, records for `Day=d` are dropped 30 days after the last update for the record. 
    
  > [!NOTE]
  > The exact deletion time is imprecise, as with regular tables. For more information, see [retention policy](../retentionpolicy.md).

## Merge policy

The merge policy is automatically set by the system to optimize the view's performance. The value of `MaxRangeInHours` in the merge policy may be increased to avoid small [Extents (data shards)](../extents-overview.md) in the materialized view. This value is increased only if the effective retention policy of the materialized view has `Recoverability` set to `true`, indicating that the materialized view's retention policy isn't strict. Records may be deleted later than configured to improve the performance of the materialized view. Manually setting the `MaxRangeInHours` in the merge policy, or disabling `Recoverability` in the retention policy disables the automatic intervention in the policy, and may badly impact the view's performance.

## Capacity policy

Change the capacity policy using the [alter cluster policy capacity](../capacity-policy.md#alter-cluster-policy-capacity). This change requires `AllDatabasesAdmin` permissions.
The policy can be used to change concurrency settings for materialized views. This change may be required when there's more than a single materialized view defined on a cluster, and the cluster can't keep up with the materialization of all views. By default, concurrency settings are relatively low to ensure that materialization doesn't impact cluster's performance.

> [!WARNING]
> The materialized view capacity policy should only be increased if the cluster's resources are well (low CPU, available memory). Increasing these values when resources are limited may result in resources exhaustion and will badly impact the cluster's performance. 

The materialized views capacity policy is part of the cluster's [capacity policy](../capacitypolicy.md), and has the following JSON representation:

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

### Properties

Property | Description
|---|---|
|`ClusterMaximumConcurrentOperations` | The maximum number of materialized views that the cluster can materialize concurrently. This value is 1 by default, while materialization itself (of a single individual view) may run many concurrent operations. If there's more than a single materialized view defined on the cluster, and if the cluster's resources are in good state, it's recommended to increase this value. |
| `ExtentsRebuildCapacity`|  Determines the number of concurrent extents rebuild operations, executed *for all materialized views* during the materialization process. If several views are executing concurrently, since `ClusterMaximumConcurrentOperation` is greater than 1, they'll share the quota defined by this property, and the maximum number of concurrent extents rebuild operations won't exceed this value.|

### Extents rebuild

To learn more about extents rebuild operations, see [behind the scenes](materialized-view-overview.md#how-materialized-views-work). The maximum number of extents rebuild is calculated by:
    
```kusto
Maximum(`ClusterMaximumConcurrentOperations`, `Number of nodes in cluster` * `MaximumConcurrentOperationsPerNode`)
```
    
* Default values are 50 total concurrency rebuilds and maximum 5 per node.
* The `ExtentsRebuildCapacity` policy serves as an *upper limit only*. The actual value used is dynamically determined by the system, based on current cluster's conditions (memory, CPU) and an estimation of the amount of resources required by the rebuild operation. In practice, concurrency can be much lower than the value specified in capacity policy.
    * The `MaterializedViewExtentsRebuild` and `MaterializedViewExtentsRebuildConcurrency` metrics (see [Materialized views monitoring](materialized-view-monitoring.md) provide information about how many extents were rebuilt in each materialization cycle, and the concurrency used.
