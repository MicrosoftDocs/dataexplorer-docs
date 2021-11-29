---
title: ".alter table row order policy command- Azure Data Explorer"
description: "This article describes the .alter table row order policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2021
---
# .alter table row order policy

Change a table's [row order policy](roworderpolicy.md). The row order policy is an optional policy for tables that defines the row order in a data shard. This policy is designed to improve performance for queries that are known to relate to a small subset of values that can be more rapidly located in ordered columns.

## Syntax

`.alter` `table` *TableName* `policy` `roworder` *PolicyObjects*

## Arguments

- *TableName* - Specify the name of the table.  
- *PolicyObjects* - Define one or more policy objects.

### Examples

Set the row order policy for one table:

```kusto
.alter table events policy roworder (TenantId asc, Timestamp desc)
```

Set the row order policy for several tables:

```kusto
.alter tables (events1, events2, events3) policy roworder (TenantId asc, Timestamp desc)
```
