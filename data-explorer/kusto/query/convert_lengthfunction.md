---
title: convert_length() - Azure Data Explorer
description: This article describes convert_length() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_length

Convert a value from one unit to another.

```kusto
convert_length(1.6, "Meter", "Angstrom")
```

## Syntax

`convert_length(`*value*`,`*from*`, `*to*`)`

## Arguments

* `value`: a real number
* `from`: `string`
* `to`: `string`

Possible values of `from` and `to`: 
* Angstrom
* AstronomicalUnit
* Centimeter
* Chain
* DataMile
* Decameter
* Decimeter
* DtpPica
* DtpPoint
* Fathom
* Foot
* Hand
* Hectometer
* Inch
* KilolightYear
* Kilometer
* Kiloparsec
* LightYear
* MegalightYear
* Megaparsec
* Meter
* Microinch
* Micrometer
* Mil
* Mile
* Millimeter
* Nanometer
* NauticalMile
* Parsec
* PrinterPica
* PrinterPoint
* Shackle
* SolarRadius
* Twip
* UsSurveyFoot
* Yard

## Returns

An value converted from the `from` unit to the `to` unit.

## Examples

```kusto
print result = convert_length(1.2, 'Meter', 'Angstrom'),
```

