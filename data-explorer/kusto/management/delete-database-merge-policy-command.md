---
title: .delete database merge policy command- Azure Data Explorer
description: Learn how to use the `.delete database merge policy` command to delete a database's merge policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete database merge policy

Delete a database's [merge policy](mergepolicy.md). The merge policy defines if and how [Extents (Data Shards)](../management/extents-overview.md) in the cluster should get merged.

## Syntax

`.delete` `database` *DatabaseName* `policy` `merge`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to delete the merge policy.|

### Example

The following command deletes the merge policy at the database level.

```kusto
.delete database database_name policy merge 
```
