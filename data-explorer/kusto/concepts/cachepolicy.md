---
title: Cache policy (hot and cold cache) - Azure Data Explorer | Microsoft Docs
description: This article describes Cache policy (hot and cold cache) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 07/15/2019

---
# Cache policy (hot and cold cache)

## Overview

Kusto stores its ingested data in reliable storage (most commonly Azure Blob Storage),
away from its actual processing (e.g. Azure Compute) nodes. To speed-up queries on that
data, Kusto caches this data (or parts of it) on its processing nodes, SSD or even in
RAM. Kusto includes a sophisticated cache mechanism designed to make intelligent decisions
as to which data objects to cache. The cache allows Kusto to describe the data artifacts
that it uses (such as column indexes and column data shards) so that more "important" data
can take priority.

While best query performance is achieved when all ingested data is cached, often
certain data does not justify the cost of keeping it "warm" in local SSD storage.
For example, many teams consider older log records to be of lesser importance (as it is
rarely accessed), and would prefer to have reduced performance when querying this data,
rather than pay to keep it warm all the time.

The Kusto cache provides a granular **cache policy** that customers can use to differentiate
between two data cache policies: **hot data cache** and **cold data cache**. The Kusto cache
will attempt to keep all data that falls into the hot data cache in local SSD (or RAM),
up to the defined size of the hot data cache. The remaining local SSD space will be used
to hold data that is not categorized as hot. One useful implication of this design is that
queries that load a lot of cold data from reliable storage will not evict data from the hot
data cache. Therefore there will not be a major impact on queries involving the data in the
hot data cache.

The main implications of setting the hot cache policy are:
* **Cost** The cost of reliable storage can be dramatically cheaper
  than local SSD (for example, in Azure it is currently about x45 times cheaper).
* **Performance** Data can be queried faster when it is in local SSD. This is particularly
  true for range queries, i.e. queries that scan large quantities of data.  

See [here](../management/cache-policy.md)
for the control commands which allow administrators to manage the cache policy.

## How the cache policy gets applied

When data is ingested into Kusto, the system keeps track of the date/time at which
ingestion was performed and the extent was created. The extent's ingestion date/time
value (or maximum value, if an extent was built from multiple pre-existing extents)
is used to evaluate the cache policy.

By default, the effective policy is `null`, which means all the data is considered **hot**.
A non-`null` table-level policy overrides a database-level policy.

> [!Note] 
> You can specify a value for the ingestion date/time by using the ingestion property `creationTime`. 

## Scoping queries to hot cache

Kusto supports queries that are scoped-down to hot cache data only. There are
several ways to do this:

- Add a client request property called `query_datascope` to the query
   Possible values: `default`, `all`, and `hotcache`.
- Use a `set` statement in the query text: `set query_datascope='...'`,
   Possible values are the same as for the client request property.
- Add a `datascope=...` text immediately after a table reference in the
   query body. Possible values are `all` and `hotcache`.

The `default` value indicates use of the cluster default settings, which determine that the query should cover all data.



If there is a discrepancy between the different methods: 
`set` takes precedence over the client request property, and specifying a value for a table reference
takes precedence over both.

For example, in the following query all table references will use
hotcache data only, except for the second reference to  `T` which is scoped
to all the data:

```kusto
set query_datascope="hotcache";
T | union U | join (T datascope=all | where Timestamp < ago(365d) on X
```

## Cache policy vs retention policy

Cache policy is independent of [retention policy](./retentionpolicy.md): 
- Cache policy defines how to prioritize resources so that queries over important data will be 
  faster and resistant to the impact of queries over less-important data. 
- Retention policy defines the extent of the queryable
  data in a table/database (specifically, `SoftDeletePeriod`).

Thus, it is recommended to configure this policy to achieve the optimal balance
between cost and performance based on the expected query pattern.

Here is a quick example:
* `SoftDeletePeriod` = 56d
* `hot cache policy` = 28d

In the example, the last 28 days of data will be on the cluster SSD and the
**additional** 28 days will be stored in Azure blob storage. 
You can run queries on the full 56 days of data. 

## Cache policy does not make Kusto a cold storage technology

At times, customers wrongly assume that they can replace cold storage query technologies
such as Data Lake Analytics and Hadoop by using Kusto with a very long retention period and a small amount
of hot cache. However, this doesn't work, while the Kusto cold data cache can enable great
performance over cold storage data for point queries, it is not designed for large cold-span
queries that process huge data sets like Data Lake Analytics and Hadoop. In particular:
- Kusto sacrifices some aspects such as resilience to node failures during a long query for excellent ad-hoc performance
- Kusto is tuned for ad-hoc queries with intermediate result sets fitting the cluster's total
  RAM, rather than tuning its algorithms for storing intermediate results in persistent storage (such as SSD) which is often required for large map-reduce-like jobs.