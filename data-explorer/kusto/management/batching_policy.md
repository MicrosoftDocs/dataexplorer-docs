---
title: IngestionBatching policy - Azure Kusto | Microsoft Docs
description: This article describes IngestionBatching policy in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# IngestionBatching policy

The [ingestionBatching policy](https://kusdoc2.azurewebsites.net/docs/concepts/batchingpolicy.html) is a policy object that determines
when data aggregation should stop during data ingestion according to the specified time.

The policy can be set to `null`, in which case the default values are used, setting
the maximum batching time span to 5 minutes or the default cluster value set by kusto.

If the policy is not set for a certain entity, it will look for a higher hierarchy level policy,
if all are set to null the default value will be used. 

## Displaying the IngestionBatching policy

The policy can be set on a database or a table, and is displayed by using one of the following
commands:

* `.show` `database` *DatabaseName* `policy` `ingestionbatching`
* `.show` `table` *DatabaseName*`.`*TableName* `policy` `ingestionbatching`

## Altering the IngestionBatching policy

```kusto
.alter <entity_type> <database_or_table_name> policy ingestionbatching @'<ingestionbatching policy json>'
```
Altering the IngestionBatching policy for multiple tables (in the same database context):

```kusto
.alter tables (table_name [, ...]) policy IngestionBatching @'<ingestionbatching policy json>'
```
IngestionBatching policy:
```
{
  "MaximumBatchingTimeSpan": "00:05:00",
}
```

* `entity_type` : table, database
* `database_or_table`: if entity is table or database, its name should be specifieid in the command as follows - 
  - `database_name` or 
  - `database_name.table_name` or 
  - `table_name` (when running in the specific database's context)

## Deleting the IngestionBatching policy

```kusto
.delete <entity_type> <database_or_table_name> policy ingestionbatching
```

**Examples**

Show policy of IngestionBatching for table `MyTable` in database `MyDatabase`:
```
.show table MyDatabase.MyTable policy ingestionbatching 
```

Setting policy of IngestionBatching of table `MyTable` (in database context) to 10 minutes:
```
.alter table MyTable policy ingestionbatching  @"{'MaximumBatchingTimeSpan':'00:10:00'}"
```

Setting policy for multiple tables (in database context), 10 minutes:
```
.alter tables (MyTable1, MyTable2, MyTable3) ingestionbatching  @"{'MaximumBatchingTimeSpan':'00:10:00'}"
```

Deleting a policy set on an entity:
```
.delete table MyTable policy ingestionbatching
```

Deleting a policy set on a database:
```
.delete database MyDatabase policy ingestionbatching
```