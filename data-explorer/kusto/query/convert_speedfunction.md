---
title: convert_speed() - Azure Data Explorer
description: This article describes convert_speed() in Azure Data Explorer.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 07/03/2022
---
# convert_speed

Convert a value from one unit to another.

```kusto
convert_speed(1.6, "MeterPerSecond", "CentimeterPerHour")
```

## Syntax

`convert_speed(`*value*`,`*from*`, `*to*`)`

## Arguments

* `value`: a real number
* `from`: `string`
* `to`: `string`

Possible values of `from` and `to`: 
* CentimeterPerHour
* CentimeterPerMinute
* CentimeterPerSecond
* DecimeterPerMinute
* DecimeterPerSecond
* FootPerHour
* FootPerMinute
* FootPerSecond
* InchPerHour
* InchPerMinute
* InchPerSecond
* KilometerPerHour
* KilometerPerMinute
* KilometerPerSecond
* Knot
* MeterPerHour
* MeterPerMinute
* MeterPerSecond
* MicrometerPerMinute
* MicrometerPerSecond
* MilePerHour
* MillimeterPerHour
* MillimeterPerMinute
* MillimeterPerSecond
* NanometerPerMinute
* NanometerPerSecond
* UsSurveyFootPerHour
* UsSurveyFootPerMinute
* UsSurveyFootPerSecond
* YardPerHour
* YardPerMinute
* YardPerSecond

## Returns

An value converted from the `from` unit to the `to` unit.

## Examples

```kusto
print result = convert_speed(1.2, 'MeterPerSecond', 'CentimeterPerHour'),
```

