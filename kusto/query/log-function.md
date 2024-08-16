---
title:  log()
description: Learn how to use the log() function to return the natural logarithm of the input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# log()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The natural logarithm is the base-e logarithm: the inverse of the natural exponential function (exp).  

## Syntax

`log(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*number*| `real` |  :heavy_check_mark: | The number for which to calculate the logarithm.|

## Returns

* `log()` returns the natural logarithm of the input.
* `null` if the argument is negative or null or can't be converted to a `real` value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNyU/XMNUEAE7U1nYTAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=log(5)
```

**Output**

|result|
|--|
|1.6094379124341003|

## Related content

* For common (base-10) logarithms, see [log10()](log10-function.md).
* For base-2 logarithms, see [log2()](log2-function.md).
