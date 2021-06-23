---
title: Cache policy - Azure Data Explorer | Microsoft Docs
description: This article describes Cache policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/19/2020
---
# cache policy command

This article describes commands used for creation and altering [cache policy](cachepolicy.md) 

## Displaying the cache policy

The policy can be set on a database, a table or a [materialized view](materialized-views/materialized-view-overview.md), and is displayed by using one of the following
commands:

* `.show` `database` *DatabaseName* `policy` `caching`
* `.show` `table` *TableName* `policy` `caching`
* `.show` `materialized-view` *MaterializedViewName* `policy` `caching`

## Altering the cache policy

```kusto
.alter <entity_type> <database_or_table_or_materialized-view_name> policy caching 
      hot = <timespan> 
      [, hot_window = datetime(*from*) .. datetime(*to*)] 
      [, hot_window = datetime(*from*) .. datetime(*to*)] 
      ...
```

Altering cache policy for multiple tables (in the same database context):

```kusto
.alter tables (table_name [, ...]) policy caching 
      hot = <timespan> 
      [, hot_window = datetime(*from*) .. datetime(*to*)] 
      [, hot_window = datetime(*from*) .. datetime(*to*)] 
```

Arguments:

* `entity_type` : table, materialized view, database, or cluster
* `database_or_table_or_materialized-view`: if entity is table or database, its name should be specified in the command as follows - 
  - `database_name` or 
  - `database_name.table_name` or 
  - `table_name` (when running in the specific database's context)

## Deleting the cache policy

```kusto
.delete <entity_type> <database_or_table_or_materialized-view_name> policy caching
```

## Examples

### Show cache policy for  table `MyTable` in database `MyDatabase`

```kusto
.show table MyDatabase.MyTable policy caching 
```

### Setting cache policy of a table

Command sets caching policy to include last 30 days.

```kusto
.alter table MyTable policy caching hot = 30d
```

### Setting cache policy of table with additional hot-cache windows

Command sets caching policy to include last 30 days and additional data from January and April 2021.

```kusto
.alter table MyTable policy caching 
        hot = 30d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```

### Setting cache policy of a materialized-view

Command sets caching policy to include last 30 days.

```kusto
.alter materialized-view MyMaterializedView policy caching hot = 30d
```

### Setting cache policy of a materialized-view with additional hot-cache windows

Command sets caching policy to include last 30 days and additional data from January and April 2021.

```kusto
.alter materialized-view MyMaterializedView policy caching 
        hot = 30d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```

### Setting policy for multiple tables 

Command sets caching policy to include last 30 days and additional data from January and April 2021 for several tables in the database.

```kusto
.alter tables (MyTable1, MyTable2, MyTable3) policy caching 
        hot = 30d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```

### Setting policy for multiple tables with additional hot-cache windows

Command sets caching policy to include last 30 days for several tables in the database.

```kusto
.alter tables (MyTable1, MyTable2, MyTable3) policy caching hot = 30d
```

### Deleting a policy set on a table

```kusto
.delete table MyTable policy caching
```

### Deleting a policy set on a materialized view

```kusto
.delete materialized-view MyMaterializedView policy caching
```

### Deleting a policy set on a database

```kusto
.delete database MyDatabase policy caching
```
