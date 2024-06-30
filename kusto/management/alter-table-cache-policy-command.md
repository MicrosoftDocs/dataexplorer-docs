---
title:  .alter table policy caching command
description: Learn how to use the `.alter table policy caching` command to change the table's cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/04/2023
---
# .alter table policy caching command

Change's the table's cache policy. To speed up queries, data is cached on processing nodes, in SSD, or even in RAM. The [cache policy](cache-policy.md) allows your cluster to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` [*DatabaseName* `.`]*TableName* `policy` `caching` *PolicyParameters*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *DatabaseName* | `string` | | The name of the database. When you run the command from the database context that contains the table to alter, *DatabaseName* is not required.|
| *TableName* | `string` |  :heavy_check_mark: | The name of the table. Use without *DatabaseName* when running in the required database's context.|
| *PolicyParameters* | `string` |  :heavy_check_mark: | The policy parameters to set. See [cache policy](cache-policy.md).|

## Examples

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
