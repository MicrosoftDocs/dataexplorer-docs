---
title: Alter extent tags retention policy management - Azure Data Explorer
description: This article describes the alter extent tags retention policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 07/08/2021
---
# .alter extent tags retention policy

Alters a table-level or database-level extent tags retention policy. For more information, see [extent tags retention policy](extent-tags-retention-policy.md).

## Syntax

```kusto
.alter table table_name policy extent_tags_retention ```<serialized policy>```

.alter database database_name policy extent_tags_retention ```<serialized policy>```
```

## Example

For table T1, set an extent tags retention policy so that any `drop-by` tags that are older than a week ago, and any `ingest-by` tags that are older than a day ago will be automatically dropped.

```kusto
.alter table T1 policy extent_tags_retention ```[
	{
		"TagPrefix": "drop-by:",
		"RetentionPeriod": "7.00:00:00"
	},
	{
		"TagPrefix": "ingest-by:",
		"RetentionPeriod": "1.00:00:00"
	}
]
```
