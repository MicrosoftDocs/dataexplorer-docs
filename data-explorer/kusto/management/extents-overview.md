---
title:  Extents (data shards)
description: This article describes Extents (data shards) in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/11/2023
---
# Extents (data shards)

## Overview

Kusto is built to support tables with a huge number of records (rows)
and large amounts of data. To handle such large tables, each table's data 
is divided into smaller "chunks" called **data shards**
or **extents** (the two terms are synonymous). The union of
all the table's extents holds the table's data. Individual extents
are kept smaller than a single node's capacity, and the extents
are spread over the cluster's nodes, achieving scale-out.

An extent is a like a type of mini-table. It contains data and metadata
and information such as its creation time and optional tags
that are associated with its data. Additionally, the extent
usually holds information that lets Kusto query the data efficiently.
For example, an index for each column of data in the extent, and an encoding
dictionary, if column data is encoded. As a result, the table's data is the union
of all the data in the table's extents.

Extents are immutable and can never be modified. It may only be queried, 
reassigned to a different node, or dropped out of the table. 
Data modification happens by creating one or more new extents 
and transactionally swapping old extents with new ones.

Extents hold a collection of records that are physically arranged in columns.
This technique is called **columnar store**. It enables efficient encoding and compression of the data, because different values from the same
column often "resemble" each other. It also makes querying large
spans of data more efficient, because only the columns used by the query
need to be loaded. Internally, each column of data in the extent is 
subdivided into segments, and the segments into blocks. This division isn't observable to queries, and lets Kusto optimize column compression and indexing.

To maintain query efficiency, smaller extents are merged into larger extents.
The merge is done automatically, as a background process, according
to the configured [merge policy](mergepolicy.md) and 
[sharding policy](shardingpolicy.md).
Merging extents reduces the management overhead of having a large number of extents to track. More importantly, it allows Kusto to optimize its indexes and improve compression.

Extent merging stops once an extent reaches certain limits, such as size,
since beyond a certain point, merging reduces rather than increases efficiency.

When a [Data partitioning policy](partitioningpolicy.md) is defined
on a table, extents go through another background process after they're
created (post-ingestion). This process reingests the data from the source extents
and creates *homogeneous* extents, in which the values of the column that is the
table's *partition key* all belong to the same partition. If the policy includes a
*hash partition key*, all homogeneous extents that belong to
the same partition will be assigned to the same data node in the cluster.

> [!NOTE]
> Extent-level operations, such as merging or altering extent tags, don't modify existing extents.
> Instead, new extents are created in these operations, based on existing source extents. The new extents replace their forefathers in a single transaction.

The common extent lifecycle is:

1. The extent is created by an **ingestion** operation.
1. The extent is merged with other extents. When the extents being merged
   are small, Kusto actually carries out an ingestion process on them, called **rebuild**. Once extents reach a certain size, merging is done only for indexes. The extents' data artifacts in storage aren't modified.
1. The merged extent (possibly one that tracks its lineage to other
   merged extents, and so on) is eventually dropped because of a retention policy. 
   When extents are dropped, based on time (older x hours / days), then the creation date of the newest extent inside the merged one is used in the calculation.

## Extent creation time

One of the more important pieces of information for each extent is its
creation time. This time is used for:

1. **Retention** - Extents that were created earlier will be dropped earlier.
1. **Caching** - Extents that were created recently will be kept in [hot cache](cachepolicy.md).
1. **Sampling** - Recent extents are favored, when using query operations such as `take`.

In fact, Kusto tracks two `datetime` values per extent: `MinCreatedOn` and `MaxCreatedOn`.
Initially, the two values are the same. When the extent is merged with other extents, 
the new values are according to the original minimum and maximum values of the merged extents.

Normally, an extent's creation time is set according to the time in which the data in the extent is ingested. Clients can optionally overwrite the extent's creation time, by providing an alternative creation time in the [ingestion properties](../../ingestion-properties.md).
Overwriting is useful, for example for retention purposes, if the client wants to reingest data and doesn't want it to appear as if it arrived late.

