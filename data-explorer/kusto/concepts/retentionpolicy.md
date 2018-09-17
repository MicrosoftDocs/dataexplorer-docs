---
title: Retention policy - Azure Kusto | Microsoft Docs
description: This article describes Retention policy in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Retention policy

Each Kusto table and/or database can have an optional retention policy defined for it, specifying how data should be dropped based on considerations of size and/or time.

## The policy object
A retention policy includes the following properties:

* **SoftDeletePeriod**:
    - A time span for which it's guaranteed that the data is kept available to query, measured since the time it was ingested.
    - Defaults to `100 years`.
    - `Note:` When altering a table's or a database's soft-delete period, the new value applies to both existing and new data.

* **HardDeletePeriod**:
    - A time span for which it's guaranteed that the data is kept in persistent storage, measured since the time it was ingested.
    - When not explicitly set, defaults to `SoftDeletePeriod + 7d`.
        - `HardDeletePeriod` cannot be explicitly set to anything under `SoftDeletePeriod + 1h`.
    - `Note:` When altering a table's or a database's hard-delete period, the new value applies to new data, ingested from that moment on.
    Already existing data will keep the hard-delete period which was set at the time it was ingested.

* **ExtentsDataSizeLimitInBytes**:
    - A total size of extents (in bytes) for which it's guaranteed that the data is kept available to query.
    - The total extents size includes the sizes of the indexes and the compressed data, for all of the extents in the table/database on which
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
    - This value affects an internal storage partitioning process, and it's recommended *not* to change it.
    - Defaults to `1 day`.

**Notes:**
1. In case a retention policy specifies both time-based and size-based soft-delete criterias, whichever is reached first applies.

2. Data that is soft-deleted is still kept in persistent storage (for example, for legal reasons) but is not available
for queries (in fact, it's invisible to Kusto). Data that is hard-deleted is removed from persistent storage and there's 
no way to restore it.

3. Actual deletion time (either soft-deletion and hard-deletion) is imprecise - Kusto guarantees that data will not be deleted before 
the prescribed time, but it can take the cluster some time before it actually deletes the data past its deletion time.

4. Tables for which there's no retention policy set inherit the database's retention policy, if such is defined.

5. A soft-delete period of 0 can be set as part of a table-level policy (but not as part of a database-level policy).
    - This could be beneficial in case that a transactional [update policy](updatepolicy.md) is being used to transform incoming data at 
ingestion time, and redirect the output it into a different table.
    - Using this option will prevent ingested data from being committed to the source table and from being persisted as part of the ingesteion 
operation. As a result, it will contribute to overall better performance of the operation.


## Control commands
* Use [.show policy retention](../management/retention-policy.md) to show current retention
policy for a database or a table.
* Use [.alter policy retention](../management/retention-policy.md) to change current 
retention policy of a database or a table.

## Defaults
By default, when a database or a table is created, it doesn't have a retention policy defined.
In common cases, the database is created and then immediately has its retention policy set by its creator according to known requirements.
When running a [show command](../management/retention-policy.md) for a database's or a table's retention policy, 
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
Clearing the retention policy of a database or a table can be done using the following command:
```kusto
.delete database DatabaseName policy retention
.delete table TableName policy retention
```

## Examples

Given your cluster has a database named `MyDatabase`, with tables `MyTable1`, `MyTable2` and `MySpecialTable`

**1. Setting all tables in the database to have a Soft-Delete period of 7 days**:

- *Option 1 (Recommended)*: Set a database-level retention policy with a Soft-Delete period of 7 days, and verify there are no table-level policies set.
```kusto
.delete table MyTable1 policy retention        // optional, only in case the table previously had its policy set
.delete table MyTable2 policy retention        // optional, only in case the table previously had its policy set
.delete table MySpecialTable policy retention  // optional, only in case the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d
```

- *Option 2*: For each table, set a table-level retention policy with a Soft-Delete period of 7 days.
```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
.alter-merge table MySpecialTable policy retention softdelete = 7d
```

**2. Setting tables `MyTable1`, `MyTable2` to have a Soft-Delete period of 7 days, and set `MySpecialTable` to have a Soft-Delete period of 14 days**:

- *Option 1 (Recommended)*: Set a database-level retention policy with a Soft-Delete period of 7 days, and set a table-level retention policy with a 
Soft-Delete period of 14 days for `MySpecialTable`.
```kusto
.delete table MyTable1 policy retention   // optional, only in case the table previously had its policy set
.delete table MyTable2 policy retention   // optional, only in case the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d
.alter-merge table MySpecialTable policy retention softdelete = 14d
```

- *Option 2*: For each table, set a table-level retention policy with the desired Soft-Delete period.
```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
.alter-merge table MySpecialTable policy retention softdelete = 14d
```

**3. Setting tables `MyTable1`, `MyTable2` to have a Soft-Delete period of 7 days, and have `MySpecialTable` keep its data indefinitely**:

- *Option 1*: Set a database-level retention policy with a Soft-Delete period of 7 days, and set a table-level retention policy with a 
Soft-Delete period of 100 years (the default retention policy) for `MySpecialTable`.
```kusto
.delete table MyTable1 policy retention   // optional, only in case the table previously had its policy set
.delete table MyTable2 policy retention   // optional, only in case the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d
.alter table MySpecialTable policy retention "{}" // this sets the default retention policy
```

- *Option 2*: For tables `MyTable1`, `MyTable2`, set a table-level retention policy with the desired Soft-Delete period of 7 days, and verify the 
database-level policy and the table-level policy for `MySpecialTable` aren't set.
```kusto
.delete database MyDatabase policy retention   // optional, only in case the database previously had its policy set
.delete table MySpecialTable policy retention   // optional, only in case the table previously had its policy set
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
```

- *Option 3*: For tables `MyTable1`, `MyTable2`, set a table-level retention policy with the desired Soft-Delete period of 7 days, for table 
`MySpecialTable` set a table-level retention policy with a Soft-Delete period of 100 years (the default retention policy).
```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
.alter table MySpecialTable policy retention "{}"
```