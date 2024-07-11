---
title:  toint()
description: Learn how to use the toint() function to convert the input value to an integer number representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/22/2023
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

If the conversion is successful, the result will be an integer. Otherwise, the result will be `null`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJB5IaSoZGxkqaCra2CkAGAO190RQZAAAA" target="_blank">Run the query</a>
:::moniker-end

```kusto
print toint("123") == 123
```

**Output**

|print_0|
|--|
|true|
