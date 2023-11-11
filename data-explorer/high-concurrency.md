---
title: Optimize for high concurrency with Azure Data Explorer
description: In this article, you learn to optimize your Azure Data Explorer setup for high concurrency.
ms.reviewer: miwalia
ms.topic: conceptual
ms.date: 02/22/2022
---

# Optimize for high concurrency with Azure Data Explorer

Highly concurrent applications are needed in scenarios with a large user base, where the application simultaneously handles many requests with low latency and high throughput.

Use cases include large-scale monitoring and alerting dashboards. Examples include Microsoft products and services such as [Azure Monitor](https://azure.microsoft.com/services/monitor/), [Azure Time Series Insights](https://azure.microsoft.com/services/time-series-insights/), and [Playfab](https://playfab.com/). All these services use Azure Data Explorer for serving high-concurrency workloads. Azure Data Explorer is a fast, fully managed big data analytics service for real-time analytics on large volumes of data streaming from applications, websites, IoT devices, and more.

> [!NOTE]
> The actual number of queries that can run concurrently on a cluster depends on factors such as cluster SKU, data volumes, query complexity, and usage patterns.

To set up for high-concurrency applications, design the back-end architecture as follows:

* [Optimize data](#optimize-data)
* [Set a leader-follower architecture pattern](#set-a-leader-follower-architecture-pattern)
* [Optimize queries](#optimize-queries)
* [Set cluster policies](#set-cluster-policies)
* [Monitor Azure Data Explorer clusters](#monitor-azure-data-explorer-clusters)

This article presents recommendations for each of the preceding subjects that you can implement to achieve high concurrency in an optimal, cost-effective way. These features can be used alone or in combination.

## Optimize data

For high concurrency, queries should consume the least possible amount of CPU resources. You can use any or all of the following methods:

- [Optimized table schema design](#use-table-schema-design-best-practices)
- [Data partitioning](#partition-data)
- [Pre-aggregation](#pre-aggregate-your-data-with-materialized-views)
- [Caching](#configure-the-caching-policy)

### Use table schema design best practices

Use the following table schema design suggestions to minimize the CPU resources used:

* ID columns should be defined as string data types regardless of whether the values are numeric. Indexing for string columns is more sophisticated than for numeric columns and provides better filtering performance.
* Match the column data type optimally to the actual data stored in these columns. For example, don't store datetime values in a string column.
* Avoid a large sparse table with many columns, and use dynamic columns to store sparse properties.
* Store frequently used properties in their own column with a non-dynamic datatype.
* Denormalize data to avoid joins that demand relatively large CPU resources.

### Partition data

Data is stored in the form of extents (data shards) and is partitioned by ingestion time by default. You can use the [partitioning policy](kusto/management/partitioningpolicy.md) to repartition the extents based on a single string column or a single datetime column in a background process. Partitioning can provide significant performance improvements when most of the queries use partition keys to filter, aggregate, or both.

> [!NOTE]
> The partitioning process itself uses CPU resources. However, the CPU reduction during query time should outweigh the CPU used for partitioning.

### Pre-aggregate your data with materialized views

Pre-aggregate your data to significantly reduce CPU resources during query time. Example scenarios include summarizing data points over a reduced number of time bins, keeping the latest record of a given record, or deduplicating the dataset. Use [materialized views](kusto/management/materialized-views/materialized-view-overview.md) for an easy-to-configure aggregated view over source tables. This feature simplifies the effort of creating and maintaining these aggregated views.

> [!NOTE]
> The background aggregation process uses CPU resources. However, the CPU reduction during query time should outweigh the CPU consumption for aggregation.

### Configure the caching policy

Configure the caching policy so that queries run on data that's stored in the hot storage, also known as the disk cache. Only run limited, carefully designed scenarios on the cold storage, or external, tables.

## Set a leader-follower architecture pattern

The follower database is a feature that follows a database or a set of tables in a database from another cluster located in the same region. This feature is exposed through [Azure Data Share](data-share.md), [Azure Resource Manager APIs](follower.md), and a set of [cluster commands](kusto/management/cluster-follower.md).

Use the leader-follower pattern to set compute resources for different workloads. For example, set up a cluster for ingestions, a cluster for querying or serving dashboards or applications, and a cluster that serves the data science workloads. Each workload in this case will have dedicated compute resources that can be scaled independently, and different caching and security configurations. All clusters use the same data, with the leader writing the data and the followers using it in a read-only mode.

> [!NOTE]
> Follower databases have a lag from the leader, usually of a few seconds. If your solution requires the latest data with no latency, this solution might be useful. Use a view on the follower cluster that unions the data from the leader and the follower and queries the latest data from the leader and the rest of the data from the follower.

To improve the performance of queries on the follower cluster, you can enable [prefetch extents configuration](kusto/management/cluster-follower.md#alter-follower-database-prefetch-extents). Use this configuration carefully, because it could affect the freshness of data in the follower database.

## Optimize queries

Use the following methods to optimize your queries for high concurrency.

Follow [query best practices](kusto/query/best-practices.md) so that your queries are as efficient as possible.

### Use a query results cache

When more than one user loads the same dashboard at a similar time, the dashboard to the second and following users can be served from the cache. This setup provides high performance with almost no CPU usage. Use the [query results cache](kusto/query/query-results-cache.md) feature, and send query results cache configuration with the query by using the `set` statement.

[Grafana](grafana.md) contains a configuration setting for the query results cache at the data source level, so all dashboards use this setting by default and don't need to modify the query.

### Configure query consistency

The default [query consistency](kusto/concepts/queryconsistency.md) mode is **strong**. In this mode, an *admin* node manages metadata and ingestion for the cluster, as well as query planning and delegating execution to other nodes.

In high-concurrency applications, managing queries may cause the *admin* node's CPU use to be high, whilst other nodes are less busy. This can cause a bottleneck where the number of concurrent queries can't grow. However, this may not be apparent in the cluster's CPU report (Azure portal > {your_cluster} > Metrics > CPU Metric) which shows the average CPU use for the cluster.

For this scenario, we recommend using **weak** consistency mode. In this mode, more nodes are able to manage queries, which makes it possible to *horizontally scale* the number of concurrent queries. Nodes in this mode periodically refresh their copy of metadata and newly ingested data, which leads to a latency of typically less than a minute as the data is synchronized. However, this short latency is preferable to the bottleneck situation that can arise when using **strong** consistency mode.

You can set the consistency mode in a [workgroup group query consistency policy](kusto/management/query-consistency-policy) or in the [client request properties](kusto/api/netfx/request-properties.md) or in the Grafana data source configuration.

## Set cluster policies

The number of concurrent requests is capped by default and controlled by the [Request rate limit policy](kusto/management/request-rate-limit-policy.md) so that the cluster doesn't get overloaded. You can adjust this policy for high-concurrency situations. This policy should be adjusted only after rigorous testing, preferably on production-like usage patterns and datasets. Testing ensures the cluster can sustain the modified value. This limit can be configured based on application needs.

## Monitor Azure Data Explorer clusters

Monitoring the health of your cluster resources helps you build an optimization plan by using the features suggested in the preceding sections. Azure Monitor for Azure Data Explorer provides a comprehensive view of your cluster's performance, operations, usage, and failures. Get insights on the queries' performance, concurrent queries, throttled queries, and various other metrics by selecting the **Insights (preview)** tab under the **Monitoring** section of the Azure Data Explorer cluster in the Azure portal.

For information on monitoring clusters, see [Azure Monitor for Azure Data Explorer](/azure/azure-monitor/insights/data-explorer?toc=/azure/data-explorer/toc.json&amp;bc=/azure/data-explorer/breadcrumb/toc.json). For information on the individual metrics, see [Azure Data Explorer metrics](using-metrics.md#supported-azure-data-explorer-metrics).
