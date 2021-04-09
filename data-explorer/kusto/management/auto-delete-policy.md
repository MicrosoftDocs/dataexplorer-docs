---
title: Auto delete policy - Azure Data Explorer
description: This article describes Auto delete policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 03/02/2021
---
# Auto delete policy

An auto delete policy on a table sets an expiry date for the table. The table will be automatically deleted at this expiry time. Unlike the [retention policy](retentionpolicy.md), which determines when data ([extents](extents-overview.md)) is removed from a table, the auto delete policy drops the entire table.

The auto delete policy can be useful for temporary staging tables. Temporary staging tables are used for data preparation, until the data is moved to its permanent location. We recommend explicitly dropping temporary tables when they're no longer needed. Only use the auto delete policy as a backup mechanism if explicit deletion didn't occur.

> [!TIP]
> If you are working with temporary tables, the following commands may also be useful: [create table based-on](create-table-based-on-command.md) and [replace extents](replace-extents.md).

## The policy object

An auto delete policy includes the following properties:

* **ExpiryDate**:
  * The datetime value indicating when the table should be deleted.
  * The deletion time is imprecise, and could occur few hours after the expiry time.
* **DeleteIfNotEmpty**:
  * A boolean value indicating whether table should be dropped even if there are still [extents](extents-overview.md) in it.
  * Defaults to `false`.

## See also

For more information, see [auto delete policy commands](auto-delete-policy-command.md).
