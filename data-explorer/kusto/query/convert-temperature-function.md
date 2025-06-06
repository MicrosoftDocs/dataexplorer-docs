---
title:  convert_temperature()
description: Learn how to use the convert_temperature() function to convert a temperature input value from one unit to another.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 08/11/2024
---
# convert_temperature

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts a temperature value from one unit to another.

## Syntax

`convert_temperature(`*value*`,`*from*`,`*to*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `real` |  :heavy_check_mark: | The value to be converted. |
| *from* | `string` |  :heavy_check_mark: | The unit to convert from. For possible values, see [Conversion units](#conversion-units). |
| *to* | `string` |  :heavy_check_mark: | The unit to convert to. For possible values, see [Conversion units](#conversion-units). |

### Conversion units

* DegreeCelsius
* DegreeDelisle
* DegreeFahrenheit
* DegreeNewton
* DegreeRankine
* DegreeReaumur
* DegreeRoemer
* Kelvin
* MillidegreeCelsius
* SolarTemperature

## Returns

 Returns the input value converted from one temperature unit to another. Invalid units return `null`.

## Examples

The following example demonstrates how to use the `convert_temperature()` function.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVUjOzytLLSqJL0nNLUgtSiwpLUrVMNQz0lFQ907NKcvMUweyXFLTi1JTnVNzijNLi9U1AVVJ6WxCAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = convert_temperature(1.2, 'Kelvin', 'DegreeCelsius')
```

**Output**

|result|
|---|
|-271.95|
