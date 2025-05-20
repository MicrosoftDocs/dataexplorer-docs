---
title:  series_product()
description: Learn how to use the series_product() function to calculate the product of series elements.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 04/08/2025
---
# series_product()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the product of series elements.

## Syntax

`series_product(`*series*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *series* | `dynamic` |  :heavy_check_mark: | Array of numeric values. |

## Returns

Returns a double type value with the product of the elements of the array.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYxidVU4KpRSK0oSc1LUShOLcpMLY4vKMpPKU0usUXlagC1awIA6jpTLkkAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic([1,2,3,4]) 
| extend series_product=series_product(arr)
```

**Output**

|s1|series_product|
|---|---|
|[1,2,3,4]|24|
