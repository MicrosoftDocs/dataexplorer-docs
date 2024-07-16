---
title:  binary_shift_left()
description: Learn how to use the binary_shift_left() function to perform a binary shift left operation on a pair of numbers. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/21/2022
---
# binary_shift_left()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns binary shift left operation on a pair of numbers.

## Syntax

`binary_shift_left(`*value*`,`*shift*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `int` |  :heavy_check_mark: | The value to shift left. |
| *shift* | `int` |  :heavy_check_mark: | The number of bits to shift left. |

## Returns

Returns binary shift left operation on a pair of numbers: value << (shift%64).
If n is negative, a NULL value is returned.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswr0UjKzEssqowvzshMK4nPSU0r0TDUMdLUBADck7ZgHQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
binary_shift_left(1,2)
```

**Output**

|Result|
|------|
|4 |
