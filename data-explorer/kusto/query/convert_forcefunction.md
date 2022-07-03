---
title: convert_force() - Azure Data Explorer
description: This article describes convert_force() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_force

Convert a value from one unit to another.

```kusto
convert_force(1.6, "Newton", "Decanewton")
```

## Syntax

`convert_force(`*value*`,`*from*`, `*to*`)`

## Arguments

* `value`: a real number
* `from`: `string`
* `to`: `string`

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

An value converted from the `from` unit to the `to` unit.

## Examples

```kusto
print result = convert_force(1.2, 'Newton', 'Decanewton'),
```

