---
title:  count operator
description: Learn how to use the count operator to return the number of records in the input record set.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# count operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)] 

Returns the number of records in the input record set.

## Syntax

*T* `|` `count`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input whose records are to be counted. |

## Returns

This function returns a table with a single record and column of type
`long`. The value of the only cell is the number of records in *T*.

## Example

[!INCLUDE [help-cluster](../includes/help-cluster-note.md)]

When you use the count operator with a table name, like StormEvents, it will return the total number of records in that table.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVqhRSM4vzSsBALU2eHsTAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents | count
```

**Output**

| Count |
|-------|
| 59066 |

## Related content

For information about the count() aggregation function, see [count() (aggregation function)](count-aggregation-function.md).
