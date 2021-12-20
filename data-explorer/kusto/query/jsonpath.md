---
title: JsonPath support - Azure Data Explorer | Microsoft Docs
description: This article describes JsonPath expressions in Azure Data Explorer.
services: data-explorer
author: sigorbor
ms.author: sigorbor
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 12/20/2021
ms.localizationpriority: high
---

# JSON Path expressions

JsonPath format is used in Kusto for specifying [data mappings](kusto/management/mappings.md), and there are a few functions in Kusto that use JsonPath notation for specifying fields when working with JSON.

- [bag_remove_keys()](bag-remove-keys-function.md)
- [extractjson()](extractjsonfunction.md)

Kusto supports the following subset of the JsonPath format:

|Path expression|Description|
|---|---|
|`$`|Root object|
|`.` or `[ ]` | Child|
|`[ ]`|Array subscript|

*(We don't currently implement wildcards, recursion, union, slices and current object.)*

> [!NOTE]
> JSON paths that include special characters should be escaped as [\'Property Name\'].

