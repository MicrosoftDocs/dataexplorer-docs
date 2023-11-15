---
title:  stdev() (aggregation function)
description: Learn how to use the stdev() aggregation function to calculate the standard deviation of an expression using Bessel's correction.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/13/2023
---
# stdev() (aggregation function)

Calculates the standard deviation of *expr* across the group, using [Bessel's correction](https://en.wikipedia.org/wiki/Bessel's_correction) for a small dataset that is considered a [sample](https://en.wikipedia.org/wiki/Sample_%28statistics%29).

[!INCLUDE [ignore-nulls](../../includes/ignore-nulls.md)]

For a large dataset that is representative of the population, use [stdevp() (aggregation function)](stdevp-aggfunction.md).

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Formula

This function uses the following formula.

:::image type="content" source="images/stdev-aggfunction/stdev-sample.png" alt-text="Image showing a Stdev sample formula.":::

## Syntax

`stdev(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | string | &check; | The expression used for the standard deviation aggregation calculation. |

## Returns

Returns the standard deviation value of *expr* across the group.

## Example

The following example shows the standard deviation for the group.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzBVKC5JLVAw5KpRKC7NzU0syqxKVchNzE6Nz8ksLtGo0NQBKkhJLQOyAG3qbWE9AAAA" target="_blank">Run the query</a>

```kusto
range x from 1 to 5 step 1
| summarize make_list(x), stdev(x)
```

**Output**

|list_x|stdev_x|
|---|---|
|[ 1, 2, 3, 4, 5]|1.58113883008419|
