---
title: Optimize materialized views
description: Learn how to optimize materialized view materialization and query performance.
ms.reviewer: denises
ms.topic: how-to
ms.date: 08/11/2026
---

# Optimize materialized views

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

A materialized view consists of a materialized part and newly ingested source records that aren't yet materialized, called the *delta*. Materialization performance depends largely on the overlap between the delta and the materialized part. Query performance also depends on combining these parts when you query the entire view. For more information, see [How materialized views work](materialized-view-overview.md#how-materialized-views-work).

Use the following optimizations after you [monitor the materialized view](materialized-views-monitoring.md) and identify the cause of the performance issue.

## Increase the materialization memory limit

By default, the `$materialized-views` workload group limits the memory peak of each materialization operation to 15 GB per node. If materialization fails because it reaches this limit, increase `MaxMemoryPerQueryPerNode` in the workload group:

```kusto
.alter-merge workload_group ['$materialized-views'] ```
{
  "RequestLimitsPolicy": {
    "MaxMemoryPerQueryPerNode": {
      "Value": 34359738368
    }
  }
}
```

The preceding example increases the limit to 32 GB per node. `MaxMemoryPerQueryPerNode` can't exceed 50% of the memory available on each node. Monitor other workloads after increasing the limit. For more information, see [Materialized views workload group](../workload-groups.md#materialized-views-workload-group).

## Adjust caching policies

Materialization can slow down when it scans data that isn't in the hot cache. Set a caching policy that covers the period the materialization process is expected to scan. For commands, see [Caching policy management commands](../show-table-cache-policy-command.md).

The materialized view's caching policy applies only to its materialized part. The source table supplies the delta and also participates in queries, so configure the source table's caching policy for the required period as well. For more information, see [Retention and caching policy](materialized-view-policies.md#retention-and-caching-policy).

## Use a datetime group-by key

Materialized views that include a `datetime` column as a group-by key can reduce the amount of materialized data scanned during each cycle. Add a datetime group-by key only when it doesn't change the aggregation semantics and the value is immutable for each unique entity.

For example, if each `EventId` always has the same `Timestamp` value, change:

```kusto
SourceTable | summarize take_any(*) by EventId
```

to:

```kusto
SourceTable | summarize take_any(*) by EventId, Timestamp
```

> [!TIP]
> Late-arriving data in a datetime group-by key can negatively affect materialization performance. If late-arriving records are expected, configure the caching policies to cover the oldest expected values. If they aren't expected, filter out those records or normalize their timestamp values in the materialized view query.

### Add an immutable creation-time group-by key

When most updates apply to recently created entities, add an immutable creation-time column to the group-by keys. The materialization process uses the first datetime group-by key, calculates its minimum value over the delta, and uses that value as the lower boundary of the join with the materialized part.

This optimization isn't the `lookback` property. A group-by key changes the aggregation granularity, while an incorrectly configured `lookback` can produce duplicate records.

Only the first datetime group-by key is used for this optimization, so the order of datetime group-by keys determines which one applies. If the selected column contains a null value in the delta, the optimization is silently skipped for the entire materialization cycle. Don't use this optimization when the creation time isn't included in every update or when adding it changes the aggregation semantics.

For example, consider ticket bookings that can be changed for up to two years, although most changes occur within two months of booking. If every update includes an immutable `Booking_CreationTimestamp`, change:

```kusto
summarize arg_max(Timestamp, *) by BookingId
```

to:

```kusto
summarize arg_max(Timestamp, *) by BookingId, Booking_CreationTimestamp
```

The materialization process can then use the earliest `Booking_CreationTimestamp` value in the delta as the lower boundary for the join instead of scanning the entire two-year period.

## Define a lookback period

The `lookback` property limits how much of the materialized part each materialization cycle scans. It improves materialization performance, not query performance.

Set the lookback long enough to include all expected duplicates or updates. A lookback that's too short can produce duplicate records. For configuration details and limitations, see [Lookback period](materialized-view-create.md#lookback-period).

## Add frequently filtered columns as group-by keys

Queries are optimized when they filter by a materialized view group-by key. If queries frequently filter by a column that's immutable for each unique entity, include that column in the group-by keys.

For example, if a `ResourceId` always belongs to the same `SubscriptionId`, define the materialized view as:

```kusto
.create materialized-view ArgMaxResourceId on table FactResources
{
    FactResources
    | summarize arg_max(Timestamp, *) by SubscriptionId, ResourceId
}
```

This definition is preferable to grouping only by `ResourceId` when queries commonly filter by `SubscriptionId`.

## Move nonaggregation work out of the view

If the query only needs a lookup against a dimension table, use the `dimensionTables` property. For more information, see [Query parameter](materialized-view-create.md#query-parameter).

For other transformations and normalizations, use an [update policy](../update-policy.md) to prepare the data in a target table and leave only the aggregation in the materialized view. For example, define an update policy:

```kusto
.alter-merge table Target policy update
@'[{"IsEnabled":true,"Source":"SourceTable","Query":"SourceTable | extend NormalizedResourceId = toupper(ResourceId)","IsTransactional":false,"PropagateIngestionProperties":false}]'
```

Then define the materialized view over the prepared table:

```kusto
.create materialized-view Usage on table Target
{
    Target
    | summarize count() by NormalizedResourceId
}
```

Including the transformation directly in the materialized view query requires it to run during each materialization cycle and might perform worse.

## Apply a partitioning policy

Consider a [partitioning policy](materialized-view-policies.md#partitioning-policy) when most queries filter by one of the materialized view's group-by keys. This optimization is common for multitenant data where a group-by key identifies the tenant.

Partitioning keeps a single materialized view and can avoid splitting the data across multiple views. However, it increases the number of extents and creates more work for the materialization process.

## Increase available resources

::: moniker range="azure-data-explorer"
If the cluster doesn't have enough resources to keep materialized views healthy, increase the minimum instance count. [Optimized autoscale](/azure/data-explorer/manage-cluster-horizontal-scaling#optimized-autoscale-recommended-option) doesn't consider materialized view health when making scaling decisions.
::: moniker-end

::: moniker range="microsoft-fabric"
If the Eventhouse doesn't have enough resources to keep materialized views healthy, enable minimum consumption to provide more resources. For more information, see [Enable minimum consumption](/fabric/real-time-intelligence/manage-monitor-eventhouse#enable-minimum-consumption).
::: moniker-end

When multiple materialized views need to run concurrently, ensure that the materialized views capacity policy allows sufficient concurrency. Increase `ClusterMinimumConcurrentOperations` only after evaluating the effect on other workloads. For more information, see [Materialized views capacity policy](../capacity-policy.md#materialized-views-capacity-policy).

## Split into multiple materialized views

Splitting can help when a single materialized view's materialization cycle needs too much memory and the preceding optimizations aren't sufficient. The split must reduce the number of groups and the amount of state each materialized view handles. Don't divide the KQL into processing stages.

While splitting might increase CPU usage, it reduces the memory peak in materialization cycles. Ensure that `ClusterMinimumConcurrentOperations` allows the split views to run concurrently. Otherwise, the views can run serially and lose the benefit of the split.

### Horizontally shard by a stable key

Suppose the original materialized view is:

```kusto
.create materialized-view UsageMV on table Events
{
    Events
    | summarize EventCount = count(), TotalBytes = sum(Bytes)
        by TenantId, Day = bin(Timestamp, 1d)
}
```

Split tenants deterministically across four materialized views:

```kusto
.create materialized-view UsageMV_0 on table Events
{
    Events
    | where hash(TenantId, 4) == 0
    | summarize EventCount = count(), TotalBytes = sum(Bytes)
        by TenantId, Day = bin(Timestamp, 1d)
}
```

Create equivalent materialized views for buckets 1, 2, and 3, and expose them through a function:

```kusto
.create-or-alter function Usage()
{
    union UsageMV_0, UsageMV_1, UsageMV_2, UsageMV_3
}
```

Because each group belongs to exactly one materialized view, no final reaggregation is required.

### Split by a natural business partition

This method is usually clearer than hashing:

```kusto
.create materialized-view Usage_EU on table Events
{
    Events
    | where Region == "EU"
    | summarize count(), sum(Bytes)
        by Region, TenantId, Day = bin(Timestamp, 1d)
}
```

Create corresponding views for the other regions. This method works best when:

* The partition expression is deterministic.
* The partition key is part of the group-by keys.
* Distribution is reasonably balanced.
* Queries commonly filter by the partition key.

Avoid random splitting or splitting on a value that can change for the same logical group.

## Optimize queries

If you can tolerate some data latency, use the [`materialized_view()` function](../../query/materialized-view-function.md) to query only the materialized part. This approach avoids combining the materialized part with the delta at query time.

When querying the entire view, filter by group-by keys when possible. You can also test the `materialized_view_shuffle` client request property to control the shuffle strategy for the summarize and join operations. Specify keys to get behavior similar to `hint.shufflekey`, or omit the keys to get behavior similar to `hint.strategy=shuffle`. For details and examples, see [Materialized view query optimizer](materialized-view-overview.md#materialized-view-query-optimizer).

## Related content

* [Materialized views](materialized-view-overview.md)
* [Materialized views use cases](materialized-view-use-cases.md)
* [Monitor materialized views](materialized-views-monitoring.md)
* [Materialized views policies](materialized-view-policies.md)
