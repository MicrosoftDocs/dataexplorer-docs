---
title:  log10()
description: Learn how to use the log10() function to return the common (base-10) logarithm of the input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# log10()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

`log10()` returns the common (base-10) logarithm of the input.

## Syntax

`log10(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*number*| `real` |  :heavy_check_mark: | The number for which to calculate the base-10 logarithm.|

## Returns

* The common logarithm is the base-10 logarithm: the inverse of the exponential function (exp) with base 10.
* `null` if the argument is negative or null or can't be converted to a `real` value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNyU83NNAw1QQAQyXyFRUAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=log10(5)
```

**Output**

|result|
|--|
|0.69897000433601886|

## Related content

* For natural (base-e) logarithms, see [log()](log-function.md).
* For base-2 logarithms, see [log2()](log2-function.md)