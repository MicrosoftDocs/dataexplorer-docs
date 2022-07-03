---
title: convert_energy() - Azure Data Explorer
description: This article describes convert_energy() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_energy

Convert a value from one unit to another.

```kusto
convert_energy(1.6, "Joule", "BritishThermalUnit")
```

## Syntax

`convert_energy(`*value*`,`*from*`, `*to*`)`

## Arguments

* `value`: a real number
* `from`: `string`
* `to`: `string`

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

An value converted from the `from` unit to the `to` unit.

## Examples

```kusto
print result = convert_energy(1.2, 'Joule', 'BritishThermalUnit'),
```

