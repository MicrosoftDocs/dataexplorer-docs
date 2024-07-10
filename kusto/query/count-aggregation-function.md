---
title:  count() (aggregation function)
description: Learn how to use the count() function to count the number of records in a group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/13/2023
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel 
"
---
# count() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)] 


Counts the number of records per summarization group, or total if summarization is done without grouping.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]
::: moniker range="microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
To only count records for which a predicate returns `true`, use [countif()](countif-aggregation-function.md).
::: moniker-end

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`count()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

Returns a count of the records per summarization group, or in total if summarization is done without grouping.

## Example

This example returns a count of events in states:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVXDOL80rsU0GkRqaCkmVCsEliSWpAIqJlTEuAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize Count=count() by State
```

**Output**

|State|Count|
|---|---|
|TEXAS	|4701|
|KANSAS	|3166|
|IOWA	|2337|
|ILLINOIS	|2022|
|MISSOURI	|2016|
|GEORGIA	|1983|
|MINNESOTA	|1881|
|WISCONSIN	|1850|
|NEBRASKA	|1766|
|NEW YORK	|1750|
|...|...|

::: moniker range="microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
## Related content

* [bin_at()](bin-at-function.md#bin_at) rounds values down to a fixed-size bin, which can be used to aggregate data, such as by time unit.
::: moniker-end