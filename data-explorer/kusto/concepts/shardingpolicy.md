---
title: Data Sharding policy - Azure Data Explorer | Microsoft Docs
description: This article describes Data Sharding policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/26/2019
---
# Data Sharding policy
The policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the Kusto cluster should be sealed.

> [!NOTE]
> The policy applies to all operations that end up creating new extents,
> such as commands for [data ingestion](../management/data-ingestion/index.md),
> [.merge and .rebuild commands](../management/extents-commands.md#merge-extents)
> etc.

The data sharding policy contains the following properties:

- **MaxRowCount**:
    - Maximum row count for an extent created by an ingestion operation, or a Rebuild operation.
    - Defaults to 750,000.
    - `Not in effect` for [Merge operations](../concepts/mergepolicy.md).
        - In case it is required to limit the number of rows in extents created by Merge operations, one is
          required to adjust the `RowCountUpperBoundForMerge` property in the entity's
          [extents merge policy](../concepts/mergepolicy.md).
- **MaxExtentSizeInMb**:
    - Maximum allowed compressed data size (in Megabytes) for an extent created by a Merge operation.
    - In effect **only for [Merge](../concepts/mergepolicy.md) operations**.
    - Defaults to 1,024 (i.e. 1GB).

- **MaxOriginalSizeInMb**:
    - Maximum allowed original data size (in Megabytes) for an extent created by a Rebuild operation.
    - In effect **only for [Rebuild](../concepts/mergepolicy.md) operations**.
    - Defaults to 2,048 (i.e. 2GB).

> [!WARNING]
> It is rarely recommended to alter a Data Sharding Policy without consulting with the Kusto team first.

When a database is created it is set with the default Data Sharding policy (a policy with the default values mentioned above).
By default, that is inherited by all tables created in the database (unless the policy is explicitly overridden at table-level).

Control commands which allow managing Data Sharding policies for databases and/or tables can be found
[here](../management/sharding-policy.md).