---
title: toguid() - Azure Data Explorer
description: Learn how to use the toguid() function to convert the input string to a `guid` scalar.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/22/2023
---
# toguid()

Converts a string to a [`guid`](./scalar-data-types/guid.md) scalar.

> [!NOTE]
> If you have a hard-coded guid, we recommend using [guid()](./scalar-data-types/guid.md).

## Syntax

`toguid(`*Expr*`)`

## Arguments

* *Expr*: Expression that will be converted to [`guid`](./scalar-data-types/guid.md) scalar.

## Returns

The conversion process takes the first 32 characters of the input, ignoring properly located hyphens, validates that the characters are between 0-9 or a-f, and then converts the string into a [`guid`](./scalar-data-types/guid.md) scalar. The rest of the string is ignored.

If the conversion is successful, the result will be a [`guid`](./scalar-data-types/guid.md) scalar. Otherwise, the result will be `null`.

## Examples

```kusto
datatable(str: string)
[
    "0123456789abcdef0123456789abcdef",
    "0123456789ab-cdef-0123-456789abcdef",
    "a string that is not a guid"
]
| extend guid = toguid(str)
```

**Output**:

|str|guid|
|---|---|
|0123456789abcdef0123456789abcdef|01234567-89ab-cdef-0123-456789abcdef|
|0123456789ab-cdef-0123-456789abcdef|01234567-89ab-cdef-0123-456789abcdef|
|a string that isn't a guid||
