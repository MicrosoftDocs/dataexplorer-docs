---
title:  isfinite()
description: Learn how to use the isfinite() function to check if the input is a finite value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/03/2023
---
# isfinite()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns whether the input is a finite value, meaning it's not infinite or NaN.

## Syntax

`isfinite(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*number*| `real` | :heavy_check_mark:| The value to check if finite.|

## Returns

`true` if x is finite and `false` otherwise.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1XQNVQoyVcwVCguSS1QMOTlqlFIrShJzUtRqFSwVTDQM0ASScksA4oZ6hloVehXIolnFqdl5mWWpNrCGBpAlZoAbqyHpGYAAAA=" target="_blank">Run the query</a>
:::moniker-end

```kusto
range x from -1 to 1 step 1
| extend y = 0.0
| extend div = 1.0*x/y
| extend isfinite=isfinite(div)
```

**Output**

|x|y|div|isfinite|
|---|---|---|---|
|-1|0|-∞|0|
|0|0|NaN|0|
|1|0|∞|0|

## Related content

* To check if a value is null, see [isnull()](isnull-function.md).
* To check if a value is infinite, see [isinf()](isinf-function.md).
* To check if a value is NaN (Not-a-Number), see [isnan()](isnan-function.md).
