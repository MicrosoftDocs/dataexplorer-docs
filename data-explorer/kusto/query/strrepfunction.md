---
title: strrep() - Azure Data Explorer
description: Learn how to use the strrep() function to repeat the input value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/01/2023
---
# strrep()

Repeats the given [string](./scalar-data-types/string.md) a specified number of times.

* If the first or third arguments aren't of a string type, they'll forcibly be converted to a string.

## Syntax

`strrep(`*value*,*multiplier*,[*delimiter*]`)`

## Arguments

* *value*: input expression
* *multiplier*: positive integer value (from 1 to 1024)
* *delimiter*: an optional string expression (default: empty string)

## Returns

Value repeated for a specified number of times, concatenated with *delimiter*.

In case if *multiplier* is more than maximal allowed value (1024), input string will be repeated 1024 times.

## Example

```kusto
print from_str = strrep('ABC', 2), from_int = strrep(123,3,'.'), from_time = strrep(3s,2,' ')
```

**Output**

|from_str|from_int|from_time|
|---|---|---|
|ABCABC|123.123.123|00:00:03 00:00:03|
