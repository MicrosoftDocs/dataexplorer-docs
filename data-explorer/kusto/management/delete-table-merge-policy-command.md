---
title: .delete table merge policy command- Azure Data Explorer
description: This article describes the .delete table merge policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .delete table merge policy

Delete a table's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged. 
 
## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `merge` 

### Example

Delete the policy at the table level:

```kusto
.delete table MyTable policy merge 
```
