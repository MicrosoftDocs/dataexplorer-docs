---
title:  make_list_with_nulls() (aggregation function)
description:  Learn how to use the make_list_with_nulls() aggregation function to create a `dynamic` JSON object (array) which includes null values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# make_list_with_nulls() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a `dynamic` array of all the values of *expr* in the group, including null values.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`make_list_with_nulls(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `string` |  :heavy_check_mark: | The expression that to use to create the array. |

## Returns

Returns a `dynamic` JSON object (array) of all the values of *expr* in the group, including null values.
If the input to the `summarize` operator isn't sorted, the order of elements in the resulting array is undefined.
If the input to the `summarize` operator is sorted, the order of elements in the resulting array tracks that of the input.

> [!TIP]
> Use the [`array_sort_asc()`](array-sort-asc-function.md) or [`array_sort_desc()`](array-sort-desc-function.md) function to create an ordered list by some key.

## Example

The following example shows null values in the results.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz3PywqDMBAF0H2+YnCl4KKFPi1d9TNKkVQHDU0mNhnpg358E4zObIZzZ3M1MvheDujhDK3ksHeNkJM0WHl2ijoowasWL3YkrkARF+IqIEwWYkmdxqyMnNOodVFOkX+O0sVgk8Bhw/PzbAMSy85SoG2iHt9JdosM89M+kW1mOSQhS0mOSVpskqxX4nYSU0nxAz8aI536IpiPVp5DbyMfWMe7finu69jD50vn4g++V3ROJAEAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let shapes = datatable (name:string , sideCount: int)
[
    "triangle", int(null),
    "square", 4,
    "rectangle", 4,
    "pentagon", 5,
    "hexagon", 6,
    "heptagon", 7,
    "octagon", 8,
    "nonagon", 9,
    "decagon", 10
];
shapes
| summarize mylist = make_list_with_nulls(sideCount)
```

**Output**

| mylist |
| ------ |
| [null,4,4,5,6,7,8,9,10] |
