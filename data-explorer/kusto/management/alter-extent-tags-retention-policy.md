---
title: Alter extent tags retention policy management - Azure Data Explorer
description: This article describes the alter extent tags retention policy command for databases in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 01/05/2022
---
# .alter database extent tags data ase retention policy

Alters a database-level extent tags retention policy. For more information, see [extent tags retention policy](extent-tags-retention-policy.md).

## Syntax

.alter database *DatabaseName* policy extent_tags_retention *SerializedPolicyObject*

## Arguments

*DatabaseName* - Specify the name of the database.
*SerializedPolicyObject* - Define a serialized policy object.

## Example

For database D1, set an extent tags retention policy so that any `drop-by` tags that are older than 3 days, and any `ingest-by` tags that are older than two hours will be automatically dropped.

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
