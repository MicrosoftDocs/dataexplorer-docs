---
title: JsonPath syntax - Azure Data Explorer | Microsoft Docs
description: This article describes JsonPath expressions in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: igborodi
ms.service: data-explorer
ms.topic: reference
ms.date: 12/20/2021
ms.localizationpriority: high
---

# JsonPath expressions

The JsonPath notation is used in Azure Data Explorer for specifying [data mappings](../management/mappings.md), and the the following functions that use the JsonPath notation for specifying fields when working with JSON.

- [bag_remove_keys()](bag-remove-keys-function.md)
- [extractjson()](extractjsonfunction.md)

The following subset if the JsonPath noatation is supported:

|Path expression|Description|
|---|---|
|`$`|Root object|
|`.` or `[ ]` | Child|
|`[ ]`|Array subscript|

> [!NOTE]
>
> - Wildcards, recursion, union, slices and current object are not supported.
> - JSON paths that include special characters should be escaped as [\'Property Name\'].
