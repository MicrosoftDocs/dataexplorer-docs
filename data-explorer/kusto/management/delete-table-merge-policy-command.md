---
title:  .delete table merge policy command
description: This article describes the .delete table merge policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/24/2023
---
# .delete table merge policy

Delete a table's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `merge`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table for which to delete the merge policy.|

### Example

The following command deletes the merge policy at the table level.

```kusto
.delete table MyTable policy merge 
```
