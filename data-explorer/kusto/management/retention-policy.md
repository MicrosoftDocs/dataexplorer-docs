---
title: Kusto retention policy management - Azure Data Explorer
description: This article describes Retention policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/19/2020
---
# retention policy command

This article describes control commands used for creating and altering [retention policy](retentionpolicy.md).

## Show retention policy

```kusto
.show <entity_type> <database_or_table_or_materialized_view> policy retention

.show <entity_type> *  policy retention
```

* `entity_type` : table, materialized view, or database
* `database_or_table_or_materialized_view`: `database_name` or `database_name.table_name` or `table_name` (in database context) or `materialized_view_name`

**Example**

Show the retention policy for the database named `MyDatabase`:

```kusto
.show database MyDatabase policy retention
```

## Delete retention policy

Deleting data retention policy is affectively setting unlimited data retention.

Deleting the table's data retention policy will cause the table to derive the retention policy from the database level.

```kusto
.delete <entity_type> <database_or_table_or_materialized_view> policy retention
```

* `entity_type` : table, materialized view, or database
* `database_or_table_or_materialized_view`: `database_name` or `database_name.table_name` or `table_name` (in database context) or `materialized_view_name`

**Example**

Delete the retention policy for the table named `MyTable1`:

```kusto
.delete table MyTable policy retention
```


## Alter retention policy

```kusto
.alter <entity_type> <database_or_table_or_materialized_view> policy retention <retention_policy>

.alter tables (<table_name> [, ...]) policy retention <retention_policy>

.alter-merge <entity_type> <database_or_table_or_materialized_view> policy retention <retention_policy>

.alter-merge <entity_type> <database_or_table_or_materialized_view> policy retention [softdelete = <timespan>] [recoverability = disabled|enabled]
```

* `entity_type` : table or database or materialized view
* `database_or_table_or_materialized_view`: `database_name` or `database_name.table_name` or `table_name` (in database context) or `materialized_view_name`
* `table_name` : name of a table in a database context.  A wildcard (`*` is allowed here).
* `retention_policy` :

```kusto
    "{ 
        \"SoftDeletePeriod\": \"10.00:00:00\", \"Recoverability\": \"Disabled\"
    }" 
```

**Examples**

Show the retention policy for the database named `MyDatabase`:

```kusto
.show database MyDatabase policy retention
```

Sets a retention policy with a 10 day soft-delete period and disabled data recoverability:

```kusto
.alter-merge table Table1 policy retention softdelete = 10d recoverability = disabled

.alter-merge materialized-view View1 policy retention softdelete = 10d recoverability = disabled
```

Sets a retention policy with a 10 day soft-delete period and enabled data recoverability:

```kusto
.alter table Table1 policy retention "{\"SoftDeletePeriod\": \"10.00:00:00\", \"Recoverability\": \"Enabled\"}"

.alter materialized-view View1 policy retention "{\"SoftDeletePeriod\": \"10.00:00:00\", \"Recoverability\": \"Enabled\"}"
```

Sets the same retention policy as above, but this time for multiple tables (Table1, Table2 and Table3):

```kusto
.alter tables (Table1, Table2, Table3) policy retention "{\"SoftDeletePeriod\": \"10.00:00:00\", \"Recoverability\": \"Enabled\"}"
```

Sets a retention policy with the default values: 100 years as the soft-delete period and recoverability enabled:

```kusto
.alter table Table1 policy retention "{}"
```