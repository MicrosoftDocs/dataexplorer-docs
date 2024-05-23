---
title:  .alter database policy extent_tags_retention command
description: Learn how to use the `.alter database policy extent_tags_retention` command to change the database-level extent tags retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/20/2023
---
# .alter database policy extent_tags_retention command

Alters the database-level extent tags retention policy. For more information, see [extent tags retention policy](extent-tags-retention-policy.md).

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `database` *DatabaseName* `policy extent_tags_retention` *SerializedArrayOfPolicyObjects*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database for which to alter the extent tags retention policy.|
|*SerializedArrayOfPolicyObjects*| `string` | :heavy_check_mark:|A serialized array of policy objects. For more information, see the [extent tags retention policy](extent-tags-retention-policy.md).|

## Example

The following command sets an extent tags retention policy for database D1. The policy causes any `drop-by` tags that are older than three days and any `ingest-by` tags that are older than two hours to be automatically dropped.

```kusto
.alter database D1 policy extent_tags_retention ```[
	{
		"TagPrefix": "drop-by:",
		"RetentionPeriod": "3.00:00:00"
	},
	{
		"TagPrefix": "ingest-by:",
		"RetentionPeriod": "02:00:00"
	}
]```
```
