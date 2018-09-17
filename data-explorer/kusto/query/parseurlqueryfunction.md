---
title: parse_urlquery() - Azure Data Explorer | Microsoft Docs
description: This article describes parse_urlquery() in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# parse_urlquery()

Parses a url query `string` and returns a [`dynamic`](./scalar-data-types/dynamic.md) object contains the Query parameters.

**Syntax**

`parse_urlquery(`*query*`)`

**Arguments**

* *query*: A string represents a url query.

**Returns**

An object of type `dynamic` that includes the query parameters.

**Example**

```kusto
parse_urlquery("k1=v1&k2=v2&k3=v3")
```

will result:

```
 {
 	"Query Parameters":"{"k1":"v1", "k2":"v2", "k3":"v3"}",
 }
```

**Notes**

* Input format should follow URL query standards (key=value& ...)
 