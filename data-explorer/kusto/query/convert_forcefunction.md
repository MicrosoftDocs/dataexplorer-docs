---
title: convert_force() - Azure Data Explorer
description: This article describes convert_force() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_force

Convert force values from one unit to another.

## Syntax

`convert_force(`*value*`,`*from*`,`*to*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| `value` | real | &check; | A real number |
| `from` | string | &check; | String value from the list of values |
| `to` | string  &check; |  String value from the list of values |

Possible values of `from` and `to`:

* Decanewton
* Dyn
* KilogramForce
* Kilonewton
* KiloPond
* KilopoundForce
* Meganewton
* Micronewton
* Millinewton
* Newton
* OunceForce
* Poundal
* PoundForce
* ShortTonForce
* TonneForce

## Returns

Returns the input value converted from one force unit to another.

## Examples

```kusto
print result = convert_force(1.2, 'Newton', 'Decanewton')
```

|result|
|---|
|0.12|
