---
title: count() (aggregation function) - Azure Data Explorer
description: This article describes count() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/14/2022
---
# count() (aggregation function)

Counts the number of records per summarization group, or total if summarization is done without grouping.

Use the [countif](countif-aggfunction.md) aggregation function to count only records for which a predicate returns `true`.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`count` `(` `)`

## Returns

Returns a count of the records per summarization group (or in total, if summarization is done without grouping).

## Example

This example returns a count of events in states starting with letter `W`:

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSxJVSguSSwqKS7PLMlQUApXAskWl+bmJhZlVqUqOOeX5pXYJoNIDU2FpEqIFgCZCeK+TQAAAA==)**\]**

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| where State startswith "W"
| summarize Count=count() by State
```

|State|Count|
|---|---|
|WEST VIRGINIA|757|
|WYOMING|396|
|WASHINGTON|261|
|WISCONSIN|1850|
