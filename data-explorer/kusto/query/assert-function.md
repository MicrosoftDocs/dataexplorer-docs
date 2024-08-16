---
title:  assert()
description: Learn how to use the assert() function to check for a condition and output an error message when false.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/03/2022
---
# assert()

Checks for a condition. If the condition is false, outputs error messages and fails the query.

> [!NOTE]
> The `assert` function gets evaluated during the query analysis phase, before optimizations such as constant-folding and predicate short-circuiting get applied.

> [!NOTE]
> The parameters given to `assert` must be evaluated to constants during the query analysis phase. In other words, it can be constructed from other expressions referencing constants only, and can't be bound to row-context.

## Syntax

`assert(`*condition*`,`*message*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *condition* | `bool` |  :heavy_check_mark: | The conditional expression to evaluate. The condition must be evaluated to constant during the query analysis phase.|
| *message* | `string` |  :heavy_check_mark: | The message used if assertion is evaluated to `false`.|

## Returns

Returns `true` if the condition is `true`.
Raises a semantic error if the condition is evaluated to `false`.

## Examples

The following query defines a function `checkLength()` that checks input string length, and uses `assert` to validate input length parameter (checks that it's greater than zero).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/?query=H4sIAAAAAAAAA02OywrCMBBF9/mKoZsmEMH6hEr9Av9AXKTtkBTjVJIpgo9/N60izmzuYs6d45GhcdicD0iWHVQgPVLpe7IaYhk5dGSVeAhIY2LEwOMB7GGuIftClyEy1Ag2oGEMwM4Q3DH0mQJD7cSmpsTJqBKagnjtRGs4be1RdnQd+PfsOAF5sVjm+hNX6802FyfxhJvDgP/Go0016spZoTRMTeoNUTSJPdYAAAA=" target="_blank">Run the query</a>

```kusto
let checkLength = (len:long, s:string)
{
    assert(len > 0, "Length must be greater than zero") and
    strlen(s) > len
};
datatable(input:string)
[
    '123',
    '4567'
]
| where checkLength(len=long(-1), input)
```

Running this query yields an error:
`assert() has failed with message: 'Length must be greater than zero'`

Example of running with valid `len` input:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/?query=H4sIAAAAAAAAA02OzQrCMBCE73mKoZc2kINaf6BSn8A3EA9pXZJiTCXZIvjz7qZVxN3LHOabGUeM1lJ73pM3bFGjcOQr13ujEKvIofNGiodAOh0jBR4N2GGmkH2hyxAZDcEE0kwBbLXHnUKfSWh/QkpJTBFlwpIQr604aU7fOCo6fx34V3SYivL5oszVRy5X600ujuKJm6VA/2vHJXWpMEXIN3+iHkjLAAAA" target="_blank">Run the query</a>

```kusto
let checkLength = (len:long, s:string)
{
    assert(len > 0, "Length must be greater than zero") and strlen(s) > len
};
datatable(input:string)
[
    '123',
    '4567'
]
| where checkLength(len=3, input)
```

**Output**

|input|
|---|
|4567|

The following query will always fail, demonstrating that the `assert` function gets evaluated even though the `where b` operator returns no data when `b` is `false`:

```kusto
let b=false;
print x="Hello"
| where b
| where assert(b, "Assertion failed")
```
