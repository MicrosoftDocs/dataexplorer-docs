---
title:  erfc()
description:  This article describes erfc() function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 08/11/2024
---
# erfc()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the [complementary error function](https://en.wikipedia.org/wiki/Error_function) of the input.

## Syntax

`erfc(`*x*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | `real` |  :heavy_check_mark: | The value for which to calculate the function. |

## Returns

Complementary error function of x.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/https%3a%2f%2fhelp.kusto.windows.net/databases/Samples?query=H4sIAAAAAAAEACtKzEtPVahQSCvKz1XQNVYoyVcwViguSS1QMOTlqlFIrShJzUtRSC1KS46vULAFMzQqNHm5ALKG5EY4AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from -3 to 3 step 1
| extend erf_x = erfc(x)
```

|x|erf_x|
| --- | ------ |
|-3|1.999977909503001|
|-2|1.995322265018953|
|-1|1.842700792949715|
|0|1|
|1|0.157299207050285|
|2|0.00467773498104727|
|3|2.20904969985854E-05|
