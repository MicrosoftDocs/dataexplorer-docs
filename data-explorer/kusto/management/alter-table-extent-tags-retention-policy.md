---
title: Alter table extent tags retention policy management - Azure Data Explorer
description: This article describes the alter extent tags retention policy command for tables in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/28/2023
---
# .alter table extent tags retention policy

Alters a table-level extent tags retention policy. For more information, see [extent tags retention policy](extent-tags-retention-policy.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `extent_tags_retention` *SerializedPolicyObject*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *TableName* | string | &check; | The name of the table to alter.|
| *SerializedPolicyObject* | string | &check; | A serialized policy object. See [extent tags retention policy](extent-tags-retention-policy.md).|

## Example

For table T1, set an extent tags retention policy so that any `drop-by` tags that are older than 3 days, and any `ingest-by` tags that are older than two hours will be automatically dropped.

~~~kusto
.alter table T1 policy extent_tags_retention ```[
	{
		"TagPrefix": "drop-by:",
		"RetentionPeriod": "3.00:00:00"
	},
	{
		"TagPrefix": "ingest-by:",
		"RetentionPeriod": "02:00:00"
	}
]```
~~~

## Next steps

- See [.show extents](./show-extents.md)
commands to see the tags associated with an extent.
- See the [extent-tags()](../query/extenttagsfunction.md) 
function to see the tags associated with records.
