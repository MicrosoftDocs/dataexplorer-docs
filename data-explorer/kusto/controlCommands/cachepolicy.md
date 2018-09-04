---
title: Cache policy - Azure Kusto | Microsoft Docs
description: This article describes Cache policy in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Cache policy

The [cache policy](https://kusdoc2.azurewebsites.net/docs/concepts/cachepolicy.html) is a policy object that determines
which data should be preferred when caching data on local SSD. Such data is called "hot".

The policy can be set to `null`, in which case all the data will be considered as viable
for caching on SSD (of course, if the total amount of SSD is smaller than that of hot data,
the cache might need to evict data constantly.)

When setting the hot data in the cache policy to a specific period, the data is kept
on the cluster's machine SSDs only for that period, and the rest of the data
(up to the period that is defined as `SoftDeletePeriod` in the [retention policy](https://kusdoc2.azurewebsites.net/docs/concepts/retentionpolicy.html))
is kept in Azure blob storage. To be clear, **all** the data in the period that
is specified in the soft retention period is available for querying. 

## Displaying the cache policy

The policy can be set on a data or a table, and is displayed by using one of the following
commands:

* `.show` `database` *DatabaseName* `policy` `caching`
* `.show` `table` *DatabaseName*`.`*TableName* `policy` `caching`

## Altering the cache policy

```kusto
.alter <entity_type> <database_or_table_name> policy caching hot = <timespan>
```
Altering policy of Caching for multiple tables (in the same database context):

```kusto
.alter tables (table_name [, ...]) policy caching hot = <timespan>
```
Cache policy:
```
{
  "DataHotSpan": {
    "Value": "3.00:00:00"
  },
  "IndexHotSpan": {
    "Value": "3.00:00:00"
  }
}
```

* `entity_type` : table, database or cluster
* `database_or_table`: if entity is table or database, its name should be specifieid in the command as follows - 
  - `database_name` or 
  - `database_name.table_name` or 
  - `table_name` (when running in the specific database's context)

## Deleting the cache policy

```kusto
.delete <entity_type> <database_or_table_name> policy caching
```

**Examples**

Show policy of caching for table `MyTable` in database `MyDatabase`:
```
.show table MyDatabase.MyTable policy caching 
```

Setting policy of caching of table `MyTable` (in database context) to 3 days:
```
.alter table MyTable policy caching hot = 3d
```

Setting policy for multiple tables (in database context), to 3 days:
```
.alter tables (MyTable1, MyTable2, MyTable3) policy caching hot = 3d
```

Deleting a policy set on a table:
```
.delete table MyTable policy caching
```

Deleting a policy set on a database:
```
.delete database MyDatabase policy caching
```