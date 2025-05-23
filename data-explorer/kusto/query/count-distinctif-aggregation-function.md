---
title:  count_distinctif() (aggregation function) - (preview)
description: Learn how to use the count_distinctif() function to count unique values of a scalar expression in records for which the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/03/2025
---
# count_distinctif() (aggregation function) - (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Conditionally counts unique values specified by the scalar expression per summary group, or the total number of unique values if the summary group is omitted. Only records for which *predicate* evaluates to `true` are counted.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

If you only need an estimation of unique values count, we recommend using the less resource-consuming [dcountif](dcountif-aggregation-function.md) aggregation function.

> [!NOTE]
>
> * This function is limited to 100M unique values. An attempt to apply the function on an expression returning too many values produces a runtime error (HRESULT: 0x80DA0012).
:::moniker range="azure-data-explorer"
> * Function performance can be degraded when operating on multiple data sources from different clusters.
::: moniker-end
:::moniker range="microsoft-fabric"
> * Function performance can be degraded when operating on multiple data sources from different Eventhouses.
::: moniker-end

## Syntax

`count_distinctif` `(`*expr*`,` *predicate*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr*| scalar |  :heavy_check_mark: | The expression whose unique values are to be counted. |
| *predicate* | `string` |  :heavy_check_mark: | The expression used to filter records to be aggregated. |

## Returns

Integer value indicating the number of unique values of *expr* per summary group, for all records for which the *predicate* evaluates to `true`.

## Examples

The following example shows how many types of death-causing storm events happened in each state. Only storm events with a nonzero count of deaths are counted.

:::moniker range="azure-data-explorer"
> [!NOTE]
> Function performance can be degraded when operating on multiple data sources from different clusters.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22NsQ6CQBAFe79iS4gWNJZQoYk1Wpv1WMMm3h3cvdNA/HgRSi3fzCSvgQ/28BSHuHlTTNZy0Eno4nRIcmTwY7Wl8cnh2mqEOgO9Zws/j73ssloYXaw1iAFtaZ0n1y4gr4qcbiM1YMh88uok/DmgiorZwve0/+Y/wQetTCWoqwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize UniqueFatalEvents=count_distinctif(EventType,(DeathsDirect + DeathsIndirect)>0) by State
| where UniqueFatalEvents > 0
| top 5 by UniqueFatalEvents
```

**Output**

| State           | UniqueFatalEvents |
| --------------- | ----------------- |
| TEXAS           | 12                |
| CALIFORNIA      | 12                |
| OKLAHOMA        | 10                |
| NEW YORK        | 9                 |
| KANSAS          | 9                 |

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [count_distinct() (aggregation function)](count-distinct-aggregation-function.md)
* [countif() (aggregation function)](countif-aggregation-function.md)
* [dcountif() (aggregation function)](dcountif-aggregation-function.md)