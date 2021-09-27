---
title: .show database cache policy command - Azure Data Explorer
description: This article describes the .show database cache policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .show database cache policy

Show the database cache policy.  To speed up queries on data, Azure Data Explorer caches it, or parts of it, on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) enables Azure Data Explorer to describe the data artifacts that it uses, so that more important data can take priority. 

## Cache policy vs retention policy

Cache policy is independent of [retention policy](./retentionpolicy.md): 
- Cache policy defines how to prioritize resources. Queries over important data will be faster and resistant to the impact of queries over less important data.
- Retention policy defines the extent of the queryable data in a table/database (specifically, `SoftDeletePeriod`).

## Syntax

`.show` `database` *DatabaseName* `policy` `caching`

## Arguments

*DatabaseName* - Specify the name of the database.

## Arguments

*DatabaseName* - Specify the name of the database.

## Example

The following example shows the table caching policy:

```kusto
.show database MyDatabase policy caching 
```