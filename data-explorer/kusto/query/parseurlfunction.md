---
title: parse-url() (Azure Kusto)
description: This article describes parse-url() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# parse-url()

Parses an absolute URL `string` and returns a [`dynamic`](./scalar-data-types/dynamic.md) object contains all parts of the URL (Scheme, Host, Port, Path, Username, Password, Query Parameters, Fragment).

**Syntax**

`parse-url(`*url*`)`

**Arguments**

* *url*: A string represents a URL or the query part of the URL.

**Returns**

An object of type `dynamic` that inculded the URL components as listed above.

**Example**

```kusto
T | extend Result = parse-url("scheme://username:password@host:1234/this/is/a/path?k1=v1&k2=v2#fragment")
```

will result

```
 {
 	"Scheme":"scheme",
 	"Host":"host",
 	"Port":"1234",
 	"Path":"this/is/a/path",
 	"Username":"username",
 	"Password":"password",
 	"Query Parameters":"{"k1":"v1", "k2":"v2"}",
 	"Fragment":"fragment"
 }
```