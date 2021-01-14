---
title: High query concurrency with Azure Data Explorer
description: In this article, you learn to optimize your Azure Data Explorer setup for high query concurrency.
author: orspod
ms.author: orspodek
ms.reviewer: miwalia
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/11/2021
---

# High query concurrency with Azure Data Explorer

Highly concurrent applications are needed for scenarios that have a large user base, and the application handles many requests simultaneously with low latency and high throughput. 

Use cases include large-scale monitoring and alerting dashboards, for example other Microsoft products and services such as [Azure Monitor](https://azure.microsoft.com/en-au/services/monitor/), [Azure Time Series Insights](https://azure.microsoft.com/services/time-series-insights/), and [Playfab](https://playfab.com/). These services all use Azure Data Explorer for serving high concurrency workloads.

Azure Data Explorer is a big data analytics platform that enables building applications with high query concurrency requirements over huge streams of telemetry and logs data. These applications require careful design of the backend architecture of compute resources and database schema, using advanced data partitioning, pre-aggregation and caching features, and optimizing platform configuration. This article discusses how to implement these considerations and features to achieve high concurrency in an optimal, cost-effective way. These features can be used alone, or in combination.

> [!NOTE]
> The actual number of queries that can run concurrently on a cluster depends on factors such as cluster resources, data volumes, query complexity, and use patterns.

## Optimize data

For high concurrency, queries should consume the least possible amount of CPU resources. Use table schema design, data partitioning, pre-aggregation, or caching.

### Use table schema design best practices

Use the following table schema design best practices to minimize the CPU resources used:

* Match the column data type optimally to the actual data stored in these columns. For example, don't store datetime values in a string column.
* Avoid large sparse table with many columns and use of dynamic columns to store sparse properties.
* Store frequently used properties in their own column with a non-dynamic datatype.
* Denormalize data to avoid joins that demand relatively large CPU resources.

### Partition data

Data is stored in the form of extents (data shards) and is partitioned by ingestion time by default. The [partitioning policy](/kusto/management/partitioningpolicy.md) allows you to repartition the extents based on a single string column and/or a single datetime column in a background process. Partitioning can provide significant performance improvements when most of the queries use partition keys to filter and or aggregate.

> [!NOTE]
> The partitioning process itself uses CPU resources. However, the CPU reduction during query time should outweigh the CPU used for partitioning.

### Pre-aggregate your data with materialized views

Pre-aggregation can significantly reduce CPU resources during query time. Example scenarios include summarization of data points over reduced number of time bins, keeping the latest record of a given record, or deduplicating the dataset. Use the [materialized view](/kusto/management/materialized-views/materialized-view-overview.md) feature for an easy-to-configure aggregated view over source table. This feature simplifies the effort of creating and maintaining these aggregated views.

> [!NOTE]
> The background materialization process uses CPU resources. However, the CPU reduction during query time should outweigh the CPU consumption for materialization.

### Configure caching policy

Configure the caching policy so that most of the queries run on data that is stored in the disk cache, also known as hot storage. Only run limited, carefully designed scenarios on the cold storage or external tables.

## Leader-Follower architecture pattern

The follower database is a cluster that follows a database or a set of tables in a database from another cluster, which is located in the same region. This feature is exposed through [Azure Data Share](/azure/data-explorer/data-share), [Azure Resource Manager APIs](follower.md), and a set of [cluster commands](/kusto/management/cluster-follower.md). 

Use the leader-follower pattern to dedicate compute resources for different workloads. For example, set up a cluster for ingestions, a cluster for querying or serving dashboards/applications, and a cluster that serves the data science workloads. Each workload in this case will have dedicated compute resources that can be scaled independently, and different caching and security configuration. All clusters use the same data, with the leader writing the data, and the followers using it in a read-only mode.

> [!NOTE]
> Follower databases have a lag from the leader, usually a couple of minutes. If the dashboarding solution requires the latest data with no latency, the following solution may be useful: Use a view on the follower cluster that unions the data from the leader and the follower, querying the latest data from the leader and the rest of the data from the follower.

To improve the performance of queries on the follower cluster, you can enable [prefetch extents configuration](/kusto/management/cluster-follower.md#alter-follower-database-prefetch-extents). However, use this configuration carefully, as it could impact the freshness of data in the follower database.

## Optimize queries

The following methods will help you optimize your queries for high concurrency.

### Query results cache

When more than one user loads the same dashboard at similar time, the dashboard to the second and following users can be served from the cache. This setup provides high performance with almost no CPU usage. Use the [query results cache](/kusto/query/query-results-cache.md) feature and send query results cache configuration with the query using the `set` statement.

[Grafana](/azure/data-explorer/grafana) contains a configuration setting for the query results cache at the data source level, so all dashboards use this setting by default and don't need to modify the query.

### Query consistency

Azure Data Explorer supports two query consistency models: *strong* (the default) and *weak*. Strong consistency ensures that only up-to-date consistent state of data is seen, no matter which compute node receives the query. Weak consistency nodes periodically refresh their copy of the metadata, leading to a latency of 1-2 minutes in the synchronization of metadata changes. This model allows reducing the load on the node that manages the metadata changes, providing higher concurrency than the default strong consistency. This configuration can be set in client request properties and in the Grafana data source configurations.

> [!NOTE]
> If you need to reduce the lag time for the refresh of metadata even further, open a support ticket.

### Query optimization

Follow [query best practices](/kusto/query/best-practices.md) so that your queries are as efficient as possible.

## Set cluster policies

The number of concurrent queries is capped by default and controlled by the [query throttling policy](/kusto/management/query-throttling-policy.md) so that the cluster doesn't get overloaded. This policy should be adjusted only after rigorous testing, preferably on production-like query patterns and datasets to ensure the cluster can sustain the modified value. This limit can be configured based on application needs.

## Monitor Azure Data Explorer clusters

Monitoring the health of your cluster resources helps you build an optimization plan using the features suggested in the above sections. Azure Monitor for Azure Data Explorer provides a comprehensive view of your cluster's performance, operations, usage, and failures. Get insights on the queries performance, concurrent queries, throttled queries and various other metrics by clicking on the **Insights (preview)** tab under the monitoring section of Azure Data Explorer cluster on Azure portal. Details on monitoring of clusters are given in the [Azure Monitor for Azure Data Explorer](/azure/azure-monitor/insights/data-explorer?toc=/azure/data-explorer/toc.json&amp;bc=/azure/data-explorer/breadcrumb/toc.json) documentation. For detailed information on the individual metrics, see [Azure Data Explorer metrics](using-metrics.md#supported-azure-data-explorer-metrics).
