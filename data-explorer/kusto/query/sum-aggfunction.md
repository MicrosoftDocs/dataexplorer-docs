---
title: sum() (aggregation function) - Azure Data Explorer
description: This article describes sum() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/05/2022
---
# sum() (aggregation function)

Calculates the sum of *Expr* across the group. 

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

## Syntax

`sum` `(`*Expr*`)`

## Arguments

* *Expr*: Expression that will be used for aggregation calculation. 

## Returns

The sum value of *Expr* across the group.
 
## Example

This example returns the total number of deaths by state.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSguzc1NLMqsSlVIBYnFJ+eX5pXYgkkNTR2FkPySxByX1MSSDOfE4tRiBVuQBg2wQLFLZlFqcommQlKlQnBJYkkq2Lj8ohKQAJo+AH3fbol1AAAA)**\]**

```kusto
StormEvents 
| summarize event_count=count(), TotalDeathCases = sum(DeathsDirect) by State 
| sort by TotalDeathCases
```
