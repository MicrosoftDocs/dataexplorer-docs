---
title: .merge extents - Azure Data Explorer
description: This article describes Extents (data shards) management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 07/02/2020
---

# .merge extents

This command merges the extents indicated by their IDs in the specified table. 

> [!NOTE]
> For more information on extents, see [Extents (Data Shards) Overview](extents-overview.md).

## Syntax

`.merge` `[async | dryrun]` *TableName* `(` *GUID1* [`,` *GUID2* ...] `)` `[with(rebuild=true)]`

There are two types of merge operations:
* *Merge* that rebuilds indexes
* *Rebuild* that completely reingests the data

There are three options available:
* `async`: Execute the command asynchronously. 
    * An Operation ID (Guid) is returned.
    * The operation's status can be monitored. Use the Operation ID with the `.show operations <operation ID>` command.
* `dryrun`: The operation will only list the extents that should be merged, but won't actually merge them.
* `with(rebuild=true)`: The extents will be rebuilt and the data reingested instead of merged. The indexes will be rebuilt.

## Return output

Output parameter |Type |Description
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent in the source table, which has been merged into the target extent.
ResultExtentId |string |A unique identifier (GUID) for the extent that was created from the source extents. Upon failure - "Failed" or "Abandoned".
Duration |timespan |The time period it took to complete the merge operation.

## Examples

Rebuild two specific extents in `MyTable`, asynchronously.

```kusto
.merge async MyTable (e133f050-a1e2-4dad-8552-1f5cf47cab69, 0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687) with(rebuild=true)
```

Merge two specific extents in `MyTable`, synchronously.

```kusto
.merge MyTable (12345050-a1e2-4dad-8552-1f5cf47cab69, 98765b2d-9dd2-4d2c-a45e-b24c65aa6687)
```

## Notes

* In General, `.merge` commands should rarely be manually run. The commands are continuously and automatically run in the background of the Kusto cluster, according to the [Merge Policies](mergepolicy.md) for tables and databases.  
  * For more information on the criteria for merging multiple extents into a single one, see [Merge Policy](mergepolicy.md).
* `.merge` operations have a possible final state of `Abandoned`, which can be seen when running `.show operations` with the operation ID. This state suggests the source extents weren't merged, since some of the source extents no longer exist in the source table.
   Such a state is expected to occur when:
   * The source extents have been dropped as part of the table's retention.
   * The source extents have been moved to a different table.
   * The source table has been entirely dropped or renamed.
