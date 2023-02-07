---
title: .show table row order policy command- Azure Data Explorer
description: This article describes the .show table row order policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/04/2021
---
# .show table row order policy

Display a table's [row order policy](roworderpolicy.md). The row order policy is an optional policy set on tables, that suggests the desired ordering of rows in a data shard. The purpose of the policy is to improve performance of queries which are known to be narrowed to a small subset of values in the ordered columns.

## Permissions

This command requires at least Database User, Database Viewer, or Database Monitor permissions on the database containing the table or Table Admin permissions on the specific table. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `roworder` 

## Arguments

*TableName* - Specify the name of the table. 

## Returns

Returns a JSON representation of the policy.

### Example

Delete the row order policy:

```kusto
.show table events policy roworder 
```
