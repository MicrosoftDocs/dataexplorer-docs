---
title: .delete materialized view cache policy command - Azure Data Explorer
description: This article describes the .delete materialized view cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .delete materialized-view cache policy

Delete the materialized view cache policy. To speed up queries, Azure Data Explorer caches data on its processing nodes, in SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority. 

## Permissions

You must have at least [Materialized view Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `materialized-view` *MaterializedViewName* `policy` `caching`

## Arguments

*MaterializedViewName* - Specify the name of the materialized view.

## Example

The following example deletes the caching policy.

```kusto
.delete materialized-view MyMaterializedView policy caching 
```
