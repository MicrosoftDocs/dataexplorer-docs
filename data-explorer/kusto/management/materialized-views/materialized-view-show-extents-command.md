---
title:  .show materialized-view extents commands
description: This article describes show materialize-view extents commands in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---

# .show materialized-view extents

Returns the extents in the *materialized part* of the materialized view. For a definition of the *materialized part*, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work).

If `hot` is specified, only shows the extents that are expected to be in the hot cache.

This command provides the same details as the [show table extents](../show-extents.md#table-scope) command.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName* `extents` [`hot`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | string | &check;  | Name of the materialized view. |

### Returns

[!INCLUDE [show-extents-output-schema.md](../../../includes/show-extents-output-schema.md)]

## Examples

### Show extents from materialized part of one materialized view

The following command shows the extents holding the data in the materialized part of materialized view ViewName, regardless of whether those extents are in hot cache or not:

```kusto
.show materialized-view ViewName extents
```

**Output:**

| ExtentId                              | DatabaseName | TableName  | MaxCreatedOn                 | OriginalSize | ExtentSize | CompressedSize | IndexSize | Blocks | Segments | ReservedSlot1 | ReservedSlot2 | ExtentContainerId | RowCount | MinCreatedOn                 | Tags | Kind      | ReservedSlot3 | DeletedRowCount |
|---------------------------------------|--------------|------------|------------------------------|--------------|------------|----------------|-----------|--------|----------|---------------|---------------|-------------------|----------|------------------------------|------|-----------|---------------|-----------------|
| 17a05fa6-9ec4-45f6-991f-28075a09c9f9  | MyDatabase   | ViewName   | 2023-03-01T09:37:05.4447625Z |       116458 |    1080900 |         388865 |    153527 |        |          |               |               |                   |     2876 | 2023-03-01T09:36:05.4536225Z |      | StorageV3 |               |               0 |
| 65ac5fa6-c434-56a6-65bf-07b575d09ff9  | MyDatabase   | ViewName   | 2023-03-01T09:48:05.5547625Z |       127458 |    1200900 |         407865 |    183539 |        |          |               |               |                   |     3000 | 2023-03-01T09:48:05.5547625Z |      | StorageV3 |               |               0 |

### Show extents in hot cache from materialized part of one materialized view

The following command shows the extents holding the data in the materialized part of materialized view ViewName, but only those which are expected to be in hot cache:

```kusto
.show materialized-view ViewName extents hot
```

**Output:**

| ExtentId                              | DatabaseName | TableName  | MaxCreatedOn                 | OriginalSize | ExtentSize | CompressedSize | IndexSize | Blocks | Segments | ReservedSlot1 | ReservedSlot2 | ExtentContainerId | RowCount | MinCreatedOn                 | Tags | Kind      | ReservedSlot3 | DeletedRowCount |
|---------------------------------------|--------------|------------|------------------------------|--------------|------------|----------------|-----------|--------|----------|---------------|---------------|-------------------|----------|------------------------------|------|-----------|---------------|-----------------|
| 65ac5fa6-c434-56a6-65bf-07b575d09ff9  | MyDatabase   | ViewName   | 2023-03-01T09:48:05.5547625Z |       127458 |    1200900 |         407865 |    183539 |        |          |               |               |                   |     3000 | 2023-03-01T09:48:05.5547625Z |      | StorageV3 |               |               0 |
