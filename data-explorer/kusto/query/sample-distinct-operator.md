---
title:  sample-distinct operator
description: Learn how to use the sample-distinct operator to return a column that contains up to the specified number of distinct values of the requested columns.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
---
# sample-distinct operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a single column that contains up to the specified number of distinct values of the requested column.

The operator tries to return an answer as quickly as possible rather than trying to make a fair sample.

## Syntax

*T* `| sample-distinct` *NumberOfValues* `of` *ColumnName*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T*| `string` |  :heavy_check_mark: | The input tabular expression. |
| *NumberOfValues*| int, long, or real |  :heavy_check_mark: | The number distinct values of *T* to return. You can specify any numeric expression.|
| *ColumnName*| `string` |  :heavy_check_mark: | The name of the column from which to sample.|

> [!TIP]
>
> * Use the [top-hitters](top-hitters-operator.md) operator to get the top values.
> * Refer to the [sample operator](sample-operator.md) to sample data rows.

## Examples  

[!INCLUDE [help-cluster-note](../includes/help-cluster-note.md)]

Get 10 distinct values from a population

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRKE7MLchJ1U3JLC7JzEsuUTA0UMhPU3AtyCzOT0n1TAEAXIVALi0AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents | sample-distinct 10 of EpisodeId
```

**Output**

| EpisodeId |
|--|
| 11074 |
| 11078 |
| 11749 |
| 12554 |
| 12561 |
| 13183 |
| 11780 |
| 11781 |
| 12826 |

Sample a population and do further computation without exceeding the query limits in the summarize

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNuw6CUBBEe75iSihIsDZ0UlDzBVfuGpfcB9ldNBo+Xk0waDlzTmYCGdTFOVA3s2ZPihaDZYndjZIp1g3XntU4jYZDg3zBpvf+WPzqxYr7lYR2Dk4o/y+qj6ZLjE74SbBsLvRpWoRJ23dffsOJhUarcH7sey97JpXgsgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let sampleEpisodes = StormEvents | sample-distinct 10 of EpisodeId;
StormEvents 
| where EpisodeId in (sampleEpisodes) 
| summarize totalInjuries=sum(InjuriesDirect) by EpisodeId
```

**Output**

| EpisodeId | totalInjuries |
|--|--|
| 11091 | 0 |
| 11074 | 0 |
| 11078 | 0 |
| 11749 | 0 |
| 12554 | 3 |
| 12561 | 0 |
| 13183 | 0 |
| 11780 | 0 |
| 11781 | 0 |
| 12826 | 0 |
