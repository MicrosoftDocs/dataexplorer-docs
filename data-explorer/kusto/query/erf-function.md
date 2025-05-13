---
title:  erf()
description:  This article describes erf() function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/11/2024
---
# erf()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the [error function](https://en.wikipedia.org/wiki/Error_function) of the input.

## Syntax

`erf(`*x*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | `real` |  :heavy_check_mark: | The value for which to calculate the function. |

## Returns

Returns the error function of x.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/https%3a%2f%2fhelp.kusto.windows.net/databases/Samples?query=H4sIAAAAAAAEACtKzEtPVahQSCvKz1XQNVYoyVcwViguSS1QMOTlqlFIrShJzUtRSC1Ki69QsAXRGhWavFwAxUmYIzYAAAA%3d" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from -3 to 3 step 1
| extend erf_x = erf(x)
```

|x|erf_x|
| --- | ------ |
|-3|-0.999977909503001|
|-2|-0.995322265018953|
|-1|-0.842700792949715|
|0|0|
|1|0.842700792949715|
|2|0.995322265018953|
|3|0.999977909503001|
