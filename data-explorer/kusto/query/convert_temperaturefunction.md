---
title: convert_temperature() - Azure Data Explorer
description: This article describes convert_temperature() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_temperature

Convert a value from one unit to another.

```kusto
convert_temperature(1.6, "Kelvin", "DegreeCelsius")
```

## Syntax

`convert_temperature(`*value*`,`*from*`, `*to*`)`

## Arguments

* `value`: a real number
* `from`: `string`
* `to`: `string`

Possible values of `from` and `to`: 
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

An value converted from the `from` unit to the `to` unit.

## Examples

```kusto
print result = convert_temperature(1.2, 'Kelvin', 'DegreeCelsius'),
```

