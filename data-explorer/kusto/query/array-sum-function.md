---
title:  array_sum()
description: Learn how to use the array_sum() function to calculate the sum of elements in a dynamic array.

ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# array_sum()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the sum of elements in a dynamic array.

## Syntax

`array_sum`(*array*)

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *array*| `dynamic` |  :heavy_check_mark:| The array to sum.|

## Returns

Returns a double type value with the sum of the elements of the array.

> [!NOTE]
> If the array contains elements of non-numeric types, the result is `null`.

## Example

The following example shows the sum of an array.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1og21DHSMdYxidVU4OWqUUitKEnNSwGpiC8uzbUF0omVIJYGkKUJANbCqMA+AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic([1,2,3,4]) 
| extend arr_sum=array_sum(arr)
```

**Output**

|arr|arr_sum|
|---|---|
|[1,2,3,4]|10|
