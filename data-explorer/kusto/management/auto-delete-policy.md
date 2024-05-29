---
title: Auto delete policy
description: Learn about the auto delete policy to set an expiry date for the table.
ms.reviewer: yifats
ms.topic: reference
ms.date: 05/24/2023
---
# Auto delete policy

An auto delete policy on a table sets an expiry date for the table. The table is automatically deleted at this expiry time. Unlike the [retention policy](retention-policy.md), which determines when data ([extents](extents-overview.md)) are removed from a table, the auto delete policy drops the entire table.

The auto delete policy can be useful for temporary staging tables. Temporary staging tables are used for data preparation, until the data is moved to its permanent location. We recommend explicitly dropping temporary tables when they're no longer needed. Only use the auto delete policy as a fallback mechanism in case the explicit deletion doesn't occur.

> [!TIP]
> If you're working with temporary tables, the following commands may also be useful: [create table based-on](create-table-based-on-command.md) and [replace extents](replace-extents.md).

## Policy object

An auto delete policy includes the following properties:

* **ExpiryDate**:
  * Date and time value indicating when the table should be deleted.
  * The deletion time is imprecise, and could occur few hours later than the time specified in the ExpiryDate property.
  * The value specified can't be null and it must be greater than current time.

* **DeleteIfNotEmpty**:
  * Boolean value indicating whether table should be dropped even if there are still [extents](extents-overview.md) in it.
  * Defaults to `false`.

## Related content

For more information, see [auto delete policy](./show-auto-delete-policy-command.md) commands.
