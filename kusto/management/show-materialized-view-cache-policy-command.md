---
title: .show materialized-view policy caching command
description: Learn how to use the `.show materialized-view policy caching` command to show the materialized view's cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .show materialized-view policy caching command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Show the materialized view cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cache-policy.md) describes the data artifacts used, so that more important data can take priority.

## Syntax

`.show` `materialized-view` *MaterializedViewName* `policy` `caching`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*| `string` | :heavy_check_mark:|The name of the materialized view.|

## Returns

Returns a JSON representation of the policy.

## Example

The following example shows the table caching policy:

```kusto
.show materialized-view MyMaterializedView policy caching 
```
