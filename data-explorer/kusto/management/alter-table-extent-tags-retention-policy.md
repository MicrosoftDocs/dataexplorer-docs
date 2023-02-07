---
title: Alter table extent tags retention policy management - Azure Data Explorer
description: This article describes the alter extent tags retention policy command for tables in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 01/05/2022
---
# .alter table extent tags retention policy

Alters a table-level extent tags retention policy. For more information, see [extent tags retention policy](extent-tags-retention-policy.md).

## Permissions

This command requires at least [Table Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter` `table` *TableName* `policy` `extent_tags_retention` *SerializedPolicyObject* 

## Arguments

- *TableName* - Specify the name of the table.
- *SerializedPolicyObject* - Define a serialized policy object.

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
