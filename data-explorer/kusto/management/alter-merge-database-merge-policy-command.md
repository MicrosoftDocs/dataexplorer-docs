---
title: .alter-merge database merge policy command- Azure Data Explorer
description: This article describes the .alter-merge database merge policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/19/2023
---
# .alter-merge database merge policy

Use this command to change a database's [merge policy](mergepolicy.md). The merge policy defines if and how [extents (data shards)](../management/extents-overview.md) in the cluster should get merged.

## Syntax

`.alter-merge` `database` *DatabaseName* `policy` `merge` *ArrayOfPolicyObjects*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to alter the merge policy.|
|*ArrayOfPolicyObjects*|string|&check;|A serialized array of one or more JSON policy objects. For more information, see [merge policy](mergepolicy.md).|

### Example

Change a single property of the policy at database level, retaining all other properties as before:

```kusto
.alter-merge database database_name policy merge ```
{
    "MaxRangeInHours": 24
}```
```
