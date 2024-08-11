---
title:  cos()
description: Learn how to use the cos() function to return the cosine of the input value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# cos()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the cosine function value of the specified angle. The angle is specified in radians.

## Syntax

`cos(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *number* | `real` |  :heavy_check_mark: | The value in radians for which to calculate the cosine. |

## Returns

The cosine of *number* of radians.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjOL9Yw1AQAT2Uc+QwAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print cos(1)
```

**Output**

|result|
|--|
|0.54030230586813977|
