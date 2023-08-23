---
title:  Extents (data shards)
description: This article describes Extents (data shards) in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/23/2023
---
# Extents (data shards)

Tables are divided into smaller subtables called *extents*, or *data shards*. An extent is like a mini-table that contains data and metadata such as its creation time and optional tags. The union of all the table’s extents holds the table’s data. Extents are spread evenly across the cluster nodes, where they’re cached on the local SSD and in memory.

Extents are immutable, meaning they can be queried, reassigned to a different node, or dropped out of the table but never modified. Data modification happens by creating new extents and transactionally swapping old extents with the new ones. The immutability of extents provides benefits such as increased robustness and easy reversion to previous snapshots.

Extents hold a collection of records that are physically arranged in columns, enabling efficient encoding and compression of the data. To maintain query efficiency, smaller extents are merged into larger extents according to the configured [merge policy](mergepolicy.md) and [sharding policy](shardingpolicy.md). Merging extents reduces management overhead and leads to index optimization and improved compression.

The common extent lifecycle is as follows:

1. The extent is created by an ingestion operation.
1. The extent is merged with other extents.
1. The merged extent (possibly one that tracks its lineage to other extents) is eventually dropped because of a [retention policy](retentionpolicy.md).

## Extent creation time

Two [datetime](../query/scalar-data-types/datetime.md) values are tracked per extent: `MinCreatedOn` and `MaxCreatedOn`. These values are initially the same but may change when the extent is merged with other extents. When the extent is merged with other extents, the new values are according to the original minimum and maximum values of the merged extents.

The creation time of an extent is used for the following purposes:

* Retention: Extents created earlier are dropped earlier.
* Caching: Extents created recently are kept in [hot cache](cachepolicy.md).
* Sampling: Recent extents are preferred when using query operations such as [take](../query/takeoperator.md).

To overwrite the creation time of an extent, provide an alternate `creationTime` in the [data ingestion properties](../../ingestion-properties.md). This can be useful for retention purposes, such as if you want to reingest data but don't want it to appear as if it arrived late.

## Extent tags

An *extent tag* is a string that describes properties common to all data in an extent. Multiple tags can be attached to an extent as part of its metadata. 
When extents merge, their tags also merge. Use the [.show extents](./show-extents.md) command to see the tags associated with an extent, and the [extent-tags()](../query/extenttagsfunction.md) function to see the tags associated with records in an extent.

Extent tags can be used to describe properties that are common to all of the data in the extent. For example, add an extent tag during ingestion that indicates the source of the ingested data and use that tag later to perform some analysis.

> [!IMPORTANT]
> Tags starting with `drop-by:` or `ingest-by:` have specific meanings. For more information, see [drop-by extent tags](#drop-by-extent-tags) and [ingest-by extent tags](#ingest-by-extent-tags).

### `drop-by:` extent tags

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

### `ingest-by:` extent tags

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

## Related content

* [drop extent tags](drop-extent-tags.md)
* [extent tags retention policy](extent-tags-retention-policy.md)
* [partitioning policy](partitioningpolicy.md)
