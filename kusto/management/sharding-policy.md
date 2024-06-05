---
title: Data sharding policy
description: Learn how to use the data sharding policy to define if and how extents in the Azure Data Explorer cluster are created.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# Data sharding policy

The sharding policy defines if and how [extents (data shards)](../management/extents-overview.md) in your cluster are created. You can only query data in an extent once it's created.

> [!NOTE]
>
> * For low latency between ingestion and query, consider configuring [Streaming ingestion](../../ingest-data-streaming.md).
> * The policy applies to all operations that create new extents,
> such as commands for data ingestion, and [extent merge operations](extents-overview.md)

The data sharding policy contains the following properties:

* **ShardEngineMaxRowCount**:
  * Maximum row count for an extent created by an ingestion or rebuild operation.
  * Defaults to 1,048,576.
  * **Not in effect** for [merge operations](merge-policy.md).
    * If you must limit the number of rows in extents created by merge operations, adjust the `RowCountUpperBoundForMerge` property in the entity's [extents merge policy](merge-policy.md).
* **ShardEngineMaxExtentSizeInMb**:
  * Maximum allowed compressed data size (in megabytes) for an extent created by a merge or rebuild operation.
  * Defaults to 8,192 (8GB).

* **ShardEngineMaxOriginalSizeInMb**:
  * Maximum allowed original data size (in megabytes) for an extent created by a rebuild operation.
  * In effect **only for [rebuild](merge-policy.md) operations**.
  * Defaults to 3,072 (3GB).

> [!WARNING]
> Consult with the support team before altering a data sharding policy.

When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

Use the [sharding policy management commands](show-table-sharding-policy-command.md) to manage data sharding policies for databases and tables.
