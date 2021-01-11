---
title: Achieve high query concurrency with Azure Data Explorer
description: In this article, you learn to optimize your Azure Data Explorer setup for high query concurrency.
author: orspod
ms.author: orspodek
ms.reviewer: miwalia
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/11/2021
---

# Achieve high query concurrency with Azure Data Explorer

Highly concurrent applications are typically required for scenarios dealing with a large user base, in which applications handle many requests simultaneously with low latency and high throughput. Some use cases include large-scale monitoring and alerting dashboards. These applications require careful design of the backend architecture of compute resources and database schema, using advanced data partitioning, pre-aggregation and caching features, and optimizing platform configuration.

Azure Data Explorer is a big data analytics platform that enables building applications with high query concurrency requirements over huge streams of telemetry and logs data. Azure Data Explorer provides advanced capabilities and performance to achieve high concurrency. Several other Microsoft products and services use Azure Data Explorer for serving high concurrency workloads, such as [Azure Monitor](https://azure.microsoft.com/en-au/services/monitor/), [Azure Time Series Insights](https://azure.microsoft.com/en-us/services/time-series-insights/), and [Playfab](https://playfab.com/).

This article discusses considerations and features that can be used to achieve high concurrency in an optimal, cost-effective way. These features can be used alone, or in combination.

> [!NOTE]
> The actual number of queries that can run concurrently on a cluster depends on factors such as cluster resources, data volumes, query complexity, and use patterns.

## Optimize data

For high concurrency, queries should consume the least possible amount of CPU resources. Use table schema design, data partitioning, pre-aggregation, or caching.

### Use table schema design best practices

* Ensure that the column data type optimally matches the actual data stored in these columns. For example, don't store datetime values in a string column.
* Avoid large sparse table with many columns and use of dynamic columns to store sparse properties.
* Ensure that frequently used properties are stored in their own column with a non-dynamic datatype.
* Denormalize data to avoid joins that demand relatively large CPU resources.

### Partition data

Data is stored in the form of extents (data shards) and is partitioned by ingestion time by default. The [partitioning policy](https://docs.microsoft.com/bs-latn-ba/azure/data-explorer/kusto/management/partitioningpolicy) allows you to repartition the extents based on a single string column and/or a single datetime column in a background process. Partitioning can provide significant performance improvements when most of the queries use partition keys to filter and or aggregate.

> [!NOTE]
> The partitioning process itself uses CPU resources. However, the CPU reduction during query time should outweigh the CPU used for partitioning.

### Pre-aggregate your data with materialized views

Pre-aggregation can significantly reduce CPU resources during query time. Example scenarios include summarization of data points over reduced number of time bins, keeping the latest record of a given record, or deduplicating the dataset. The [materialized view](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/materialized-views/materialized-view-overview) feature provides an easy-to-configure aggregated view over source table. This feature simplifies the effort of creating and maintaining these aggregated views.

> [!NOTE]
> The background materialization process uses CPU resources. However, the CPU reduction during query time should outweigh the CPU consumption for materialization.

### Configure caching policy

The caching policy should be configured so that most of the queries run on data that is stored in the disk cache (hot storage). Only limited, carefully designed scenarios should run on the cold storage or external tables.

## Leader-Follower architecture pattern

The follower database is a cluster that follows a database or a set of tables in a database from another cluster, which is located in the same region. This feature is exposed through [Azure Data Share](https://docs.microsoft.com/en-us/azure/data-explorer/data-share), [Azure Resource Manager APIs](https://docs.microsoft.com/en-us/azure/data-explorer/follower), and a set of [cluster commands](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/cluster-follower). The leader-follower pattern allows you to dedicate compute resources for different workloads, for example, a cluster for ingestions, a cluster for querying or serving dashboards/applications, and a cluster that serves the data science workloads. Each workload in this case will have dedicated compute resources that can be scaled independently, and different caching and security configuration. All clusters use the same data, with the leader writing the data, and the followers using it in a read-only mode.

> [!NOTE]
> The follower databases have a lag from the leader, usually a couple of minutes. If the dashboarding solution requires the latest data with no latency, the following solution may be useful: Use a view on the follower cluster that unions the data from the leader and the follower, querying the latest data from the leader and the rest of the data from the follower.

To improve the performance of queries on the follower cluster, you can enable [prefetch extents configuration](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/cluster-follower#alter-follower-database-prefetch-extents). Use this configuration carefully, as it could impact the freshness of data in the follower database.

## Optimize queries

### Query results cache

When more than one user is loading the same dashboard at similar time, the dashboard to the second and following users can be served from the cache. This setup provides high performance with almost no CPU usage. Use the [query results cache](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/query-results-cache) feature and send query results cache configuration with the query using the `set` statement.

[Grafana](https://docs.microsoft.com/en-us/azure/data-explorer/grafana) contains a configuration setting for the query results cache at the data source level, so all dashboards use this setting by default and don't need to modify the query.

### Query consistency

Azure Data Explorer supports two query consistency models: *strong* (the default) and *weak*. Strong consistency ensures that only up-to-date consistent state of data is seen, no matter which compute node receives the query. Weak consistency nodes periodically refresh their copy of the metadata, leading to a latency of 1-2 minutes in the synchronization of metadata changes. This model allows reducing the load on the node that manages the metadata changes, providing higher concurrency than the default strong consistency. This configuration can be set in client request properties and in the Grafana data source configurations.

> [!NOTE]
> If you need to reduce the lag time for the refresh of metadata even further, open a support ticket.

### Query optimization

To ensure that queries are as efficient as possible, follow [query best practices](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/best-practices).

## Set cluster policies

The number of concurrent queries is capped by default and controlled by the [query throttling policy](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/query-throttling-policy) to ensure that the cluster doesn't get overloaded. This policy should be adjusted only after rigorous testing, preferably on production-like query patterns and datasets to ensure the cluster can sustain the modified value. This limit can be configured based on the application needs.

## Monitor Azure Data Explorer clusters

Monitoring the health of your cluster resources helps you build an optimization plan using the features suggested in the above sections. Azure Monitor for Azure Data Explorer provides a comprehensive view of your cluster's performance, operations, usage, and failures. Get insights on the queries performance, concurrent queries, throttled queries and various other metrics by clicking on the **Insights (preview)** tab under the monitoring section of Azure Data Explorer cluster on Azure portal. Details on monitoring of clusters are given in the [Azure Monitor for Azure Data Explorer](https://docs.microsoft.com/azure/azure-monitor/insights/data-explorer?toc=/azure/data-explorer/toc.json&amp;bc=/azure/data-explorer/breadcrumb/toc.json) documentation. For detailed information on the individual metrics, see [Azure Data Explorer metrics](https://docs.microsoft.com/en-us/azure/data-explorer/using-metrics#supported-azure-data-explorer-metrics).
