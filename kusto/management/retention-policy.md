---
title: Retention policy
description: Learn how to use the retention policy to control how data is removed.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# Retention policy

The retention policy controls the mechanism that automatically removes data from tables or [materialized views](materialized-views/materialized-view-overview.md). It's useful to remove data that continuously flows into a table, and whose relevance is age-based. For example, the policy can be used for a table that holds diagnostics events that may become uninteresting after two weeks.

The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it. When the policy is configured both at the database and table level, the retention policy in the table takes precedence over the database policy.

Setting up a retention policy is important for clusters that are continuously ingesting data, which will limit costs.

Data that is "outside" the retention policy is eligible for removal. There's no specific guarantee when removal occurs. Data may "linger" even if the retention policy is triggered.

The retention policy is most commonly set to limit the age of the data since ingestion. For more information, see [SoftDeletePeriod](#the-policy-object).

> [!NOTE]
>
> * The deletion time is imprecise. The system guarantees that data won't be
deleted before the limit is exceeded, but deletion isn't immediate following that point.
> * A soft-delete period of 0 can be set as part of a table-level retention policy, but not as part of a database-level retention policy.
> * When this is done, the ingested data won't be committed to the source table, avoiding the need to persist the data. As a result, `Recoverability` can only be set to `Disabled`.
> * Such a configuration is useful mainly when the data gets ingested into a table.
> A transactional [update policy](update-policy.md) is used to transform it and redirect the output into another table.

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
  * It is not possible to configure the recoverability period.

## Management commands

* Use [`.show policy retention`](show-table-retention-policy-command.md) to show the current retention policy for a database, table, or [materialized view](materialized-views/materialized-view-overview.md).
* Use [`.alter policy retention`](alter-table-retention-policy-command.md) to change current retention policy of a database, table, or [materialized view](materialized-views/materialized-view-overview.md).

## Defaults

By default, when a database or a table is created, it doesn't have a retention policy defined. Normally, the database is created and then immediately has its retention policy set by its creator according to known requirements.
When you run a [`.show` command](show-table-retention-policy-command.md) for the retention policy of a database or table that hasn't had its policy set, `Policy` appears as `null`.

The default retention policy, with the default values mentioned above, can be applied using the following command.

```kusto
.alter database DatabaseName policy retention "{}"
.alter table TableName policy retention "{}"
.alter materialized-view ViewName policy retention "{}"
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
  .alter-merge materialized-view ViewName policy retention softdelete = 7d 
  ```

* *Option 2*: For each table, set a table-level retention policy, with a soft-delete period of seven days and recoverability disabled.

  ```kusto
  .alter-merge table MyTable1 policy retention softdelete = 7d recoverability = disabled
  .alter-merge table MyTable2 policy retention softdelete = 7d recoverability = disabled
  .alter-merge table MySpecialTable policy retention softdelete = 7d recoverability = disabled
  ```

### Soft-delete period of seven days and recoverability enabled

* Set tables `MyTable1` and `MyTable2` to have a soft-delete period of seven days and recoverability disabled.
* Set `MySpecialTable` to have a soft-delete period of 14 days and recoverability enabled.

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
