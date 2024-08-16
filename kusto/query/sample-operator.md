---
title:  sample operator
description: Learn how to use the sample operator to return up to the specified number of rows from the input table.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# sample operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns up to the specified number of random rows from the input table.

> [!NOTE]
>
> * `sample` is geared for speed rather than even distribution of values. Specifically, it means that it will not produce 'fair' results if used after operators that union 2 datasets of different sizes (such as a `union` or `join` operators). It's recommended to use `sample` right after the table reference and filters.
> * `sample` is a non-deterministic operator, and will return different result set each time it is evaluated during the query. For example, the following query yields two different rows (even if one would expect to return the same row twice).

## Syntax

*T* `| sample` *NumberOfRows*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T*| `string` |  :heavy_check_mark: | The input tabular expression. |
| *NumberOfRows*| int, long, or real |  :heavy_check_mark: | The number of rows to return. You can specify any numeric expression.|

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVGIT0ksSVSwVShKzEtPVahQSCvKz1UwVCjJVzA0MFAoLkktUDC05soBqSxOzC3ISQWqheipUYAKAOVL8zLz8xQ0oEo0dRBMANt5ESNkAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let _data = range x from 1 to 100 step 1;
let _sample = _data | sample 1;
union (_sample), (_sample)
```

**Output**

| x   |
| --- |
| 83  |
| 3   |

To ensure that in example above `_sample` is calculated once, one can use [materialize()](materialize-function.md) function:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0XLOwqAMBCE4d5TTJmARVIHzyILrhLIi2QFEQ+vYsBu4P8msGBeSAgTKqWNcWCtOcJCMqwxaMIF1g3hlY1iCfzYSMLVU/Anq+9/oUer3bAnnxNU93r85w3rZ9v0cQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let _data = range x from 1 to 100 step 1;
let _sample = materialize(_data | sample 1);
union (_sample), (_sample)
```

**Output**

| x   |
| --- |
| 34  |
| 34  |

To sample a certain percentage of your data (rather than a specified number of rows), you can use

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRKM9ILUpVKErMS9HQVLBRMNAzBABGrj/0IAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents | where rand() < 0.1
```

To sample keys rather than rows (for example - sample 10 Ids and get all rows for these Ids) you can use [`sample-distinct`](sample-distinct-operator.md) in combination with the `in` operator.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoTswtyEl1Lcgszk9JLVawVQguyS/KdS1LzSspVqiBSuumZBaXZOYllygYGijkpylAlXumWHMhKeeqUSjPSC1KRUgrZOYpaKDaoAkA08y7N3UAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let sampleEpisodes = StormEvents | sample-distinct 10 of EpisodeId;
StormEvents
| where EpisodeId in (sampleEpisodes)
```
