---
title: ".alter table cache policy command - Azure Data Explorer"
description: "This article describes the .alter table cache policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/29/2021
---
# .alter table cache policy

Change the table cache policy. To speed up queries on data, Azure Data Explorer caches it on its processing nodes, in SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority. 

## Syntax

`.alter` `table` [*DatabaseName* `.`]*TableName* `policy` `caching` *PolicyObjects* 

## Arguments

- *DatabaseName* - Specify the name of the database.
- *TableName* - Specify the name of the table. Use without *DatabaseName* when running in the required database's context.
- *PolicyObjects* - Define one or more policy objects.

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
