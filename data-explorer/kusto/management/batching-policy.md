---
title: IngestionBatching policy - Azure Data Explorer | Microsoft Docs
description: This article describes IngestionBatching policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/30/2019
---
# IngestionBatching policy

The [ingestionBatching policy](../concepts/batchingpolicy.md) is a policy object that determines
when data aggregation should stop during data ingestion according to the specified settings.

The policy can be set to `null`, in which case the default values are used, setting
the maximum batching time span to: 5 minutes, 1000 items and a total batch size of 1G 
or the default cluster value set by Kusto.

If the policy is not set for a certain entity, it will look for a higher hierarchy level policy,
if all are set to null the default value will be used. 

The policy has a lower limit of 10 seconds and it is not recommended to use values larger than 15 minutes.

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
.alter tables (table_name [, ...]) policy ingestionbatching @'<ingestionbatching policy json>'
```
IngestionBatching policy:
```
{
  "MaximumBatchingTimeSpan": "00:05:00",
  "MaximumNumberOfItems": 500, 
  "MaximumRawDataSizeMB": 1024
}
```

* `entity_type` : table, database
* `database_or_table`: if entity is table or database, its name should be specified in the command as follows - 
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

Setting policy of IngestionBatching of table `MyTable` (in database context) to 10 minutes, 500 files and 1G:
```
.alter table MyTable policy  ingestionbatching  @"{'MaximumBatchingTimeSpan':'00:10:00', 'MaximumNumberOfItems': 500, 'MaximumRawDataSizeMB': 1024}"
```

Setting policy for multiple tables (in database context), 10 minutes, 500 files and 1G:
```
.alter tables (MyTable1, MyTable2, MyTable3) policy  ingestionbatching  @"{'MaximumBatchingTimeSpan':'00:10:00', 'MaximumNumberOfItems': 500, 'MaximumRawDataSizeMB': 1024}"
```

Deleting a policy set on an entity:
```
.delete table MyTable policy ingestionbatching
```

Deleting a policy set on a database:
```
.delete database MyDatabase policy ingestionbatching
```