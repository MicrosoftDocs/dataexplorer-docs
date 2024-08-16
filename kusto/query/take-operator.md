---
title:  take operator
description: Learn how to use the take operator to return a specified number of rows.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel "
---
# take operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)] 


Return up to the specified number of rows.

There is no guarantee which records are returned, unless
the source data is sorted. If the data is sorted, then the top values will be returned.

> The `take` and `limit` operators are equivalent

> [!NOTE]
> `take` is a simple, quick, and efficient way to view a small sample of records when browsing data interactively, but be aware that it doesn't guarantee any consistency in its results when executing multiple times, even if the dataset hasn't changed.
> Even if the number of rows returned by the query isn't explicitly limited by the query (no `take` operator is used), Kusto limits that number by default. For more details, see [Kusto query limits](../concepts/query-limits.md).

## Syntax

`take` *NumberOfRows*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*NumberOfRows*| `int` | :heavy_check_mark:|The number of rows to return.|

::: moniker range="microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
## Paging of query results

Methods for implementing paging include:

* Export the result of a query to an external storage and paging through the
   generated data.
* Write a middle-tier application that provides a stateful paging API by caching
   the results of a Kusto query.
* Use pagination in [Stored query results](stored-query-result-function.md#pagination)
::: moniker-end

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRKEnMTlUwBQDEz2b8FAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents | take 5
```

## Related content

* [sort operator](sort-operator.md)
* [top operator](top-operator.md)
* [top-nested operator](top-nested-operator.md)
