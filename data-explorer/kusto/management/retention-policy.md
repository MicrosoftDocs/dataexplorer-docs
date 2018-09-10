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

```kusto
.show <entity_type> <database_or_table> policy retention

.show <entity_type> *  policy retention

.delete <entity_type> <database_or_table> policy retention

.alter <entity_type> <database_or_table> policy retention <retention_policy>

.alter tables (<table_name> [, ...]) policy retention <retention_policy>

.alter-merge <entity_type> <database_or_table> policy retention <retention_policy>

.alter-merge <entity_type> <database_or_table_name> policy retention [softdelete = <timespan>] [harddelete= <timespan>]
```

* `entity_type` : table or database
* `database_or_table`: `database_name` or `database_name.table_name` or `table_name` (in database context)
* `table_name` : name of a table in a database context.  A wildcard (`*` is allowed here).
* `retention_policy` :

```
    "{ 
        \"SoftDeletePeriod\": \"10.00:00:00\", 
        \"HardDeletePeriod\": \"30.00:00:00\", 
        \"ContainerRecyclingPeriod\": \"1.00:00:00\" 
        \"ExtentsDataSizeLimitInBytes\": 0,
        \"OriginalDataSizeLimitInBytes\": 0
    }" 
```

**Examples**

Show the retention policy for the database named `MyDatabase`:

```kusto
.show database MyDatabase policy retention
```

Sets a retention policy with a 10 day soft-delete period and a 30 day hard-delete period:

```kusto
.alter-merge table Table1 policy retention softdelete = 10d harddelete = 30d
```

Sets the soft-delete period to 20 days. hard-delete is (implicitly) set to 27d:

```kusto
.alter-merge table Table1 policy retention softdelete = 20d
```

Sets the hard-delete period to 30 days:

```kusto
.alter-merge table Table1 policy retention harddelete = 30d
```

Sets a retention policy with a 10 day soft-delete period and a 30 day hard-delete period:

```kusto
.alter table Table1 policy retention "{\"SoftDeletePeriod\": \"10.00:00:00\", \"HardDeletePeriod\": \"30.00:00:00\"}"
```

Sets the same retention policy as above, but this time for multiple tables (Table1, Table2 and Table3):

```kusto
.alter tables (Table1, Table2, Table3) policy retention "{\"SoftDeletePeriod\": \"10.00:00:00\", \"HardDeletePeriod\": \"30.00:00:00\"}"
```

Sets a retention policy with a 10 GB data size limit on the extents size:

```kusto
.alter table Table1 policy retention "{\"ExtentsDataSizeLimitInBytes\": 10737418240}"

```

Sets a retention policy with a 10 GB data size limit on the original size:

```kusto
.alter table Table1 policy retention "{\"OriginalDataSizeLimitInBytes\": 107374182400}"
```

Sets a retention policy with the default values: 100 years as the soft-delete period, and 100 years and 7 days as the hard-delete period:

```kusto
.alter table Table1 policy retention "{}"
```