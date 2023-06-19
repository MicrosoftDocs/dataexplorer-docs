---
title: Row order policy
description: Learn how to use the row order policy to order rows in a data shard.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# Row order policy

The row order policy is an optional policy set on tables that provides a "hint" to Kusto
on the desired ordering of rows in a data shard.

The main purpose of the policy isn't to improve compression (although it's a potential
side-effect), but to improve performance of queries that are known to be narrowed to a
small subset of values in the ordered columns.

Applying the policy is appropriate in the following scenarios:

* Most queries filter on specific values of a specific large-dimension column
  (such as an "application ID" or a "tenant ID")
* The data ingested into the table is unlikely to be preordered according to this column.

> [!NOTE]
>
> * Once the policy is set on a table, it will affect data ingested from that moment on.
> * While there are no hardcoded limits set on the amount of columns (sort keys) that can be
defined as part of the policy, every additional column adds some overhead to the ingestion
process, and as more columns are added - the effective return diminishes.
> * In the scenarios mentioned above, it is recommended to set up to 2 sort keys in the policy.

Management commands for managing Row Order policies can be found [here](./show-table-row-order-policy-command.md)