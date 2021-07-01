---
title: Kusto extent tags retention policy management - Azure Data Explorer
description: This article describes extent tags retention policy management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 07/01/2021
---
# Extent tags retention policy commands

This article describes control commands used for creating and altering [extent tags retention policy](extenttagsretentionpolicy.md).

## Show extent tags retention policy

Shows a table-level or database-level extent tags retention policy

```kusto
.show table table_name policy extent_tags_retention

.show database database_name policy extent_tags_retention
```

**Example**

Show the extent tags retention policy for the database named `MyDatabase`:

```kusto
.show database MyDatabase policy extent_tags_retention
```

## Delete extent tags retention policy

Deletes a table-level or database-level extent tags retention policy.

```kusto
.delete table table_name policy extent_tags_retention

.delete database database_name policy extent_tags_retention
```

**Example**

Delete the extent tags retention policy for the table named `MyTable`:

```kusto
.delete table MyTable policy extent_tags_retention
```


## Alter extent tags retention policy

```kusto
.alter table table_name policy extent_tags_retention ```<serialized policy>```

.alter database database_name policy extent_tags_retention ```<serialized policy>```
```

**Example**

For table T1, set a policy to retain `drop-by:` tags that are newer than a week ago, and `ingest-by:` tags that are newer than a day ago.
Any `drop-by` tags that are older than a week ago, and any `ingest-by` tags that are older than a day ago will be automatically dropped.

```kusto
.alter table T1 policy retention ```[
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
