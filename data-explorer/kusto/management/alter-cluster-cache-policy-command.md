---
title: ".alter cluster cache policy command - Azure Data Explorer"
description: "This article describes the .alter cluster cache policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/29/2021
---
# .alter cluster cache policy

Change the cluster cache policy. To speed up queries on data, Azure Data Explorer caches it on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority.  

## Syntax

`.alter` `cluster` `policy` `caching` *PolicyObjects*  

## Arguments

*PolicyObjects* - Definitions one or more policy objects.

## Returns

Returns a JSON representation of the policy.

## Example

The following example sets the caching policy to include the last 30 days.

```kusto
.alter cluster policy caching hot = 30d
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|AutoCalloutPolicy| |{"DataHotSpan": { "Value": "30.00:00:00" }, "IndexHotSpan": { "Value": "30.00:00:00"}}| |