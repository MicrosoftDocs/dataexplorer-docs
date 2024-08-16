---
title: Row order policy
description: Learn how to use the row order policy to order rows in an extent.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/24/2023
---
# Row order policy

The row order policy sets the preferred arrangement of rows within an [extent](extents-overview.md). The policy is optional and set at the table level.

The main purpose of the policy is to improve the performance of queries that are narrowed to a small subset of values in ordered columns. Additionally, it may contribute to improvements in compression.

Use management commands to [alter](alter-table-row-order-policy-command.md), [alter-merge](alter-merge-table-row-order-policy-command.md) [delete](delete-table-row-order-policy-command.md), or [show](show-table-row-order-policy-command.md) the row order policy for a table. 

> [!NOTE]
> Once the policy is set, it will affect data ingested from that point onward.

## When to set the policy

It's appropriate to set the policy under the following conditions:

* Most queries filter on specific values of a certain large-dimension column, such as an "application ID" or a "tenant ID"
* The data ingested into the table is unlikely to be preordered according to this column

## Performance considerations

There are no hardcoded limits set on the amount of columns, or sort keys, that can be defined as part of the policy. However, every additional column adds some overhead to the ingestion process, and as more columns are added, the effective return diminishes.
