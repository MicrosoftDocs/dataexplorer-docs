---
title: .show table cache policy command - Azure Data Explorer
description: This article describes the .show table cache policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .show table cache policy

Show the table cache policy. To speed up queries on data, Azure Data Explorer caches it, or parts of it, on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) enables Azure Data Explorer to describe the data artifacts that it uses, so that more important data can take priority. 

## Cache policy vs retention policy

Cache policy is independent of [retention policy](./retentionpolicy.md): 
- Cache policy defines how to prioritize resources. Queries over important data will be faster and resistant to the impact of queries over less important data.
- Retention policy defines the extent of the queryable data in a table/database (specifically, `SoftDeletePeriod`).

## Syntax

`.show` `table` [*DatabaseName* `.`]*TableName* `policy` `caching`

## Arguments

*DatabaseName* - Specify the name of the database.
*TableName* - Specify the name of the table. Use without *DatabaseName* when running in the required database's context.

## Examples

The following examples shows the table caching policy:

```kusto
.show table MyDatabase.MyTable policy caching 
```

```kusto
.show table MyTable policy caching 
```