---
title: convert_angle() - Azure Data Explorer
description: This article describes convert_angle() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_angle

Convert angle values from one unit to another.

## Syntax

`convert_angle(`*value*`,`*from*`,`*to*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| `value` | real | &check; | A real number |
| `from` | string | &check; | String value from the list of values |
| `to` | string  &check; |  String value from the list of values |

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

 Returns the input value converted from one angle unit to another.

## Examples

```kusto
print result = convert_angle(1.2, 'Degree', 'Arcminute')
```

|result|
|---|
|72|
