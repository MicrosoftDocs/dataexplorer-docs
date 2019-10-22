---
title: Retention policy - Azure Data Explorer | Microsoft Docs
description: This article describes Retention policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/12/2019
---
# Retention policy

The retention policy controls the mechanism by which data is removed from tables automatically.
Such removal is usually useful for data that flows into a table continuously whose relevance
is age-based. For example, the retention policy can be used for a table that holds diagnostics
events that may become uninteresing after two weeks.

The retention policy can be configured for a specific table or for a whole database
(in which case it applies to all tables in the database that don't override the policy).

Setting up a retention policy is important for clusters that are continuously ingesting
data, which will limit costs.

Data that is "outside" the retention policy is eligible for removal. Kusto does not
guarantee when removal occurs (so data may "linger" even if the retention policy has been triggered).

The retention policy is most commonly set to limit the age of the data since ingestion
(see **SoftDeletePeriod** below).

**Notes:**
- The deletion time is imprecise. The system guarantees that data will not be
deleted before the limit is exceeded, but deletion is not immediate following that point.
- A soft-delete period of 0 can be set as part of a table-level retention policy (but not as part of a database-level retention policy).
	- When this is done, the ingested data will not be committed to the source table, 
	avoiding the need to persist the data.
	- Such configuration is useful mainly when the data gets ingested into a table.
	A transactional [update policy](updatepolicy.md) is used to transform 
	it and redirect the output into another table.

## The policy object
A retention policy includes the following properties:

* **SoftDeletePeriod**:
    - A time span for which it's guaranteed that the data is kept available to query, measured since the time it was ingested.
    - Defaults to `100 years`.
    - `Note:` When altering the soft-delete period of a table or database, the new value applies to both existing and new data.
* **Recoverability**:
    - Data recoverability (enabled / disabled) after the data was deleted
    - Defaults to `enabled`
    - If set to `enabled`, the data will be recoverable for 14 days after the deletion

## Control commands
* Use [.show policy retention](../management/retention-policy.md) to show current retention
policy for a database or a table.
* Use [.alter policy retention](../management/retention-policy.md) to change current 
retention policy of a database or a table.

## Defaults
By default, when a database or a table is created, it doesn't have a retention policy defined.
In common cases, the database is created and then immediately has its retention policy set by its creator according to known requirements.
When running a [show command](../management/retention-policy.md) for the retention policy of a database or table 
which hasn't had its policy set, `Policy` appears as `null`.

The default retention policy (with the default values mentioned above) can be applied using the following command:
```kusto
.alter database DatabaseName policy retention "{}"
.alter table TableName policy retention "{}"
```
These result with the following policy object applied to the database or table:
```kusto
{
  "SoftDeletePeriod": "36500.00:00:00", "Recoverability":"Enabled"
}
```
Clearing the retention policy of a database or table can be done using the following command:
```kusto
.delete database DatabaseName policy retention
.delete table TableName policy retention
```

## Examples

Given your cluster has a database named `MyDatabase`, with tables `MyTable1`, `MyTable2` and `MySpecialTable`

**1. Setting all tables in the database to have a soft-delete period of 7 days and disabled recoverability**:

- *Option 1 (Recommended)*: Set a database-level retention policy with a soft-delete period of 7 days and recoverability disabled, and verify there are no table-level policies set.
```kusto
.delete table MyTable1 policy retention        // optional, only if the table previously had its policy set
.delete table MyTable2 policy retention        // optional, only if the table previously had its policy set
.delete table MySpecialTable policy retention  // optional, only if the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d recoverability = disabled
```

- *Option 2*: For each table, set a table-level retention policy with a soft-delete period of 7 days and recoverability disabled.
```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d recoverability = disabled
.alter-merge table MyTable2 policy retention softdelete = 7d recoverability = disabled
.alter-merge table MySpecialTable policy retention softdelete = 7d recoverability = disabled
```

**2. Setting tables `MyTable1`, `MyTable2` to have a soft-delete period of 7 days and recoverability enabled, and set `MySpecialTable` to have a soft-delete period of 14 days and recoverability disabled**:

- *Option 1 (Recommended)*: Set a database-level retention policy with a soft-delete period of 7 days and recoverability enabled, and set a table-level retention policy with a 
soft-delete period of 14 days and recoverability disabled for `MySpecialTable`.
```kusto
.delete table MyTable1 policy retention   // optional, only if the table previously had its policy set
.delete table MyTable2 policy retention   // optional, only if the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d recoverability = disabled
.alter-merge table MySpecialTable policy retention softdelete = 14d recoverability = enabled
```

- *Option 2*: For each table, set a table-level retention policy with the desired soft-delete period and recoverability.
```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d recoverability = disabled
.alter-merge table MyTable2 policy retention softdelete = 7d recoverability = disabled
.alter-merge table MySpecialTable policy retention softdelete = 14d recoverability = enabled
```

**3. Setting tables `MyTable1`, `MyTable2` to have a soft-delete period of 7 days, and have `MySpecialTable` keep its data indefinitely**:

- *Option 1*: Set a database-level retention policy with a soft-delete period of 7 days, and set a table-level retention policy with a 
soft-delete period of 100 years (the default retention policy) for `MySpecialTable`.
```kusto
.delete table MyTable1 policy retention   // optional, only if the table previously had its policy set
.delete table MyTable2 policy retention   // optional, only if the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d
.alter table MySpecialTable policy retention "{}" // this sets the default retention policy
```

- *Option 2*: For tables `MyTable1`, `MyTable2`, set a table-level retention policy with the desired soft-delete period of 7 days, and verify the 
database-level and table-level policy for `MySpecialTable` aren't set.
```kusto
.delete database MyDatabase policy retention   // optional, only if the database previously had its policy set
.delete table MySpecialTable policy retention   // optional, only if the table previously had its policy set
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
```

- *Option 3*: For tables `MyTable1`, `MyTable2`, set a table-level retention policy with the desired soft-delete period of 7 days. For table 
`MySpecialTable` set a table-level retention policy with a soft-delete period of 100 years (the default retention policy).
```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
.alter table MySpecialTable policy retention "{}"
```