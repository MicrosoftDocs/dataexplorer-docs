---
title:  pow()
description: Learn how to use the pow() function to calculate the base raised to the power of the exponent.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# pow()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a result of raising to power

## Syntax

`pow(`*base*`,` *exponent* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *base*| int, real, or long |  :heavy_check_mark: | The base value.|
| *exponent*| int, real, or long |  :heavy_check_mark: | The exponent value.|

## Returns

Returns base raised to the power exponent: base ^ exponent.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbEtyC/XMNJRMNYEAGG04SkWAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=pow(2, 3)
```

**Output**

|result|
|--|
|8|
