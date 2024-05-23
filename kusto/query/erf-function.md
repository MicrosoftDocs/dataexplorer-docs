---
title:  erf()
description: This article describes erf() function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 11/12/2023
---
# erf()

Returns the [error function](https://en.wikipedia.org/wiki/Error_function) of the input.

## Syntax

`erf(`*x*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | `real` |  :heavy_check_mark: | The value for which to calculate the function. |

## Returns

Error function of x.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/https%3a%2f%2fhelp.kusto.windows.net/databases/Samples?query=H4sIAAAAAAAEACtKzEtPVahQSCvKz1XQNVYoyVcwViguSS1QMOTlqlFIrShJzUtRSC1Ki69QsAXRGhWavFwAxUmYIzYAAAA%3d" target="_blank">Run the query</a>

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
