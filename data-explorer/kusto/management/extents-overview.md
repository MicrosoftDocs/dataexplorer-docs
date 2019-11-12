---
title: Extents (data shards) - Azure Data Explorer | Microsoft Docs
description: This article describes Extents (data shards) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/11/2019
---
# Extents (data shards)

## Overview

Kusto is built to support tables with a huge number of records (rows)
and a lot of data. To be able to handle such large tables, Kusto
divides each table's data into smaller "tablets" called **data shards**
or **extents** (the two terms are synonyms), such that the union of
all the table's extents holds the table's data. Individual extents
are then kept smaller than a single node's capacity, and the extents
are spread over the cluster's nodes, achieving scale-out. 

One can think of an extent as a kind of mini-table. The extent
holds metadata (indicating the schema of the data in the extent
and additional information such as its creation time and optional tags
associated with the data in the extent) and data. Additionally, the extent
usually holds information that allows Kusto to query the data efficiently,
such as an index for each column of data in the extent, and an encoding
dictionary if column data is encoded. Thus, the table's data is the union
of all data in the table's extents.

Extents are *immutable*. Once created, an extent is never modified,
and the extent may only be queried, reassigned to a different node,
or dropped out of the table. Data modification happens by creating
one or more new extents and transactionally swapping old extent(s)
with new extent(s).

Extents hold a collection of records, physically arranged in columns.
This technique (called **columnar store**) makes it possible to efficiently
encode and compress the data (because different values from the same
column often "resemble" each other), and makes querying for large
spans of data more efficient because just the columns used by the query
need to be loaded. Internally, each column of data in the extent is 
subdivided into segments, and the segments into blocks. This division
(which is not observable to queries) allows Kusto to optimize column
compression and indexing. 

To maintain query efficiency, smaller extents are merged into larger extents.
This is performed automatically by Kusto, as a background process, according
to the configured [merge policy](../concepts/mergepolicy.md) and 
[sharding policy](../concepts/shardingpolicy.md). 
Merging extents together reduces the management
overhead of having a large number of extents to track, but more importantly,
it allows Kusto to optimize its indexes and improve compression. Extent
merging stops once an extent reaches certain limits, such as size,
as beyond a certain point merging extents reduces rather than increases
efficiency.



> [!NOTE]
> The process of merging extents does not modify existing extents.
> Rather, a new extent is created as a merge of multiple existing extents, and
> then the merged extent replaces its forefathers in a single transaction.

The common "lifecycle" of an extent therefore is:
1. The extent is created by an **ingestion** operation.
2. The extent is merged with other extents. When the extents being merged
   are small, Kusto actually performs an ingestion process on them (this
   is called **rebuild**). Once extents reach a certain size, merging is
   done only for indexes and the extents' data artifacts in storage are
   not modified.
3. The merged extent (possibly one that tracks its lineage to other
   merged extents and so on) is eventually dropped due to a retention
   policy. When extents are dropped based on time (older x hours / days)
   the creation date of the newest extent inside the merged one is
   taken into the calculation. 

## Extent Ingestion time

One of the more important pieces of information for each extent is its
ingestion time. This time is used by Kusto for:
1. Retention (extents that were ingested earlier will be dropped earlier).
2. Caching (extents that have been ingested recently will be hotter).
3. Sampling (when using query operations such as `take`, recent extents
   are favored).

In fact, Kusto tracks two `datetime` values per extent: `MinCreatedOn` and `MaxCreatedOn`.
These values start out the same, but when the extent is merged with other
extents, the resulting extent's values are the minimum and maximum, respectively,
values over all merged extents.

An extent's ingestion time may be set in one of three ways:
1. Normally, the node performing the ingestion sets this value according to
   its local clock.
2. If an **ingestion time policy** is set on the table, the node performing
   the ingestion sets this value according to the cluster's admin node's
   local clock, guaranteeing that all later ingestions will have a higher
   ingestion time value.
3. The client may set this time. (This is useful, for example, if the
   client wants to re-ingest data and does not want the re-ingested data to
   appear as if it had arrived late, for example for retention purposes).    

## Extent Tagging

As part of the metadata stored with an extent, Kusto supports attaching multiple
optional *extent tags* to the extent. An extent tag (or simply *tag*), is
a string that is associated with the extent. One can use the
[.show extents](extents-commands.md#show-extents)
commands to see the tags associated with an extent, and the
[extent-tags()](../query/extenttagsfunction.md) 
function to see the tags associated with records in an extent.
Extent tags can be used to efficiently describe properties that pertain to 
all the data in the extent.
For example, one could add an extent tag during ingestion that indicates
the source of the data being ingested, and later on use that tag. As they
describe data, when two or more extents are merged their associated tags
are also merged by having the resulting extent's tags be the union of all
the extent tags of the extents being merged.

Kusto assigns a special meaning to all extent tags whose value has the
format *prefix* *suffix*, where *prefix* is one of:
* `drop-by:`
* `ingest-by:`

## 'drop-by:' extent tags
Tags that start with a **`drop-by:`** prefix can be used to control which other
extents to merge with; extents that have a given `drop-by:` tag can be merged
together, but they won't be merged with other extents. This allows the user
to issue a command to drop extents according to their `drop-by:` tag, such as
the following command:

```kusto
.ingest ... with @'{"tags":"[\"drop-by:2016-02-17\"]"}'

.drop extents <| .show table MyTable extents where tags has "drop-by:2016-02-17" 
```

**Performance notes:** 
- Over-using `drop-by` tags is not recommended. The support for dropping 
data in the manner mentioned above is meant for rarely-occurring events, is not 
for replacing record-level data, and critically relies on the fact that the data 
being tagged in this manner is "bulky". Attempting to give a different tag for 
each record, or small number of records, might result with a severe impact on 
performance.
- In cases where such tags aren't required some period of time after data being ingested,
it's recommended to [drop the tags](extents-commands.md#drop-extent-tags).


## 'ingest-by:' extent tags
Tags that start with an **`ingest-by:`** prefix can be used to ensure that data
is only ingested once. The user can issue an ingest command that prevents
the data from being ingested if there's already an extent with this specific
`ingest-by:` tag by using the **`ingestIfNotExists`** property.
The values for both `tags` and `ingestIfNotExists` are arrays of strings,
serialized as JSON.

The following example ingests data only once (the 2nd and 3rd commands will do nothing):

```kusto
.ingest ... with (tags = '["ingest-by:2016-02-17"]')

.ingest ... with (ingestIfNotExists = '["2016-02-17"]')

.ingest ... with (ingestIfNotExists = '["2016-02-17"]', tags = '["ingest-by:2016-02-17"]')
```

> [!NOTE] 
> In the common case, an ingest command is likely to include
>  both an `ingest-by:` tag and an `ingestIfNotExists` property,
>  set to the same value (as shown in the 3rd command above).

**Performance notes:**
- Overusing `ingest-by` tags is not recommended.
If the pipeline feeding Kusto is known to have data duplications, it's recommended
to solve these as much as possible before ingesting the data into Kusto,
and use `ingest-by` tags in Kusto only for cases where the part which ingests to Kusto
could introduce duplicates by itself (e.g. there's a retry mechanism which can overlap
with already-in-progress ingestion calls). Attempting to set a unique `ingest-by` tag
for each ingestion call might result with a severe impact on performance.
- In cases where such tags aren't required some period of time after data being ingested,
it's recommended to [drop the tags](extents-commands.md#drop-extent-tags).