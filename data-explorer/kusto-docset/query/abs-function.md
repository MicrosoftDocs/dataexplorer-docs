---
title:  abs()
description: Learn how to use the abs() function to calculate the absolute value of an input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# abs()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the absolute value of the input.

## Syntax

`abs(`*x*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | int, real, or timespan |  :heavy_check_mark: | The value to make absolute. |

## Returns

Absolute value of x.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhMKtbQNdUEADsyYK4NAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print abs(-5)
```

**Output**

|print_0|
|------|
|5|
