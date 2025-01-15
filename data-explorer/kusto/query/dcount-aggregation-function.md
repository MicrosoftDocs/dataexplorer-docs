---
title:  dcount() (aggregation function)
description: Learn how to use the dcount() function to return an estimate of the number of distinct values of an expression within a group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# dcount() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates an estimate of the number of distinct values that are taken by a scalar expression in the summary group.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

> [!NOTE]
> The `dcount()` aggregation function is primarily useful for estimating the cardinality of huge sets. It trades accuracy for performance, and might return a result that varies between executions. The order of inputs might have an effect on its output.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`dcount` `(`*expr*[`,` *accuracy*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr*| `string` |  :heavy_check_mark: | The input whose distinct values are to be counted. |
| *accuracy* | `int` |   | The value that defines the requested estimation accuracy. The default value is `1`. See [Estimation accuracy](#estimation-accuracy) for supported values. |

## Returns

Returns an estimate of the number of distinct values of *expr* in the group.

## Example

This example shows how many types of storm events happened in each state.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVXDJTEtLLQIKQ+RsU5LzS/NKNMC8kMqCVE2FpEqF4JLEklSgtvyilNQikACaLgBDbD8AXQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize DifferentEvents=dcount(EventType) by State
| order by DifferentEvents
```

The results table shown includes only the first 10 rows.

| State                | DifferentEvents |
| -------------------- | --------------- |
| TEXAS                | 27              |
| CALIFORNIA           | 26              |
| PENNSYLVANIA         | 25              |
| GEORGIA              | 24              |
| ILLINOIS             | 23              |
| MARYLAND             | 23              |
| NORTH CAROLINA       | 23              |
| MICHIGAN             | 22              |
| FLORIDA              | 22              |
| OREGON               | 21              |
| KANSAS               | 21              |
| ... | ... |

## Estimation accuracy

[!INCLUDE [data-explorer-estimation-accuracy](../includes/estimation-accuracy.md)]

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [dcountif() (aggregation function)](dcountif-aggregation-function.md)
* [count()](count-aggregation-function.md)
* [count_distinct() (aggregation function)](count-distinct-aggregation-function.md)