## Extent tagging

Kusto supports attaching multiple optional *extent tags* to the extent, as part of its metadata. An extent tag, or simply *tag*, is a string that is associated with the extent. You can use the [.show extents](./show-extents.md) commands to see the tags associated with an extent, and the [extent-tags()](../query/extenttagsfunction.md) function to see the tags associated with records in an extent.

Extent tags can be used to efficiently describe properties that are common to all of the data in the extent. For example, you could add an extent tag during ingestion, that indicates the source of the ingested data, and use that tag later. Since the extents describe data, when two or more merge, their associated tags also merge. The resulting extent's tags will be the union of all the tags of those merged extents.

Kusto assigns a special meaning to all extent tags whose start with [drop-by](#drop-by-extent-tags) or [ingest-by](#ingest-by-extent-tags).

### 'drop-by:' extent tags

Tags that start with a `drop-by:` prefix can be used to control which other extents to merge with. Extents that have the same set of `drop-by:` tags can be merged together, but they won't be merged with other extents if they have a different set of `drop-by:` tags.

> [!NOTE]
>
> * Avoid excessive use of `drop-by` tags, as they are intended for rare events.
> * These tags should not be used to replace individual record-level data and are most effective when applied to large amounts of data.
> * Assigning unique `drop-by` tags to each record, a small number of records, or files can significantly impact performance.

#### Examples

##### Determine which extents can be merged together

If:

* Extent 1 has the following tags: `drop-by:blue`, `drop-by:red`, `green`.
* Extent 2 has the following tags: `drop-by:red`, `yellow`.
* Extent 3 has the following tags: `purple`, `drop-by:red`, `drop-by:blue`.

Then:

* Extents 1 and 2 won't be merged together, as they have a different set of `drop-by` tags.
* Extents 2 and 3 won't be merged together, as they have a different set of `drop-by` tags.
* Extents 1 and 3 can be merged together, as they have the same set of `drop-by` tags.

##### Use `drop-by` tags as part of extent-level operations

The following query issues a command to drop extents according to their `drop-by:` tag.

```kusto
.ingest ... with @'{"tags":"[\"drop-by:2016-02-17\"]"}'

.drop extents <| .show table MyTable extents where tags has "drop-by:2016-02-17" 
```

### 'ingest-by:' extent tags

Tags with the prefix `ingest-by:` can be used together with the `ingestIfNotExists` property to ensure that data is ingested only once.

The `ingestIfNotExists` property prevents duplicate ingestion by checking if an extent with the specified `ingest-by:` tag already exists. Typically, an ingest command contains an `ingest-by:` tag and the `ingestIfNotExists` property with the same value.

> [!NOTE]
>
> * Avoid excessive use of `ingest-by` tags.
> * Assigning unique `ingest-by` tags for each ingestion call might severely impact performance.
> * If the pipeline is known to have data duplications, we recommend that you solve these duplications before ingesting data.

#### Examples

##### Add a tag on ingestion

The following command ingests the data and adds the tag `ingest-by:2016-02-17`.

```kusto
.ingest ... with (tags = '["ingest-by:2016-02-17"]')
```

##### Prevent duplicate ingestion

The following command ingests the data so long as no extent in the table has the `ingest-by:2016-02-17` tag.

```kusto
.ingest ... with (ingestIfNotExists = '["2016-02-17"]')
```

##### Prevent duplicate ingestion and add a tag to any new data

The following command ingests the data so long as no extent in the table has the `ingest-by:2016-02-17` tag. Any newly ingested data gets the `ingest-by:2016-02-17` tag.

```kusto
.ingest ... with (ingestIfNotExists = '["2016-02-17"]', tags = '["ingest-by:2016-02-17"]')
```

## See also

* [drop extent tags](drop-extent-tags.md)
* [extent tags retention policy](extent-tags-retention-policy.md)
