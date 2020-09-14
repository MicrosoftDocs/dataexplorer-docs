---
title: Kusto retention policy controls how data is removed - Azure Data Explorer
description: This article describes Retention policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/19/2020
---
# Retention policy

The retention policy controls the mechanism that automatically removes data from tables. It's useful to remove data that continuously flows into a table, and whose relevance is age-based. For example, the policy can be used for a table that holds diagnostics events that may become uninteresting after two weeks.

The retention policy can be configured for a specific table or for an entire database.
The policy then applies to all tables in the database that don't override it.

Setting up a retention policy is important for clusters that are continuously ingesting
data, which will limit costs.

Data that is "outside" the retention policy is eligible for removal. Kusto doesn't
guarantee when removal occurs. Data may "linger" even if the retention policy is triggered.

The retention policy is most commonly set to limit the age of the data since ingestion.
For more information, see [SoftDeletePeriod](#the-policy-object).

> [!NOTE]
> * The deletion time is imprecise. The system guarantees that data won't be
deleted before the limit is exceeded, but deletion isn't immediate following that point.
> * A soft-delete period of 0 can be set as part of a table-level retention policy, but not as part of a database-level retention policy.
>	* When this is done, the ingested data won't be committed to the source table, avoiding the need to persist the data. As a result, `Recoverability` can only be set to `Disabled`.
>	* Such a configuration is useful mainly when the data gets ingested into a table.
> A transactional [update policy](updatepolicy.md) is used to transform it and redirect the output into another table.

## The policy object

A retention policy includes the following properties:

* **SoftDeletePeriod**:
    * Time span for which it's guaranteed that the data is kept available to query. The period is measured starting from the time the data was ingested.
    * Defaults to `100 years`.
    * When altering the soft-delete period of a table or database, the new value applies to both existing and new data.
* **Recoverability**:
    * Data recoverability (Enabled/Disabled) after the data was deleted.
    * Defaults to `Enabled`.
    * If set to `Enabled`, the data will be recoverable for 14 days after it's been soft-deleted.

## Control commands

* Use [.show policy retention](../management/retention-policy.md) to show the current retention policy for a database, table, or [materialized view (preview)](materialized-views/materialized-view-overview.md).
* Use [.alter policy retention](../management/retention-policy.md) to change current retention policy of a database, table, or [materialized view (preview)](materialized-views/materialized-view-overview.md)..

## Defaults

By default, when a database or a table is created, it doesn't have a retention policy defined. Normally, the database is created and then immediately has its retention policy set by its creator according to known requirements.
When you run a [show command](../management/retention-policy.md) for the retention policy of a database or table that hasn't had its policy set, `Policy` appears as `null`.

The default retention policy, with the default values mentioned above, can be applied using the following command.

```kusto
.alter database DatabaseName policy retention "{}"
.alter table TableName policy retention "{}"
```

The command results in the following policy object applied to the database or table.

```kusto
{
  "SoftDeletePeriod": "36500.00:00:00", "Recoverability":"Enabled"
}
```

Clearing the retention policy of a database or table can be done using the following command.

```kusto
.delete database DatabaseName policy retention
.delete table TableName policy retention
```

## Examples

For a cluster that has a database named `MyDatabase`, with tables `MyTable1`, `MyTable2`, and `MySpecialTable`.

### Soft-delete period of seven days and recoverability disabled

Set all tables in the database to have a soft-delete period of seven days and disabled recoverability.

* *Option 1 (Recommended)*: Set a database-level retention policy, and verify there are no table-level policies set.

```kusto
.delete table MyTable1 policy retention        // optional, only if the table previously had its policy set
.delete table MyTable2 policy retention        // optional, only if the table previously had its policy set
.delete table MySpecialTable policy retention  // optional, only if the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d recoverability = disabled
```

* *Option 2*: For each table, set a table-level retention policy, with a soft-delete period of seven days and recoverability disabled.

```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d recoverability = disabled
.alter-merge table MyTable2 policy retention softdelete = 7d recoverability = disabled
.alter-merge table MySpecialTable policy retention softdelete = 7d recoverability = disabled
```

### Soft-delete period of seven days and recoverability enabled

* Set tables `MyTable1` and `MyTable2` to have a soft-delete period of seven days and recoverability enabled.
* Set `MySpecialTable` to have a soft-delete period of 14 days and recoverability disabled.

* *Option 1 (Recommended)*: Set a database-level retention policy, and set a table-level retention policy.

```kusto
.delete table MyTable1 policy retention   // optional, only if the table previously had its policy set
.delete table MyTable2 policy retention   // optional, only if the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d recoverability = disabled
.alter-merge table MySpecialTable policy retention softdelete = 14d recoverability = enabled
```

* *Option 2*: For each table, set a table-level retention policy, with the relevant soft-delete period and recoverability.

```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d recoverability = disabled
.alter-merge table MyTable2 policy retention softdelete = 7d recoverability = disabled
.alter-merge table MySpecialTable policy retention softdelete = 14d recoverability = enabled
```

### Soft-delete period of seven days, and `MySpecialTable` keeps its data indefinitely

Set tables `MyTable1` and `MyTable2` to have a soft-delete period of seven days, and have `MySpecialTable` keep its data indefinitely.

* *Option 1*: Set a database-level retention policy, and set a table-level retention policy, with a soft-delete period of 100 years, the default retention policy, for `MySpecialTable`.

```kusto
.delete table MyTable1 policy retention   // optional, only if the table previously had its policy set
.delete table MyTable2 policy retention   // optional, only if the table previously had its policy set
.alter-merge database MyDatabase policy retention softdelete = 7d
.alter table MySpecialTable policy retention "{}" // this sets the default retention policy
```

* *Option 2*: For tables `MyTable1` and `MyTable2`, set a table-level retention policy, and verify that the database-level and table-level policy for `MySpecialTable` aren't set.

```kusto
.delete database MyDatabase policy retention   // optional, only if the database previously had its policy set
.delete table MySpecialTable policy retention   // optional, only if the table previously had its policy set
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
```

* *Option 3*: For tables `MyTable1` and `MyTable2`, set a table-level retention policy. For table `MySpecialTable`, set a table-level retention policy with a soft-delete period of 100 years, the default retention policy.

```kusto
.alter-merge table MyTable1 policy retention softdelete = 7d
.alter-merge table MyTable2 policy retention softdelete = 7d
.alter table MySpecialTable policy retention "{}"
```

## Materialized views

The syntax for `alter | alter-merge | show | delete` is identical to the corresponding table commands, using `materialized-view` instead of `table`. 

> [!WARNING]
> Consult with the Azure Data Explorer team before altering the materialized view's merge policy.

### Example

<!-- csl -->
```
.alter-merge materialized-view ViewName policy retention softdelete = 100d recoverability = enabled
.delete materialized-view ViewName policy retention  

.show materialized-view ViewName policy caching
.alter materialized-view ViewName policy caching hot = 30d
```

### Materialized view retention policy

* **Retention policy of source table:** If the source table records aren't required for anything other than the materialized view, the retention policy of the source table can be dropped to a minimum. The materialized view will still store the data according to the retention policy set on the view. While materialized views are in preview mode, the recommendation is to allow a minimum of at least seven days and recoverability set to true. This setting allows for fast recovery for errors and for diagnostic purposes.

    > [!NOTE]
    > Zero retention policy on the source table is currently not supported.

* **Retention policy of materialized view:** The retention policy on the materialized view is related to the last update of a record. For example, if the view aggregation is: <br>
      `T | summarize count() by Day=bin(Timestamp, 1d)` <br>
 and soft delete is 30 days, records for `Day=d` are dropped 30 days after the last update for the record. 
    
  > [!NOTE]
  > The exact deletion time is imprecise, as with regular tables. For more information, see [retention policy](../retentionpolicy.md).
