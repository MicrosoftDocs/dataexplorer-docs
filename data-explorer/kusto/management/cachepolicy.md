---
title: Cache policy (hot and cold cache) - Azure Data Explorer
description: This article describes Cache policy (hot and cold cache) in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/25/2023
---
# Cache policy (hot and cold cache) 

Ingested data is stored in reliable storage (most commonly Azure Blob Storage),
away from its actual processing (such as Azure Compute) nodes. To speed up queries, parts of the data is cached on processing nodes, SSD, or even in RAM. There is a sophisticated cache mechanism designed to intelligently decide which data objects to cache. The cache policy allows your cluster to describe the data artifacts that it uses, so that more important data can take priority. For example, column indexes and column data shards.

The best query performance is achieved when all ingested data is cached. Sometimes, certain data doesn't justify the cost of keeping it "warm" in local SSD storage.
For example, many teams consider that rarely accessed older log records are of lesser importance.
They prefer to have reduced performance when querying this data, rather than pay to keep it warm all the time.

The granular **cache policy** allows customers to differentiate between: **hot data cache** and **cold data cache**. The cache uses 95% of the local SSD disk to keep all data that falls into the hot data cache category. If the cache policy requires more disk space than the available local SSD disk, the most recent data will preferentially be kept in the cache. The remaining 5% of the local SSD space is used to hold data that isn't categorized as hot. 

One useful implication of this design is that queries that load lots of cold data from reliable storage won't evict data from the hot data cache. These queries won't have a major impact on other queries involving the data in the hot data cache.

The main implications of setting the hot cache policy are:
* **Cost**: The cost of reliable storage can be dramatically lower than for local SSD. It's currently about 45 times cheaper in Azure.
* **Performance**: Data is queried faster when it's in local SSD, particularly for range queries that scan large amounts of data.  

Use the [cache policy command](./show-table-cache-policy-command.md) to manage the cache policy.

> [!TIP]
> Your cluster is designed for ad-hoc queries with intermediate result sets fitting the cluster's total RAM.
>For large jobs, like map-reduce, where you want to store intermediate results in persistent storage such as an SSD, use the continuous export feature. This feature enables you to do long-running batch queries using services like HDInsight or Azure Databricks.
 
## How cache policy is applied

When data is ingested, the system keeps track of the date and time of the ingestion, and of the extent that was created. The extent's ingestion date and time value (or maximum value, if an extent was built from multiple pre-existing extents), is used to evaluate the cache policy.

> [!NOTE]
> You can specify a value for the ingestion date and time by using the ingestion property `creationTime`.
> When doing so, make sure the `Lookback` property in the table's effective [Extents merge policy](mergepolicy.md) is aligned with the values you set for `creationTime`.

By default, the effective policy is `null`, which means that all the data is considered **hot**.
A `null` policy at the table level means that the policy will be inherited from the database. A non-`null` table-level policy overrides a database-level policy.

## Scoping queries to hot cache

Kusto supports queries that are scoped down to hot cache data only.

> [!NOTE]
> Data scoping applies only to entities that support caching policies, such as tables and materialized views.
> It's ignored for other entities, such as external tables and data in the row store.

There are several query possibilities:
* Add a client request property called `query_datascope` to the query.
   Possible values: `default`, `all`, and `hotcache`.
* Use a `set` statement in the query text: `set query_datascope='...'`.
   Possible values are the same as for the client request property.
* Add a `datascope=...` text immediately after a table reference in the query body. 
   Possible values are `all` and `hotcache`.

The `default` value indicates use of the cluster default settings, which determine that the query should cover all data.

If there's a discrepancy between the different methods, then `set` takes precedence over the client request property. Specifying a value for a table reference takes precedence over both.

For example, in the following query all table references will use
hot cache data only, except for the second reference to "T", that is scoped
to all the data:

```kusto
set query_datascope="hotcache";
T | union U | join (T datascope=all | where Timestamp < ago(365d)) on X
```

## Cache policy vs retention policy

Cache policy is independent of [retention policy](./retentionpolicy.md): 
- Cache policy defines how to prioritize resources. Queries for important data are faster.
- Retention policy defines the extent of the queryable data in a table/database (specifically, `SoftDeletePeriod`).

Configure this policy to achieve the optimal balance 
between cost and performance, based on the expected query pattern.

Example:
* `SoftDeletePeriod` = 56d
* `hot cache policy` = 28d

In the example, the last 28 days of data will be on the cluster SSD and the
additional 28 days of data will be stored in Azure blob storage.
You can run queries on the full 56 days of data.
 
## See also

* [Hot windows for infrequent queries over cold data](../../hot-windows.md)
