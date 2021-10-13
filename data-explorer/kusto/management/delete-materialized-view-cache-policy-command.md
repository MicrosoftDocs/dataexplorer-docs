---
title: .delete materialized view cache policy command - Azure Data Explorer
description: This article describes the .delete materialized view cache policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/27/2021
---
# .delete materialized view cache policy

Delete the materialized view cache policy. To speed up queries on data, Azure Data Explorer caches it on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority. 

## Syntax

`.delete` `materialized view` *MaterializedViewName* `policy` `caching`

## Arguments

*MaterializedViewName* - Specify the name of the materialized view.

## Example

The following example deletes the caching policy.

```kusto
.delete materialized-view MyMaterializedView policy caching 
```