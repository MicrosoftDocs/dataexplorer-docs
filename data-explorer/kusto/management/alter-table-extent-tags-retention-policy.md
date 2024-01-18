---
title:  .alter table policy extent_tags_retention command
description: Learn how to use the `.alter table policy extent_tags_retention` command to alter the table's extent tag retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/04/2023
---
# .alter table policy extent_tags_retention command

Alters the table's extent tags retention policy. For more information, see [extent tags retention policy](extent-tags-retention-policy.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `extent_tags_retention` *SerializedPolicyObject*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *TableName* | string |  :heavy_check_mark: | The name of the table to alter.|
| *SerializedPolicyObject* | string |  :heavy_check_mark: | A serialized policy object. See [extent tags retention policy](extent-tags-retention-policy.md).|

## Example

The following command sets an extent tags retention policy for table T1. The policy causes any `drop-by` tags that are older than three days and any `ingest-by` tags that are older than two hours to be automatically dropped.

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

## Related content

- See [.show extents](./show-extents.md)
commands to see the tags associated with an extent.
- See the [extent-tags()](../query/extent-tags-function.md) 
function to see the tags associated with records.
