---
title:  Monitor materialized views
description: This article describes how to monitor materialized views in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/19/2023
---
# Monitor materialized views

Monitor the materialized view's health in the following ways:

* Monitor [materialized view metrics](../../../using-metrics.md#materialized-view-metrics) in the Azure portal.
  * The materialized view age metric `MaterializedViewAgeSeconds` should be used to monitor the freshness of the view. This one should be the primary metric to monitor.
* Monitor the `IsHealthy` property returned from [`.show materialized-view`](materialized-view-show-command.md#show-materialized-views).
* Check for failures using [`.show materialized-view failures`](materialized-view-show-failures-command.md#show-materialized-view-failures).

> [!NOTE]
>
> Materialization never skips any data, even if there are constant failures. The view is always guaranteed to return the most up-to-date snapshot of the query, based on all records in the source table. Constant failures will significantly degrade query performance, but won't cause incorrect results in view queries.

## Troubleshooting unhealthy materialized views

The `MaterializedViewHealth` metric indicates whether a materialized view is healthy. Before a materialized view becomes unhealthy, its age, noted by the `MaterializedViewAgeSeconds` metric, gradually increases.

A materialized view can become unhealthy for any or all of the following reasons:

* The materialization process is failing. The [MaterializedViewResult metric](#materializedviewresult-metric) and the [`.show materialized-view failures`](materialized-view-show-failures-command.md#show-materialized-view-failures) command can help identify the root cause of the failure.
* The system may have automatically disabled the materialized view, due to changes to the source table. You can check if the view is disabled by checking the `IsEnabled` column returned from [`.show materialized-view` command](materialized-view-show-command.md#show-materialized-views). See more details in [materialized views limitations and known issues](materialized-views-limitations.md#the-materialized-view-source)
* The cluster doesn't have sufficient capacity to materialize all incoming data on-time. In this case, there may not be failures in execution. However, the view's age gradually increases, since it isn't able to keep up with the ingestion rate. There could be several root causes for this situation:
  * There are more materialized views in the cluster, and the cluster doesn't have sufficient capacity to run all views. See [materialized view capacity policy](../capacitypolicy.md#materialized-views-capacity-policy) to change the default settings for number of materialized views executed concurrently.  
  * Materialization is slow because there are too many extents to rebuild in each materialization cycle. To learn more about why extents rebuild impacts the view's performance, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work). The number of extents rebuilt in each cycle is provided in the `MaterializedViewExtentsRebuild` metric.

## MaterializedViewResult metric

The `MaterializedViewResult` metric provides information about the result of a materialization cycle, and can be used to identify issues in the materialized view health status. The metric includes the `Database` and `MaterializedViewName` and a `Result` dimension.

The `Result` dimension can have one of the following values:
  
* **Success**: Materialization completed successfully.
* **SourceTableNotFound**: Source table of the materialization view was dropped. The materialized view is automatically disabled as a result.
* **SourceTableSchemaChange**: The schema of the source table has changed in a way that isn't compatible with the materialized view definition (materialized view query doesn't match the materialized view schema). The materialized view is automatically disabled as a result.
* **InsufficientCapacity**: The cluster doesn't have sufficient capacity to materialize the materialized view. This can either indicate missing [ingestion capacity](../capacitypolicy.md#ingestion-capacity) or missing [materialized views capacity](../capacitypolicy.md#materialized-views-capacity-policy). Insufficient capacity failures can be transient, but if they reoccur often we recommend scaling out the cluster or increasing relevant capacity in the policy.
* **InsufficientResources:** The cluster doesn't have sufficient resources (CPU/memory) to materialize the materialized view. This failure may be transient, but if it reoccurs try scaling the cluster up or out.

  * If the materialization process hits memory limits, the [$materialized-views workload group](../workload-groups.md#materialized-views-workload-group) limits can be increased to support more memory or CPU for the materialization process to consume.
  
   For example, the following command will alter the materialized views workload group to use a max of 64 gigabytes (GB) of memory per node during materialization (the default value is 15 GB):

    ~~~kusto
    .alter-merge workload_group ['$materialized-views'] ```
    {
      "RequestLimitsPolicy": {
        "MaxMemoryPerQueryPerNode": {
          "Value": 68719241216
        }
      }
    } ```
    ~~~

    > [!NOTE]
    > MaxMemoryPerQueryPerNode can't be set to more than 50% of the total memory of each node.

## Materialized views in follower databases

Materialized views can be defined in [follower databases](materialized-views-limitations.md#follower-databases). However, the monitoring of these materialized views should be based on the leader database, where the materialized view is defined. Specifically:

* [Metrics](../../../using-metrics.md#materialized-view-metrics) related to materialized view execution (`MaterializedViewResult`, `MaterializedViewExtentsRebuild`) are only present in the leader database. Metrics related to monitoring (`MaterializedViewAgeSeconds`, `MaterializedViewHealth`, `MaterializedViewRecordsInDelta`) will also appear in the follower databases.
* The [.show materialized-view failures command](materialized-view-show-failures-command.md) only works in the leader database.

## Track resource consumption

**Materialized views resource consumption:** the resources consumed by the materialized views materialization process can be tracked using the [`.show commands-and-queries`](../commands-and-queries.md#show-commands-and-queries) command. Filter the records for a specific view using the following (replace `DatabaseName` and `ViewName`):

<!-- csl -->
```kusto
.show commands-and-queries 
| where Database  == "DatabaseName" and ClientActivityId startswith "DN.MaterializedViews;ViewName;"
```
