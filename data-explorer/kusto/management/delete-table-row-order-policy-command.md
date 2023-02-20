---
title: .delete table row order policy command- Azure Data Explorer
description: This article describes the .delete table row order policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/04/2021
---
# .delete table row order policy

Remove a table's [row order policy](roworderpolicy.md). The row order policy is an optional policy set on tables, that suggests the desired ordering of rows in a data shard. The purpose of the policy is to improve performance of queries which are known to be narrowed to a small subset of values in the ordered columns.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `roworder` 

## Arguments

*TableName* - Specify the name of the table.  

### Example

```kusto
.delete table events policy roworder 
```
