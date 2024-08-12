---
title:  loggamma()
description: Learn how to use the loggamma() function to compute the log of the absolute value of the gamma function.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# loggamma()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Computes log of the absolute value of the [gamma function](https://en.wikipedia.org/wiki/Gamma_function)

## Syntax

`loggamma(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*number*| `real` |  :heavy_check_mark: | The number for which to calculate the gamma.|

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNyU9PT8zNTdQw1QQAjpO9/xgAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=loggamma(5)
```

**Output**

|result|
|--|
|3.1780538303479458|

## Returns

* Returns the natural logarithm of the absolute value of the gamma function of x.
* For computing gamma function, see [gamma()](gamma-function.md).
