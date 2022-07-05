---
title: convert_volume() - Azure Data Explorer
description: This article describes convert_volume() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_volume

Convert a volume value from one unit to another.

## Syntax

`convert_volume(`*value*`,`*from*`,`*to*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| `value` | real | &check; | A real number |
| `from` | string | &check; | String value from the list of values |
| `to` | string  &check; |  String value from the list of values |

Possible values of `from` and `to`:

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

Returns the input value converted from one volume unit to another.

## Examples

```kusto
print result = convert_volume(1.2, 'CubicMeter', 'AcreFoot')
```

|result|
|---|
|0.0009728568|
