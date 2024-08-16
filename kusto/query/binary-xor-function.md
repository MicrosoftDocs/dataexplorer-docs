---
title:  binary_xor()
description: Learn how to use the binary_xor() function to perform the bitwise xor operation on a pair of values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# binary_xor()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a result of the bitwise `xor` operation of the two values.

## Syntax

`binary_xor(`*value1*`,`*value2*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value1* | `int` |  :heavy_check_mark: | The left-side value of the XOR operation. |
| *value2* | `int` |  :heavy_check_mark: | The right-side value of the XOR operation. |

## Returns

Returns logical XOR operation on a pair of numbers: value1 ^ value2.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswr0UjKzEssqoyvyC/SMNQx1NQEAKWP8zEWAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
binary_xor(1,1)
```

**Output**

|Result|
|------|
|0 |

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswr0UjKzEssqoyvyC/SMNQx0tQEAPwxtTMWAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
binary_xor(1,2)
```

**Output**

|Result|
|------|
|3 |
