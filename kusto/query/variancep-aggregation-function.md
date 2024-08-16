---
title:  variancep() (aggregation function)
description: Learn how to use the variancep() aggregation function to calculate the population variance of an expression across the group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# variancep() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the variance of *expr* across the group, considering the group as a [population](https://en.wikipedia.org/wiki/Statistical_population).

The following formula is used:

:::image type="content" source="media/variancep-aggfunction/variance-population.png" alt-text="Image showing a variance sample formula." :::

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`variancep(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr* | `string` |  :heavy_check_mark: | The expression to use for the variance calculation.|

## Returns

Returns the variance value of *expr* across the group.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzBVKC5JLVAw5KpRKC7NzU0syqxKVchNzE6Nz8ksLtGo0NRRKAMKJuYlpxYAeQCFH59wQQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 5 step 1
| summarize make_list(x), variancep(x) 
```

**Output**

|list_x|variance_x|
|---|---|
|[ 1, 2, 3, 4, 5]|2|
