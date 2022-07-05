---
title: convert_mass() - Azure Data Explorer
description: This article describes convert_mass() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_mass

Convert a mass value from one unit to another.

## Syntax

`convert_mass(`*value*`,`*from*`,`*to*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| `value` | real | &check; | A real number |
| `from` | string | &check; | String value from the list of values |
| `to` | string  &check; |  String value from the list of values |

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

 Returns the input value converted from one mass unit to another.

## Examples

```kusto
print result = convert_mass(1.2, 'Kilogram', 'Pound')
```

|result|
|---|
|2.64554714621853|
