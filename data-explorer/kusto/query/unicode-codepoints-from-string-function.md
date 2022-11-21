---
title: unicode_codepoints_from_string() - Azure Data Explorer
description: This article describes unicode_codepoints_from_string() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# unicode_codepoints_from_string()

Returns a dynamic array of the Unicode codepoints of an input string. This function is the inverse operation of [`unicode_codepoints_to_string()`](unicode-codepoints-to-string-function.md) function.

> **Deprecated aliases:** to_utf8()

## Syntax

`unicode_codepoints_from_string(`*source*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | string | &check; | The source string to convert. |

## Returns

Returns a dynamic array of the Unicode codepoints of the characters that make up the string provided to this function.
See [`unicode_codepoints_to_string()`](unicode-codepoints-to-string-function.md))

## Examples

```kusto
print arr = unicode_codepoints_from_string("⒦⒰⒮⒯⒪")
```

|arr|
|---|
|[9382, 9392, 9390, 9391, 9386]|

```kusto
print arr = unicode_codepoints_from_string("קוסטו - Kusto")
```

|arr|
|---|
|[1511, 1493, 1505, 1496, 1493, 32, 45, 32, 75, 117, 115, 116, 111]|

```kusto
print str = unicode_codepoints_to_string(unicode_codepoints_from_string("Kusto"))
```

|str|
|---|
|Kusto|
