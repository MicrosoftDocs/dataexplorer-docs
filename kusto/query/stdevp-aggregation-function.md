---
title:  stdevp() (aggregation function)
description: Learn how to use the stdevp() aggregation function to calculate the standard deviation of an expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# stdevp() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the standard deviation of *expr* across the group, considering the group as a [population](https://en.wikipedia.org/wiki/Statistical_population) for a large dataset that is representative of the population.

For a small dataset that is a [sample](https://en.wikipedia.org/wiki/Sample_%28statistics%29), use [stdev() (aggregation function)](stdev-aggregation-function.md).

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Formula

This function uses the following formula.

:::image type="content" source="media/stdevp-aggfunction/stdev-population.png" alt-text="Image showing a Stdev sample formula.":::

## Syntax

`stdevp(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr* | `string` |  :heavy_check_mark: | The expression used for the standards deviation aggregation calculation. |

## Returns

Returns the standard deviation value of *expr* across the group.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzBVKC5JLVAw5KpRKC7NzU0syqxKVchNzE6Nz8ksLtGo0NQBKkhJLSsAMgEGYndiPgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 5 step 1
| summarize make_list(x), stdevp(x)
```

**Output**

|list_x|stdevp_x|
|---|---|
|[ 1, 2, 3, 4, 5]|1.4142135623731|
