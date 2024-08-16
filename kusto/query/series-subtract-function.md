---
title:  series_subtract()
description: Learn how to use the series_subtract() function to calculate the element-wise subtraction of two numeric series inputs.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# series_subtract()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the element-wise subtraction of two numeric series inputs.

## Syntax

`series_subtract(`*series1*`,` *series2*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series1*, *series2* | `dynamic` |  :heavy_check_mark: | Arrays of numeric values, the second array to be element-wise subtracted from the first array.|

## Returns

A dynamic array of calculated element-wise subtract operation between the two inputs. Any non-numeric element or non-existing element, such as in the case of arrays of different sizes, yields a `null` element value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1XMMQoCMRBG4d5T/OVG0sxae5YQ4ygqbsLMCEnw8EYRF9uPx5O4nBkVJ8l3ECxjBzUuoM0TXI2XIxr2o9hiXqkPal8qkq+cDEoDS0y3EEVim6pvvjsPnf+9ezSP6tabUtDHwSQmC59aWS6sP5yU3hv3Ar+CKt2tAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 3 step 1
| extend y = x * 2
| extend z = y * 2
| project s1 = pack_array(x,y,z), s2 = pack_array(z, y, x)
| extend s1_subtract_s2 = series_subtract(s1, s2)
```

**Output**

|s1|s2|s1_subtract_s2|
|---|---|---|
|[1,2,4]|[4,2,1]|[-3,0,3]|
|[2,4,8]|[8,4,2]|[-6,0,6]|
|[3,6,12]|[12,6,3]|[-9,0,9]|
