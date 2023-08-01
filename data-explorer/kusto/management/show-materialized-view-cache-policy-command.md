---
title: .show materialized-view policy caching command
description: Learn how to use the `.show materialized-view policy caching` command to show the materialized view's cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .show materialized-view policy caching command

Show the materialized view cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) allows your cluster to describe the data artifacts that it uses, so that more important data can take priority.

## Syntax

`.show` `materialized-view` *MaterializedViewName* `policy` `caching`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

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
