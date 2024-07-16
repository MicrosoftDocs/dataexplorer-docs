---
title:  array_length()
description: Learn how to use the array_length() function to calculate the number of elements in a dynamic array.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/20/2022
---
# array_length()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the number of elements in a dynamic array.

> **Deprecated aliases:** arraylength()

## Syntax

`array_length(`*array*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *array* | `dynamic` |  :heavy_check_mark: | The array for which to calculate length.

## Returns

Returns the number of elements in *array*, or `null` if *array* isn't an array.

## Examples

The following example shows the number of elements in the array.

:::moniker range="azure-data-explorer"
:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKkqsjM9JzUsvydAoSCwqTo3PKs7P01CPNtRRMNJRMNZRUErLLy1SilXX1AQAe4KK2TMAAAA=" target="_blank">Run the query</a>
:::moniker-end
```kusto
print array_length(dynamic([1, 2, 3, "four"]))
```

**Output**

|print_0|
|--|
|4|
