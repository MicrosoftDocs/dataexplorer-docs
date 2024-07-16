---
title:  binary_not()
description: Learn how to use the binary_not() function to return a bitwise negation of the input value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/21/2022
---
# binary_not()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a bitwise negation of the input value.

## Syntax

`binary_not(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `long` |  :heavy_check_mark: | The value to negate. |

## Returns

Returns logical NOT operation on a number: value.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjKzEssqozPyy/RMDQw0AQAChXSgRUAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
binary_not(100)
```

**Output**

|result|
|------|
|-101|
