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

An auto delete policy can be set on a table in order to set an expiry date for the table. The table will be automatically deleted when its expiry time arrives. Unlike [retention policy](retentionpolicy.md), which determines when data ([extents](extents-overview.md)) is removed from a table, the auto delete policy drops the entire table when it expires.

The policy can be useful for temporary staging tables, which are used for data preparation, until the data is moved to its permanent location. It is recommended to explicitly drop temporary tables when they are no longer needed, and to only use the auto delete policy as a backup mechanism (in case explicit deletion did not take place).

> [!TIP]
> If you are dealing with temporary tables, you might find the [create table based-on](create-table-based-on-command.md) and [replace extents](replace-extents.md) commands useful as well.

## The policy object

An auto delete policy includes the following properties:

* **ExpiryDate**:
  * The datetime value indicating when the table should be deleted.
  * The deletion time is imprecise, and could occur few hours after the expiry time.
* **DeleteIfNotEmpty**:
  * A boolean value indicating whether table should be dropped even if there are still [extents](extents-overview.md) in it.
  * Defaults to `false`.

For more information, see [auto delete policy commands](autodelete-policy.md).
