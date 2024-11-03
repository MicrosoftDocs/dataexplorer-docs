---
title:  toint()
description: Learn how to use the toint() function to convert the input value to an integer number representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 10/31/2024
---
# toint()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts the input to an integer value (signed 32-bit) number representation.

> [!NOTE]
> When possible, use [int literals](scalar-data-types/int.md#int-literals) instead.

## Syntax

`toint(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar |  :heavy_check_mark: | The value to convert to an [integer](scalar-data-types/int.md).|

## Returns

If the conversion is successful, the result is an integer. Otherwise, the result is `null`. If the input includes a decimal value, the result truncate to only the integer portion.

## Example

### Convert string to integer

The following example converts a string to an integer and checks if the converted value is equal to a specific integer.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJB5IaSoZGxkqaCra2CkAGL1dNQVF%2BVmpyiYJnXklqemqRgq1CAUh1vAEA6WAHXjUAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print toint("123") == 123
|project Integer = print_0
```

**Output**

|Integer|
|--|
|true|

### Truncated integer

The following example inputs a decimal value and returns a truncated integer.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJB5IaRnrGmrxcNQVF%2BVmpySUKnnklqempRQq2CgUgRfEGAJKfIm8sAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print toint(2.3)
|project Integer = print_0
```

**Output**

|Integer|
|--|
|2|
