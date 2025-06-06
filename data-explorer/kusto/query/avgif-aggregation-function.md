---
title:  avgif() (aggregation function)
description: Learn how to use the avgif() function to return the average value of an expression where the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# avgif() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the [average](avg-aggregation-function.md) of *expr* in records for which *predicate* evaluates to `true`.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`avgif` `(`*expr*`,` *predicate*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `string` |  :heavy_check_mark: | The expression used for aggregation calculation. Records with `null` values are ignored and not included in the calculation. |
| *predicate* | `string` |  :heavy_check_mark: | The predicate that if true, the *expr* calculated value is added to the average. |

## Returns

Returns the average value of *expr* in records where *predicate* evaluates to `true`.

## Examples

The following example calculates the average damage by state in cases where there was any damage.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVXAsSy1KTE9NScwFkrYl+Tn5eekaiWXpGgouYCHnovyCYk1NHai68IzUPBd0tZlpGkiKdZDYCnYGmpoKSZUKwSWJJakAP4a4kIQAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| summarize Averagedamage=tolong(avg( DamageCrops)),AverageWhenDamage=tolong(avgif(DamageCrops,DamageCrops >0)) by State
```

**Output**

The results table shown includes only the first 10 rows.

| State                | Averagedamage | Averagewhendamage |
| -------------------- | ------------- | ----------------- |
| TEXAS                | 7524          | 491291            |
| KANSAS               | 15366         | 695021            |
| IOWA                 | 4332          | 28203             |
| ILLINOIS             | 44568         | 2574757           |
| MISSOURI             | 340719        | 8806281           |
| GEORGIA              | 490702        | 57239005          |
| MINNESOTA            | 2835          | 144175            |
| WISCONSIN            | 17764         | 438188            |
| NEBRASKA             | 21366         | 187726            |
| NEW YORK             | 5             | 10000             |
| ... | ... | ... |

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [avg() (aggregation function)](avg-aggregation-function.md)
* [minif() (aggregation function)](minif-aggregation-function.md)
* [maxif() (aggregation function)](maxif-aggregation-function.md)