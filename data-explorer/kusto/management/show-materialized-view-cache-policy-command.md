---
title: .show materialized view cache policy command - Azure Data Explorer
description: This article describes the .show materialized view cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/27/2021
---
# .show materialized-view cache policy

Show the materialized view cache policy. To speed up queries, Azure Data Explorer caches data on its processing nodes, in SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority.  

## Syntax

`.show` `materialized-view` *MaterializedViewName* `policy` `caching`

## Arguments

*MaterializedViewName* - Specify the name of the materialized view.

## Returns

Returns a JSON representation of the policy.

## Example

The following example shows the materialized view caching policy:

```kusto
.show materialized-view MyMaterializedView policy caching 
```
