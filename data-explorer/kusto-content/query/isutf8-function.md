---
title:  isutf8()
description: Learn how to use the isutf8() function to check if the argument is a valid utf8 string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# isutf8()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns `true` if the argument is a valid UTF8 string.

## Syntax

`isutf8(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
|*value*| `string` | :heavy_check_mark:| The value to check if a valid UTF8 string.|

## Returns

A boolean value indicating whether *value* is a valid UTF8 string.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNLC4tSbPQUCrOz01VKC4BSqUraQIA1zBdDCIAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=isutf8("some string")
```
