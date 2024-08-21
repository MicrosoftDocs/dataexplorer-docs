---
title:  binary_shift_right()
description: Learn how to use the binary_shift_right() function to perform a binary shift right operation on a pair of numbers.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# binary_shift_right()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns binary shift right operation on a pair of numbers.

## Syntax

`binary_shift_right(`*value*`,`*shift*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `int` |  :heavy_check_mark: | The value to shift right. |
| *shift* | `int` |  :heavy_check_mark: | The number of bits to shift right. |

## Returns

Returns binary shift right operation on a pair of numbers: value >> (shift%64).
If n is negative, a NULL value is returned.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswr0UjKzEssqowvzshMK4kvykzPKNEw1DHS1AQAd48PPR4AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
binary_shift_right(1,2)
```

**Output**

|Result|
|------|
|0 |
