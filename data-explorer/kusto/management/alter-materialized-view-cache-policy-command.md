---
title: ".alter materialized view cache policy command - Azure Data Explorer"
description: "This article describes the .alter materialized view cache policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter materialized-view cache policy

Change the materialized view cache policy. To speed up queries on data, Azure Data Explorer caches data on its processing nodes, in SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority.

## Permissions

You must have at least [Materialized view Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `policy` `caching` *PolicyParameter*

## Arguments

*MaterializedViewName* - Specify the name of the materialized view. 
*PolicyParameter* - Define one or more policy parameters. For parameters, see [cache policy](cachepolicy.md). 

## Example

Set the caching policy to include the last 30 days.

```kusto
.alter materialized-view MyMaterializedView policy caching hot = 30d
```

Set the caching policy to include the last 30 days and data from January and April 2021.

```kusto
.alter materialized-view MyMaterializedView policy caching 
        hot = 30d,
        hot_window = datetime(2021-01-01) .. datetime(2021-02-01),
        hot_window = datetime(2021-04-01) .. datetime(2021-05-01)
```
