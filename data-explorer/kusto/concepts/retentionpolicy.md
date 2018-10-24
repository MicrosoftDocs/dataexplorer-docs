---
title: Retention policy - Azure Data Explorer | Microsoft Docs
description: This article describes Retention policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
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
(see **SoftDeletePeriod** and **HardDeletePeriod** below).

[!WARNING]
The retention policy may limit the overall data size (as measured in the storage footprint
of the compressed data, its indexes, etc.) Using this feature is discouraged when applied
at the database level, as size-based data removal is non-deterministic regarding which tables
are chosen to be trimmed.

**Notes:**
	- If the retention policy has time-based and size-based limits, both are taken 
	into account (the first limit that gets exceeded will trigger data removal).

	- The retention process first soft-deletes the data (makes it unavailable for queries
   but doesn't remove it from persistent storage) 
   It then hard-deletes it (removes it from persistent storage without support for data recovery).

	- The deletion time is imprecise. The system guarantees that data will not be
   deleted before the limit is exceeded, but deletion is not immediate following that point.

	- A soft-delete period of 0 can be set as part of a table-level retention policy
   (but not as part of a database-level retention policy).
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

* **HardDeletePeriod**:
    - A time span for which it's guaranteed that the data is kept in persistent storage, measured since the time it was ingested.
    - When not explicitly set, defaults to `SoftDeletePeriod + 7d`.
        - `HardDeletePeriod` cannot be explicitly set to anything under `SoftDeletePeriod + 1h`.
    - `Note:` When altering the hard-delete period of a table or database, the new value applies to new data ingested from that moment on.
    Already existing data will retain the hard-delete period which was set at the time it was ingested.

* **ExtentsDataSizeLimitInBytes**:
    - A total size of extents (in bytes) for which it's guaranteed that the data is kept available to query.
    - The total extents size includes the size of the indexes and the compressed data, for all of the extents in the table/database on which
    the policy is defined.
    - Non-positive values are ignored.
    - Defaults to `0` (and is thus ignored)
    
* **OriginalDataSizeLimitInBytes**:
    - A total size of the original data (in bytes) for which it's guaranteed that the data is kept available to query.
    - Non-positive values are ignored.
    - Defaults to `0` (and is thus ignored)

* **ContainerRecyclingPeriod**: 
    - A time span which determines the period after which extent containers are recycled (their state is changed to "ReadOnly", and new containers 
    with "ReadWrite" state are created instead of them).
    - This value affects an internal storage partitioning process. It's recommended *not* to change it.
    - Defaults to `1 day`.

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
  "SoftDeletePeriod": "36500.00:00:00",
  "HardDeletePeriod": "36507.00:00:00",
  "ContainerRecyclingPeriod": "1.00:00:00",
  "ExtentsDataSizeLimitInBytes": 0,
  "OriginalDataSizeLimitInBytes": 0
}
```
Clearing the retention policy of a database or table can be done using the following command:
```kusto
.delete database DatabaseName policy retention
.delete table TableName policy retention
```

## Examples

Given your cluster has a database named `MyDatabase`, with tables `MyTable1`, `MyTable2` and `MySpecialTable`

**1. Setting all tables in the database to have a soft-delete period of 7 days**:

- *Option 1 (Recommended)*: Set a database-level retention policy with a soft-delete period of 7 days, and verify there are no table-level policies set.
```kusto
.delete table MyTable1 policy retention        // optional, only if the table previously had its policy set
.delete table MyTable2 policy retention        // optional, only if the table previously had its policy set
.delete table MySpecialTable policy retention  // optional, only if the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d
```

- *Option 2*: For each table, set a table-level retention policy with a soft-delete period of 7 days.
```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
.alter-merge table MySpecialTable policy retention softdelete = 7d
```

**2. Setting tables `MyTable1`, `MyTable2` to have a soft-delete period of 7 days, and set `MySpecialTable` to have a soft-delete period of 14 days**:

- *Option 1 (Recommended)*: Set a database-level retention policy with a soft-delete period of 7 days, and set a table-level retention policy with a 
soft-delete period of 14 days for `MySpecialTable`.
```kusto
.delete table MyTable1 policy retention   // optional, only if the table previously had its policy set
.delete table MyTable2 policy retention   // optional, only if the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d
.alter-merge table MySpecialTable policy retention softdelete = 14d
```

- *Option 2*: For each table, set a table-level retention policy with the desired soft-delete period.
```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
.alter-merge table MySpecialTable policy retention softdelete = 14d
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