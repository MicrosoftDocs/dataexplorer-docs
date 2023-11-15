---
title:  Extent tags
description: Learn how to create and use extent tags.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/15/2023
---
# Extent tags

An *extent tag* is a string that describes properties common to all data in an [extent](extents-overview.md). For example, during data ingestion, you can append an extent tag to signify the source of the ingested data. Subsequently, you can leverage this tag for analysis.

Extents can hold multiple tags as part of their metadata. When extents merge, their tags also merge, ensuring consistent metadata representation.

To see the tags associated with an extent, use the [.show extents](./show-extents.md) command. For a granular view of tags associated with records within an extent, use the [extent-tags()](../query/extenttagsfunction.md) function.

> [!IMPORTANT]
> Tags starting with `drop-by:` or `ingest-by:` carry specific meanings. For more information, see [drop-by extent tags](#drop-by-extent-tags) and [ingest-by extent tags](#ingest-by-extent-tags).

## `drop-by:` extent tags

Tags that start with a `drop-by:` prefix can be used to control which other extents to merge with. Extents that have the same set of `drop-by:` tags can be merged together, but they won't be merged with other extents if they have a different set of `drop-by:` tags.

> [!NOTE]
>
> * Avoid excessive use of `drop-by` tags, as they are intended for rare events.
> * These tags should not be used to replace individual record-level data and are most effective when applied to large amounts of data.
> * Assigning unique `drop-by` tags to each record, a small number of records, or files can significantly impact performance.

### Examples

#### Determine which extents can be merged together

If:

* Extent 1 has the following tags: `drop-by:blue`, `drop-by:red`, `green`.
* Extent 2 has the following tags: `drop-by:red`, `yellow`.
* Extent 3 has the following tags: `purple`, `drop-by:red`, `drop-by:blue`.

Then:

* Extents 1 and 2 won't be merged together, as they have a different set of `drop-by` tags.
* Extents 2 and 3 won't be merged together, as they have a different set of `drop-by` tags.
* Extents 1 and 3 can be merged together, as they have the same set of `drop-by` tags.

#### Use `drop-by` tags as part of extent-level operations

The following query issues a command to drop extents according to their `drop-by:` tag.

```kusto
.ingest ... with @'{"tags":"[\"drop-by:2016-02-17\"]"}'

.drop extents <| .show table MyTable extents where tags has "drop-by:2016-02-17" 
```

## `ingest-by:` extent tags

Tags with the prefix `ingest-by:` can be used together with the `ingestIfNotExists` property to ensure that data is ingested only once.

The `ingestIfNotExists` property prevents duplicate ingestion by checking if an extent with the specified `ingest-by:` tag already exists. Typically, an ingest command contains an `ingest-by:` tag and the `ingestIfNotExists` property with the same value.

> [!NOTE]
>
> * Avoid excessive use of `ingest-by` tags.
> * Assigning unique `ingest-by` tags for each ingestion call might severely impact performance.
> * If the pipeline is known to have data duplications, we recommend that you solve these duplications before ingesting data.

### Examples

#### Add a tag on ingestion

The following command ingests the data and adds the tag `ingest-by:2016-02-17`.

```kusto
.ingest ... with (tags = '["ingest-by:2016-02-17"]')
```

#### Prevent duplicate ingestion

The following command ingests the data so long as no extent in the table has the `ingest-by:2016-02-17` tag.

```kusto
.ingest ... with (ingestIfNotExists = '["2016-02-17"]')
```

#### Prevent duplicate ingestion and add a tag to any new data

The following command ingests the data so long as no extent in the table has the `ingest-by:2016-02-17` tag. Any newly ingested data gets the `ingest-by:2016-02-17` tag.

```kusto
.ingest ... with (ingestIfNotExists = '["2016-02-17"]', tags = '["ingest-by:2016-02-17"]')
```

## Limitations

* Extent tags can only be applied to records within an extent. They are set on the extents, not directly on the individual records. Consequently, tags can't be set on streaming ingestion data before it gets stored in extents.
* Extent tags can't be stored on data in external tables or materialized views.

## Related content

* [Extents (data shards) overview](extents-overview.md)
* [Extent tags retention policy](extent-tags-retention-policy.md)
* [.drop table extent tags](drop-extent-tags.md)
