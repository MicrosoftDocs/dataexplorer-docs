---
title: Data sharding policy - Azure Data Explorer | Microsoft Docs
description: This article describes Data sharding policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/02/2019

---
# Data sharding policy

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) in the Azure Data Explorer cluster should be sealed.

> [!NOTE]
> The policy applies to all operations that create new extents,
> such as commands for [data ingestion](../management/data-ingestion/index.md), and
> [.merge and .rebuild commands](../management/extents-commands.md#merge-extents)

The data sharding policy contains the following properties:

- **MaxRowCount**:
    - Maximum row count for an extent created by an ingestion or rebuild operation.
    - Defaults to 750,000.
    - **Not in effect** for [merge operations](../concepts/mergepolicy.md).
        - If you must limit the number of rows in extents created by merge operations, adjust the `RowCountUpperBoundForMerge` property in the entity's [extents merge policy](../concepts/mergepolicy.md).
- **MaxExtentSizeInMb**:
    - Maximum allowed compressed data size (in megabytes) for an extent created by a merge operation.
    - In effect **only for [merge](../concepts/mergepolicy.md) operations**.
    - Defaults to 1,024 (1GB).

- **MaxOriginalSizeInMb**:
    - Maximum allowed original data size (in megabytes) for an extent created by a rebuild operation.
    - In effect **only for [rebuild](../concepts/mergepolicy.md) operations**.
    - Defaults to 2,048 (2GB).

> [!WARNING]
> Consult with the Azure Data Explorer team before altering a data sharding policy.

When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

Use the [sharding policy control commands](../management/sharding-policy.md)) to manage data sharding policies for databases and tables.
 