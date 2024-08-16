---
title:  convert_mass()
description: Learn how to use the convert_mass() function to convert a mass input value from one unit to another.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 08/11/2024
---
# convert_mass

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Convert a mass value from one unit to another.

## Syntax

`convert_mass(`*value*`,`*from*`,`*to*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `real` |  :heavy_check_mark: | The value to be converted. |
| *from* | `string` |  :heavy_check_mark: | The unit to convert from. For possible values, see [Conversion units](#conversion-units). |
| *to* | `string` |  :heavy_check_mark: | The unit to convert to. For possible values, see [Conversion units](#conversion-units). |

### Conversion units

* Centigram
* Decagram
* Decigram
* EarthMass
* Grain
* Gram
* Hectogram
* Kilogram
* Kilopound
* Kilotonne
* LongHundredweight
* LongTon
* Megapound
* Megatonne
* Microgram
* Milligram
* Nanogram
* Ounce
* Pound
* ShortHundredweight
* ShortTon
* Slug
* SolarMass
* Stone
* Tonne

## Returns

 Returns the input value converted from one mass unit to another. Invalid units return `null`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVUjOzytLLSqJz00sLtYw1DPSUVD3zszJTy9KzFUHsgPyS/NS1DUBemVMijUAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = convert_mass(1.2, 'Kilogram', 'Pound')
```

**Output**

|result|
|---|
|2.64554714621853|
