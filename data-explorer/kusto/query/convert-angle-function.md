---
title:  convert_angle()
description: Learn how to use the convert_angle() function to convert an angle input value from one unit to another.
ms.reviewer: itsagui
ms.topic: reference
ms.date: 08/11/2024
---
# convert_angle

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts an angle value from one unit to another.

## Syntax

`convert_angle(`*value*`,`*from*`,`*to*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| `value` | `real` |  :heavy_check_mark: | The value to be converted. |
| `from` | `string` |  :heavy_check_mark: | The unit to convert from. For possible values, see [Conversion units](#conversion-units). |
| `to` | `string` |  :heavy_check_mark: | The unit to convert to. For possible values, see [Conversion units](#conversion-units). |

### Conversion units

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

 Returns the input value converted from one angle unit to another. Invalid units return `null`.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href=" https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVUjOzytLLSqJT8xLz0nVMNQz0lFQd0lNL0pNVQeyHIuSczPzSktS1TUBit/6iDgAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = convert_angle(1.2, 'Degree', 'Arcminute')
```

**Output**

|result|
|---|
|72|
