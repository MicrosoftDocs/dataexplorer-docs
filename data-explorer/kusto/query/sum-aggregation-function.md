---
title:  sum() (aggregation function)
description: Learn how to use the sum() (aggregation function) function to calculate the sum of an expression across the group.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/25/2024
---
# sum() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the sum of *expr* across the group.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`sum(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr*  string |  :heavy_check_mark: | The expression used for the aggregation calculation. |

## Returns

Returns the sum value of *expr* across the group.

## Example

This example returns the total value of crop and property damages by state, and sorted in descending value.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSspVuCqUSguzc1NLMqsSlUAiznnl%2BaV2CaDSA1NHYWQ%2FJLEHJfE3MT01GIFW5BiDQjPuSi%2FoFgbwg4AslOLSio1FZIqFYJLEktSwQbnF5WABJCNAAAX%2BDSIfAAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents 
| summarize EventCount=count(), TotalDamages = sum(DamageCrops+DamageProperty) by State 
| sort by TotalDamages
```

**Output**

The results table shown includes only the first 10 rows.

| State | Eventcount | TotalDamages |
| ---- | --- |
| CALIFORNIA | 898 | 2801954600 |
| GEORGIA | 1983 | 1190448750 |
| MISSOURI | 2016 | 1096887450 |
| OKLAHOMA | 1716 | 916557300 |
| MISSISSIPPI | 1218 | 802890160 |
| KANSAS | 3166 | 738830000 |
| TEXAS | 4701 | 572086700 |
| OHIO | 1233 | 417989500 |
| FLORIDA | 1042 | 379455260 |
| NORTH DAKOTA | 905 | 342460100 |
| ... | ... | ... |
