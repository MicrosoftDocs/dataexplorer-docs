---
title:  gamma()
description: Learn how to use the gamma() function to compute the gamma of the input parameter.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# gamma()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Computes the gamma function for the provided *number*.

## Syntax

`gamma(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *number* | `real` |  :heavy_check_mark: | The number used to calculate the gamma function. |

## Returns

Gamma function of *number*.

## Examples

The following example shows how to use the `gamma()` function to compute the gamma of the input parameter.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVUhPzM1N1DDVBABf6u5FFwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = gamma(5)
```

Output:

| result |
|--------|
| 24     |

## Related content

For computing log-gamma function, see [loggamma()](loggamma-function.md).
