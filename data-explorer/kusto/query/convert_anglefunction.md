---
title: convert_angle() - Azure Data Explorer
description: This article describes convert_angle() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_angle

Convert a value from one unit to another.

```kusto
convert_angle(1.6, "Degree", "Arcminute")
```

## Syntax

`convert_angle(`*value*`,`*from*`, `*to*`)`

## Arguments

* `value`: a real number
* `from`: `string`
* `to`: `string`

Possible values of `from` and `to`: 
* Arcminute
* Arcsecond
* Centiradian
* Deciradian
* Degree
* Gradian
* Microdegree
* Microradian
* Millidegree
* Milliradian
* Nanodegree
* Nanoradian
* NatoMil
* Radian
* Revolution
* Tilt

## Returns

An value converted from the `from` unit to the `to` unit.

## Examples

```kusto
print result = convert_angle(1.2, 'Degree', 'Arcminute'),
```

