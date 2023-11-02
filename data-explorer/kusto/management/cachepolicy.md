---
title:  Caching policy (hot and cold cache)
description: This article describes caching policy (hot and cold cache).
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/02/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-adx-fabric
---
# Caching policy (hot and cold cache)

::: zone pivot="azuredataexplorer"

Azure Data Explorer uses a multi-tiered data cache system to ensure fast query performance. Data is stored in reliable storage, such as Azure Blob Storage, but parts of it are cached on processing nodes, SSD, or even in RAM for faster access.

::: zone-end

::: zone pivot="fabric"

Real-Time Analytics uses a multi-tiered data cache system to ensure fast query performance. Data is stored in reliable storage, such as OneLake, but parts of it are cached on processing nodes, SSD, or even in RAM for faster access.

::: zone-end

The caching policy allows you to choose which data should be cached. You can differentiate between *hot data cache* and *cold data cache* by setting a caching policy on hot data. Hot data is kept in local SSD storage for faster query performance, while cold data is stored in reliable storage, which is cheaper but slower to access.

The cache uses 95% of the local SSD disk for hot data. If there isn't enough space, the most recent data is preferentially kept in the cache. The remaining 5% is used for data that isn't categorized as hot. This design ensures that queries loading lots of cold data won't evict hot data from the cache.

The best query performance is achieved when all ingested data is cached. However, certain data might not warrant the expense of being kept in the hot cache. For instance, infrequently accessed old log records may be considered less crucial. In such cases, teams often opt for lower querying performance over paying to keep the data warm.

::: zone pivot="fabric"

Use management commands to alter the caching policy at the [database](alter-database-cache-policy-command.md), [table](alter-table-cache-policy-command.md), or [materialized view](alter-materialized-view-cache-policy-command.md) level.

::: zone-end

::: zone pivot="azuredataexplorer"

Use management commands to alter the caching policy at the [cluster](alter-cluster-cache-policy-command.md), [database](alter-database-cache-policy-command.md), [table](alter-table-cache-policy-command.md), or [materialized view](alter-materialized-view-cache-policy-command.md) level.

> [!TIP]
> Your cluster is designed for ad hoc queries with intermediate result sets that fit in the cluster's total RAM.
> For large jobs, like map-reduce, it can be useful to store intermediate results in persistent storage. To do so, create a [continuous export](../management/data-export/continuous-data-export.md) job. This feature enables you to do long-running batch queries using services like HDInsight or Azure Databricks.

::: zone-end

## How caching policy is applied

When data is ingested, the system keeps track of the date and time of the ingestion, and of the extent that was created. The extent's ingestion date and time value (or maximum value, if an extent was built from multiple pre-existing extents), is used to evaluate the caching policy.

> [!NOTE]
> You can specify a value for the ingestion date and time by using the ingestion property `creationTime`.
> When doing so, make sure the `Lookback` property in the table's effective [Extents merge policy](mergepolicy.md) is aligned with the values you set for `creationTime`.

By default, the effective policy is `null`, which means that all the data is considered **hot**. A `null` policy at the table level means that the policy will be inherited from the database. A non-`null` table-level policy overrides a database-level policy.

## Scoping queries to hot cache

When running queries, you can limit the scop to only query data in hot cache.

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

For example, in the following query all table references will use hot cache data only, except for the second reference to "T", that is scoped
to all the data:

```kusto
set query_datascope="hotcache";
T | union U | join (T datascope=all | where Timestamp < ago(365d)) on X
```

## Caching policy vs retention policy

Caching policy is independent of [retention policy](./retentionpolicy.md):

* Caching policy defines how to prioritize resources. Queries for important data are faster.
* Retention policy defines the extent of the queryable data in a table/database (specifically, `SoftDeletePeriod`).

Configure this policy to achieve the optimal balance between cost and performance, based on the expected query pattern.

Example:

* `SoftDeletePeriod` = 56d
* `hot cache policy` = 28d

In the example, the last 28 days of data will be on the cluster SSD and the additional 28 days of data will be stored in Azure blob storage. You can run queries on the full 56 days of data.

## Related content

* [Hot windows for infrequent queries over cold data](../../hot-windows.md)
