---
title: .show materialized view cache policy command - Azure Data Explorer
description: This article describes the .show materialized view cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/09/2023
---
# .show materialized view cache policy

Show the materialized view cache policy. To speed up queries on data, Azure Data Explorer caches it on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority.  

## Syntax

`.show` `materialized-view` *MaterializedViewName* `policy` `caching`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view.|

## Returns

Returns a JSON representation of the policy.

## Example

The following example shows the table caching policy:

```kusto
.show materialized-view MyMaterializedView policy caching 
```
