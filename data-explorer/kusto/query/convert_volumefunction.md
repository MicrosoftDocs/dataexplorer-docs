---
title: convert_volume() - Azure Data Explorer
description: This article describes convert_volume() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_volume

Convert a value from one unit to another.

```kusto
convert_volume(1.6, "CubicMeter", "AcreFoot")
```

## Syntax

`convert_volume(`*value*`,`*from*`, `*to*`)`

## Arguments

* `value`: a real number
* `from`: `string`
* `to`: `string`

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

An value converted from the `from` unit to the `to` unit.

## Examples

```kusto
print result = convert_volume(1.2, 'CubicMeter', 'AcreFoot'),
```

