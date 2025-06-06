---
title:  convert_volume()
description: Learn how to use the convert_volume() function to convert a volume input value from one unit to another.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 08/11/2024
---
# convert_volume

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts a volume value from one unit to another.

## Syntax

`convert_volume(`*value*`,`*from*`,`*to*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `real` |  :heavy_check_mark: | The value to be converted. |
| *from* | `string` |  :heavy_check_mark: | The unit to convert from. For possible values, see [Conversion units](#conversion-units). |
| *to* | `string` |  :heavy_check_mark: | The unit to convert to. For possible values, see [Conversion units](#conversion-units). |

### Conversion units

* AcreFoot
* AuTablespoon
* BoardFoot
* Centiliter
* CubicCentimeter
* CubicDecimeter
* CubicFoot
* CubicHectometer
* CubicInch
* CubicKilometer
* CubicMeter
* CubicMicrometer
* CubicMile
* CubicMillimeter
* CubicYard
* Decaliter
* DecausGallon
* Deciliter
* DeciusGallon
* HectocubicFoot
* HectocubicMeter
* Hectoliter
* HectousGallon
* ImperialBeerBarrel
* ImperialGallon
* ImperialOunce
* ImperialPint
* KilocubicFoot
* KilocubicMeter
* KiloimperialGallon
* Kiloliter
* KilousGallon
* Liter
* MegacubicFoot
* MegaimperialGallon
* Megaliter
* MegausGallon
* MetricCup
* MetricTeaspoon
* Microliter
* Milliliter
* OilBarrel
* UkTablespoon
* UsBeerBarrel
* UsCustomaryCup
* UsGallon
* UsLegalCup
* UsOunce
* UsPint
* UsQuart
* UsTablespoon
* UsTeaspoon

## Returns

Returns the input value converted from one volume unit to another. Invalid units return `null`.

## Examples

The following example demonstrates how to use the `convert_volume()` function.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVUjOzytLLSqJL8vPKc1N1TDUM9JRUHcuTcpM9k0tSS1SB/Ick4tS3fLzS9Q1Abo7scQ8AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = convert_volume(1.2, 'CubicMeter', 'AcreFoot')
```

**Output**

|result|
|---|
|0.0009728568|
