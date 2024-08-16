---
title:  variance() (aggregation function)
description: Learn how to use the variance() aggregation function to calculate the sample variance of the expression across the group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/13/2023
---
# variance() (aggregation function)

Calculates the variance of *expr* across the group, considering the group as a [sample](https://en.wikipedia.org/wiki/Sample_%28statistics%29).

[!INCLUDE [ignore-nulls](../../includes/ignore-nulls.md)]

The following formula is used:

:::image type="content" source="media/variance-aggfunction/variance-sample.png" alt-text="Image showing a variance sample formula.":::

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`variance(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr* | `real` |  :heavy_check_mark: | The expression used for the variance calculation.|

## Returns

Returns the variance value of *expr* across the group.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzBVKC5JLVAw5KpRKC7NzU0syqxKVchNzE6Nz8ksLtGo0NRRKAMKJuYlpwI5ADQ5+T5AAAAA" target="_blank">Run the query</a>

```kusto
range x from 1 to 5 step 1
| summarize make_list(x), variance(x) 
```

**Output**

|list_x|variance_x|
|---|---|
|[ 1, 2, 3, 4, 5]|2.5|
