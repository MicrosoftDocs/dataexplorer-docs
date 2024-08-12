---
title:  isascii()
description: Learn how to use the isascii() to check if the argument is a valid ascii string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# isascii()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns `true` if the argument is a valid ASCII string.

## Syntax

`isascii(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
|*value*| `string` | :heavy_check_mark:| The value to check if a valid ASCII string.|

## Returns

A boolean value indicating whether *value* is a valid ASCII string.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNLE4sTs7M1FAqzs9NVSguAcqlK2kCAIfayAkjAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=isascii("some string")
```

**Output**

|result|
|--|
|true|
