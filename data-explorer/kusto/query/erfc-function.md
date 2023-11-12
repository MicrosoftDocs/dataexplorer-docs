---
title:  erfc()
description: This article describes erfc() function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 11/12/2023
---
# erfc()

Returns the [complementary error function](https://en.wikipedia.org/wiki/Error_function) of the input.

## Syntax

`erfc(`*x*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | real | &check; | The value for which to calculate the function. |

## Returns

Complementary error function of x.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/https%3a%2f%2fhelp.kusto.windows.net/databases/Samples?query=H4sIAAAAAAAEACtKzEtPVahQSCvKz1XQNVYoyVcwViguSS1QMOTlqlFIrShJzUtRSC1KS46vULAFMzQqNHm5ALKG5EY4AAAA"_blank">Run the query</a>

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
