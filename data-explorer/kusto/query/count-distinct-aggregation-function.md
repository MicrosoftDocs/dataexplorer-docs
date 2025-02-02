---
title:  count_distinct() (aggregation function) - (preview)
description: Learn how to use the count_distinct() (aggregation function) to count unique values specified by a scalar expression per summary group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# count_distinct() (aggregation function) - (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Counts unique values specified by the scalar expression per summary group, or the total number of unique values if the summary group is omitted.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

If you only need an estimation of unique values count, we recommend using the less resource-consuming [`dcount`](dcount-aggregation-function.md) aggregation function.

To count only records for which a predicate returns `true`, use the [count_distinctif](count-distinctif-aggregation-function.md) aggregation function.

> [!NOTE]
>
> * This function is limited to 100M unique values. An attempt to apply the function on an expression returning too many values produce a runtime error (HRESULT: 0x80DA0012).
:::moniker range="azure-data-explorer"
> * Function performance can be degraded when operating on multiple data sources from different clusters.
::: moniker-end
:::moniker range="microsoft-fabric"
> * Function performance can be degraded when operating on multiple data sources from different Eventhouses.
::: moniker-end

## Syntax

`count_distinct` `(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr*| scalar |  :heavy_check_mark: | The expression whose unique values are to be counted. |

## Returns

Long integer value indicating the number of unique values of *expr* per summary group.

## Example

This example shows how many types of storm events happened in each state.

:::moniker range="azure-data-explorer"
Function performance can be degraded when operating on multiple data sources from different clusters.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVQjNyywsTYVI2Cbnl+aVxKdkFpdk5iWXaIBFQyoLUjUVkioVgksSS1KBekvyCxRMQQLIWgE/wdUFXwAAAA==" target="_blank">Run the query</a>
::: moniker-end

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

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [count_distinctif() (aggregation function)](count-distinctif-aggregation-function.md)
* [count() (aggregation function)](count-aggregation-function.md)
* [countof()](countof-function.md)
* [countif() (aggregation function)](countif-aggregation-function.md)