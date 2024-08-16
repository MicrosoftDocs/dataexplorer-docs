---
title:  convert_length()
description: Learn how to use the convert_length() function to convert a length input value from one unit to another.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 08/11/2024
---
# convert_length

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Convert a length value from one unit to another.

## Syntax

`convert_length(`*value*`,`*from*`,`*to*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `real` |  :heavy_check_mark: | The value to be converted. |
| *from* | `string` |  :heavy_check_mark: | The unit to convert from. For possible values, see [Conversion units](#conversion-units). |
| *to* | `string` |  :heavy_check_mark: | The unit to convert to. For possible values, see [Conversion units](#conversion-units). |

### Conversion units

* Angstrom
* AstronomicalUnit
* Centimeter
* Chain
* DataMile
* Decameter
* Decimeter
* DtpPica
* DtpPoint
* Fathom
* Foot
* Hand
* Hectometer
* Inch
* KilolightYear
* Kilometer
* Kiloparsec
* LightYear
* MegalightYear
* Megaparsec
* Meter
* Microinch
* Micrometer
* Mil
* Mile
* Millimeter
* Nanometer
* NauticalMile
* Parsec
* PrinterPica
* PrinterPoint
* Shackle
* SolarRadius
* Twip
* UsSurveyFoot
* Yard

## Returns

 Returns the input value converted from one length unit to another. Invalid units return `null`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVUjOzytLLSqJz0nNSy/J0DDUM9JRUPdNLUktUgcy3PLzS9Q1AWLmFfkzAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = convert_length(1.2, 'Meter', 'Foot')
```

**Output**

|result|
|---|
|3.93700787401575|
