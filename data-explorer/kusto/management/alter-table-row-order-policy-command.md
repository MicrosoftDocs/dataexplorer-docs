---
title: .alter table row order policy command- Azure Data Explorer
description: This article describes the .alter table row order policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/29/2021
---
# .alter table row order policy

Change a table's [row order policy](roworderpolicy.md). The row order policy is an optional policy set on tables, that suggests the desired ordering of rows in a data shard. The purpose of the policy is to improve performance of queries which are known to be narrowed to a small subset of values in the ordered columns.

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
