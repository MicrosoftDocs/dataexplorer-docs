---
title: Row order policy - Azure Data Explorer | Microsoft Docs
description: This article describes Row order policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/06/2019
---
# Row order policy

The row order policy is an optional policy set on tables, that provides a "hint" to Kusto
on the desired ordering of rows in a data shard.

The main purpose of the policy is not to improve compression (although it is a potential
side-effect), but to improve performance of queries which are known to be narrowed to a
small subset of values in the ordered columns.

Applying the policy is appropriate when:
* The majority of queries filter on specific values of a specific large-dimension column 
  (such as an "application ID" or a "tenant ID")
* The data ingested into the table is unlikely to be pre-ordered according to this column.

While there are no hardcoded limits set on the amount of columns (sort keys) that can be
defined as part of the policy, every additional column adds some overhead to the ingestion
process, and as more columns are added - the effective return diminishes.

> [!NOTE]
> Once the policy is applied to a table, it will affect data ingested from that moment on.

Control commands for managing Row Order policies can be found [here](../management/roworder-policy.md)