---
title: unicode_codepoints_to_string() - Azure Data Explorer
description: This article describes unicode_codepoints_to_string() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# unicode_codepoints_to_string()

Returns the string represented by the Unicode codepoints.

> **Deprecated aliases:** make_string()
    
## Syntax

`unicode_codepoints_to_string (`*Arg1*[, *ArgN*]... `)`

## Arguments

* *Arg1* ... *ArgN*: Expressions that are integers (int or long) or a dynamic value holding an array of integral numbers.

* This function receives up to 64 arguments.

## Returns

Returns the string made of the UTF characters whose Unicode codepoint value is provided by the arguments to this function. The input must consist of valid Unicode codepoints.
If any argument isn't a valid Unicode codepoint, the function returns `null`.

## Examples

```kusto
print str = unicode_codepoints_to_string(75, 117, 115, 116, 111)
```

|str|
|---|
|Kusto|

```kusto
print str = unicode_codepoints_to_string(dynamic([75, 117, 115, 116, 111]))
```

|str|
|---|
|Kusto|

```kusto
print str = unicode_codepoints_to_string(dynamic([75, 117, 115]), 116, 111)
```

|str|
|---|
|Kusto|

```kusto
print str = unicode_codepoints_to_string(75, 10, 117, 10, 115, 10, 116, 10, 111)
```

|str|
|---|
|K<br>u<br>s<br>t<br>o|


```kusto
print str = unicode_codepoints_to_string(range(48,57), range(65,90), range(97,122))
```

|str|
|---|
0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz|
