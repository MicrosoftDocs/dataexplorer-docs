---
title: parse_url() - Azure Data Explorer
description: Learn how to use the parse_url() function to parse an obsolete URL string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2023
---
# parse_url()

Parses an absolute URL `string` and returns a `dynamic` object contains URL parts.

> **Deprecated aliases:** parseurl()

## Syntax

`parse_url(`*url*`)`

## Arguments

* *url*: A string represents a URL or the query part of the URL.

## Returns

An object of type [dynamic](./scalar-data-types/dynamic.md) that included the URL components: Scheme, Host, Port, Path, Username, Password, Query Parameters, Fragment.

## Example

```kusto
T | extend Result = parse_url("scheme://username:password@host:1234/this/is/a/path?k1=v1&k2=v2#fragment")
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
