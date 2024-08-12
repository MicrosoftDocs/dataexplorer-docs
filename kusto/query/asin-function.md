---
title:  asin()
description: Learn how to use the asin() function to calculate the angle from a sine input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# asin()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the angle whose sine is the specified number, or the arc sine. This is the inverse operation of [`sin()`](sin-function.md).

## Syntax

`asin(`*x*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*x* | `real` |  :heavy_check_mark:| A real number in range [-1, 1] used to calculate the arc sine.|

## Returns

Returns the value of the arc sine of `x`. Returns `null` if `x` < -1 or `x` > 1.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbFNLM7M0zDQszTVBAC0CzxqFwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
asin(0.5)
```

**Output**

|result|
|---|
|1.2532358975033751|
