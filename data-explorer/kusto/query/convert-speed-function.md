---
title:  convert_speed()
description: Learn how to use the convert_speed() function to convert a speed input value from one unit to another.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 08/11/2024
---
# convert_speed

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts a speed value from one unit to another.

## Syntax

`convert_speed(`*value*`,`*from*`,`*to*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `real` |  :heavy_check_mark: | The value to be converted. |
| *from* | `string` |  :heavy_check_mark: | The unit to convert from. For possible values, see [Conversion units](#conversion-units).|
| *to* | `string` |  :heavy_check_mark: | The unit to convert to. For possible values, see [Conversion units](#conversion-units). |

### Conversion units

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

 Returns the input value converted from one speed unit to another. Invalid units return `null`.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVUjOzytLLSqJLy5ITU3RMNQz0lFQ900tSS0KSC0KTgXKpqgDRZxT80oyc6HCHvmlReqaAK/HOJBIAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = convert_speed(1.2, 'MeterPerSecond', 'CentimeterPerHour')
```

**Output**

|result|
|---|
|432000|
