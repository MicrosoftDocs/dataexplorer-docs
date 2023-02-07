---
title: .show table merge policy command- Azure Data Explorer
description: This article describes the .show table merge policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/29/2021
---
# .show table merge policy

Display a table's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 

## Permissions

This command requires at least Database User, Database Viewer, or Database Monitor permissions on the database containing the table or Table Admin permissions on the specific table. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `merge` 

## Arguments

*TableName* - Specify the name of the table. 

## Returns

Returns a JSON representation of the policy.

### Example

Display the policy at the table level:

```kusto
.show table database_name policy merge 
```
