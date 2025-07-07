---
title:  binary_and()
description: Learn how to use the binary_and() function to compare bits in corresponding operands. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# binary_and()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Performs a bitwise `AND` operation on two values. 

## Syntax

`binary_and(`*value1*`,`*value2*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value1* | `long` |  :heavy_check_mark: | The left-hand value of the bitwise `AND` operation. |
| *value2* | `long` |  :heavy_check_mark: | The right-hand value of the bitwise `AND` operation. |

## Returns

Returns the result of a bitwise `AND` operation between `value1` and `value2`.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVUjKzEssqoxPzEvRMNNRMNYEAFZU7dsfAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = binary_and(6, 3)
```

Output:

```
2
```
