---
title:  count_distinct() (aggregation function) - (preview)
description: Learn how to use the count_distinct() (aggregation function) to count unique values specified by a scalar expression per summary group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/13/2023
---
# count_distinct() (aggregation function) - (preview)

Counts unique values specified by the scalar expression per summary group, or the total number of unique values if the summary group is omitted.

[!INCLUDE [ignore-nulls](../../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

If you only need an estimation of unique values count, we recommend using the less resource-consuming [`dcount`](dcount-aggfunction.md) aggregation function.

To count only records for which a predicate returns `true`, use the [count_distinctif](count-distinctif-aggregation-function.md) aggregation function.

> [!NOTE]
>
> * This function is limited to 100M unique values. An attempt to apply the function on an expression returning too many values will produce a runtime error (HRESULT: 0x80DA0012).
> * Function performance can be degraded when operating on multiple data sources from different clusters.

## Syntax

`count_distinct` `(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr*| scalar |  :heavy_check_mark: | The expression whose unique values are to be counted. |

## Returns

Long integer value indicating the number of unique values of *expr* per summary group.

## Example

This example shows how many types of storm events happened in each state.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVQjNyywsTYVI2Cbnl+aVxKdkFpdk5iWXaIBFQyoLUjUVkioVgksSS1KBekvyCxRMQQLIWgE/wdUFXwAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize UniqueEvents=count_distinct(EventType) by State
| top 5 by UniqueEvents
```

**Output**

| State                | UniqueEvents  |
| -------------------- | ------------- |
| TEXAS                | 27            |
| CALIFORNIA           | 26            |
| PENNSYLVANIA         | 25            |
| GEORGIA              | 24            |
| NORTH CAROLINA       | 23            |
