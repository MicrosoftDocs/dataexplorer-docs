---
title: string_size() - Azure Data Explorer
description: Learn how to use the string_size() function to measure the size of the input string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/01/2023
---
# string_size()

Returns the size, in bytes, of the input string.

## Syntax

`string_size(`*source*`)`

## Arguments

* *source*: The source string that will be measured for string size.

## Returns

Returns the length, in bytes, of the input string.

## Examples

```kusto
print size = string_size("hello")
```

**Output**

|size|
|---|
|5|

```kusto
print size = string_size("⒦⒰⒮⒯⒪")
```

**Output**

|size|
|---|
|15|
