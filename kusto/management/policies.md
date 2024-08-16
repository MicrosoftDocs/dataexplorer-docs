---
title: Policies overview
description: Learn which policies are available for management.
ms.topic: reference
ms.date: 08/11/2024
---
# Policies overview

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The following table provides an overview of the policies for managing your environment:

|Policy|Description|
|--|--|
|[Auto delete policy](auto-delete-policy.md)|Sets an expiry date for the table. The table is automatically deleted at this expiry time.|
|[Cache policy](cache-policy.md)|Defines how to prioritize resources. Allows customers to differentiate between hot data cache and cold data cache.|
|[Callout policy](callout-policy.md)|Manages the authorized domains for external calls.|
|[Capacity policy](capacity-policy.md)|Controls the compute resources of data management operations.|
|[Encoding policy](encoding-policy.md)|Defines how data is encoded, compressed, and indexed.|
|[Extent tags retention policy](extent-tags-retention-policy.md)|Controls the mechanism that automatically removes extent tags from tables.|
|[Ingestion batching policy](batching-policy.md)|Groups multiple data ingestion requests into batches for more efficient processing.|
|[Ingestion time policy](ingestion-time-policy.md)|Adds a hidden datetime column to the table that records the time of ingestion.|
|[ManagedIdentity policy](managed-identity-policy.md)|Controls which managed identities can be used for what purposes.|
|[Merge policy](merge-policy.md)|Defines rules for merging data from different extents into a single extent.|
|[Mirroring policy](mirroring-policy.md) | Allows you to manage your mirroring policy and mirroring policy operations.|
|[Partitioning policy](partitioning-policy.md)|Defines rules for partitioning extents for a specific table or a materialized view.|
|[Retention policy](retention-policy.md)|Controls the mechanism that automatically removes data from tables or materialized views.|
|[Restricted view access policy](restricted-view-access-policy.md)|Adds an extra layer of permission requirements for principals to access and view the table.|
|[Row level security policy](row-level-security-policy.md)|Defines rules for access to rows in a table based on group membership or execution context.|
|[Row order policy](row-order-policy.md)|Maintains a specific order for rows within an extent.|
|[Sandbox policy](sandbox-policy.md)|Controls the usage and behavior of sandboxes, which are isolated environments for query execution.|
|[Sharding policy](sharding-policy.md)|Defines rules for how extents are created.|
|[Streaming ingestion policy](streaming-ingestion-policy.md)|Configurations for streaming data ingestion.|
|[Update policy](update-policy.md)|Allows for data to be appended to a target table upon adding data to a source table.|
|[Query weak consistency policy](query-weak-consistency-policy.md)|Controls the level of consistency for query results.|
