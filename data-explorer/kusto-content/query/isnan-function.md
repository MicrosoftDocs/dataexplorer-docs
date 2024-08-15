---
title:  isnan()
description: Learn how to use the isnan() function to check if the input is a not-a-number (NaN) value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# isnan()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns whether the input is a Not-a-Number (NaN) value.  

## Syntax

`isnan(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
|*number*|scalar| :heavy_check_mark:| The value to check if NaN.|

## Returns

`true` if x is NaN and `false` otherwise.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1XQNVQoyVcwVCguSS1QMOTlqlFIrShJzUtRqFSwVdDQNdSq0FRAEk3JLAOKG+oZaFXoVyKJZxbnJebZgkkNoBpNAG+vyvhkAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from -1 to 1 step 1
| extend y = (-1*x) 
| extend div = 1.0*x/y
| extend isnan=isnan(div)
```

**Output**

|x|y|div|isnan|
|---|---|---|---|
|-1|1|-1|false|
|0|0|NaN|true|
|1|-1|-1|false|

## Related content

* To check if a value is null, see [isnull()](isnull-function.md).
* To check if a value is finite, see [isfinite()](isfinite-function.md).
* To check if a value is infinite, see [isinf()](isinf-function.md).
