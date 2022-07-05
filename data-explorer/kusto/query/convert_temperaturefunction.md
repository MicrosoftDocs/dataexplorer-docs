---
title: convert_temperature() - Azure Data Explorer
description: This article describes convert_temperature() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_temperature

Convert a temperature value from one unit to another.

## Syntax

`convert_temperature(`*value*`,`*from*`,`*to*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| `value` | real | &check; | A real number |
| `from` | string | &check; | String value from the list of values |
| `to` | string  &check; |  String value from the list of values |

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

 Returns the input value converted from one temperature unit to another.

## Examples

```kusto
print result = convert_temperature(1.2, 'Kelvin', 'DegreeCelsius')
```

|result|
|---|
|0.00439319055464031|
