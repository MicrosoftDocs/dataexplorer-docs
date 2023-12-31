---
title:  Extents (data shards)
description: This article describes Extents (data shards) in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/15/2023
---
# Extents (data shards)

Tables are partitioned into *extents*, or *data shards*. Each extent is a horizontal segment of the table that contains data and metadata such as its creation time and optional tags. The union of all these extents contains the entire dataset of the table. Extents are evenly distributed across nodes in the cluster, and they're cached in both local SSD and memory for optimized performance.

Extents are immutable, meaning they can be queried, reassigned to a different node, or dropped out of the table but never modified. Data modification happens by creating new extents and transactionally swapping old extents with the new ones. The immutability of extents provides benefits such as increased robustness and easy reversion to previous snapshots.

Extents hold a collection of records that are physically arranged in columns, enabling efficient encoding and compression of the data. To maintain query efficiency, smaller extents are merged into larger extents according to the configured [merge policy](merge-policy.md) and [sharding policy](sharding-policy.md). Merging extents reduces management overhead and leads to index optimization and improved compression.

The common extent lifecycle is as follows:

1. The extent is created by an ingestion operation.
1. The extent is merged with other extents.
1. The merged extent (possibly one that tracks its lineage to other extents) is eventually dropped because of a [retention policy](retention-policy.md).

## Extent creation time

Two [datetime](../query/scalar-data-types/datetime.md) values are tracked per extent: `MinCreatedOn` and `MaxCreatedOn`. These values are initially the same but may change when the extent is merged with other extents. When the extent is merged with other extents, the new values are according to the original minimum and maximum values of the merged extents.

The creation time of an extent is used for the following purposes:

* Retention: Extents created earlier are dropped earlier.
* Caching: Extents created recently are kept in [hot cache](cache-policy.md).
* Sampling: Recent extents are preferred when using query operations such as [take](../query/takeoperator.md).

To overwrite the creation time of an extent, provide an alternate `creationTime` in the [data ingestion properties](../../ingestion-properties.md). This can be useful for retention purposes, such as if you want to reingest data but don't want it to appear as if it arrived late.

> [!NOTE]
> The calculation for removing an extent based on time uses the creation time of the newest extent within the merged extent.

## Related content

* [Extent tags](extent-tags.md)
* [Merge policy](merge-policy.md)
* [Partitioning policy](partitioning-policy.md)
