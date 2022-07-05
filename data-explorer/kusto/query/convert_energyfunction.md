---
title: convert_energy() - Azure Data Explorer
description: This article describes convert_energy() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_energy

Convert energy values from one unit to another.

## Syntax

`convert_energy(`*value*`,`*from*`,`*to*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| `value` | real | &check; | A real number |
| `from` | string | &check; | String value from the list of values |
| `to` | string  &check; |  String value from the list of values |

Possible values of `from` and `to`:

* BritishThermalUnit
* Calorie
* DecathermEc
* DecathermImperial
* DecathermUs
* ElectronVolt
* Erg
* FootPound
* GigabritishThermalUnit
* GigaelectronVolt
* Gigajoule
* GigawattDay
* GigawattHour
* HorsepowerHour
* Joule
* KilobritishThermalUnit
* Kilocalorie
* KiloelectronVolt
* Kilojoule
* KilowattDay
* KilowattHour
* MegabritishThermalUnit
* Megacalorie
* MegaelectronVolt
* Megajoule
* MegawattDay
* MegawattHour
* Millijoule
* TeraelectronVolt
* TerawattDay
* TerawattHour
* ThermEc
* ThermImperial
* ThermUs
* WattDay
* WattHour

## Returns

 Returns the input value converted from one energy unit to another.

## Examples

```kusto
print result = convert_energy(1.2, 'Joule', 'BritishThermalUnit')
```

|result|
|---|
|0.00113738054437598|
