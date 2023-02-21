---
title: ".alter table cache policy command - Azure Data Explorer"
description: "This article describes the .alter table cache policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter table cache policy

Change the table cache policy. To speed up queries, Azure Data Explorer caches data on its processing nodes, in SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe data so that important data can take priority.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` [*DatabaseName* `.`]*TableName* `policy` `caching` *PolicyParameters* 

## Arguments

- *DatabaseName* - Specify the name of the database.
- *TableName* - Specify the name of the table. Use without *DatabaseName* when running in the required database's context.
- *PolicyParameters* - Define policy parameters, see also [cache policy](cachepolicy.md).

## Example

### Set cache policy of a table

Set the caching policy to include the last 30 days.

```kusto
.alter table MyTable policy caching hot = 30d
```

### Set the cache policy of table with extra hot-cache windows

Set the caching policy to include the last 30 days and extra data from January and April 2021.

```kusto
.alter table MyTable policy caching 
        hot = 30d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```

### Set the caching policy for multiple tables 

Set the caching policy for several tables to include the last 30 days, and data from January and April 2021.

```kusto
.alter tables (MyTable1, MyTable2, MyTable3) policy caching 
        hot = 30d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```

### Set the caching policy for multiple tables with extra hot-cache windows

Set the caching policy for several tables to include the last 30 days.

```kusto
.alter tables (MyTable1, MyTable2, MyTable3) policy caching hot = 30d
```
