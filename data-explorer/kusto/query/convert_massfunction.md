---
title: convert_mass() - Azure Data Explorer
description: This article describes convert_mass() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_mass

Convert a value from one unit to another.

```kusto
convert_mass(1.6, "Kilogram", "Centigram")
```

## Syntax

`convert_mass(`*value*`,`*from*`, `*to*`)`

## Arguments

* `value`: a real number
* `from`: `string`
* `to`: `string`

Possible values of `from` and `to`: 
* Centigram
* Decagram
* Decigram
* EarthMass
* Grain
* Gram
* Hectogram
* Kilogram
* Kilopound
* Kilotonne
* LongHundredweight
* LongTon
* Megapound
* Megatonne
* Microgram
* Milligram
* Nanogram
* Ounce
* Pound
* ShortHundredweight
* ShortTon
* Slug
* SolarMass
* Stone
* Tonne

## Returns

An value converted from the `from` unit to the `to` unit.

## Examples

```kusto
print result = convert_mass(1.2, 'Kilogram', 'Centigram'),
```

