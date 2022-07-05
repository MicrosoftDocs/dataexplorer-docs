---
title: avg() (aggregation function) - Azure Data Explorer
description: This article describes avg() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/05/2022
---
# avg() (aggregation function)

Calculates the average (arithmetic mean) of *Expr* across the group.

* Can only be used in context of aggregation inside [summarize](summarizeoperator.md)

## Syntax

`avg` `(`*Expr*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | string | &check; | Expression that will be used for aggregation calculation. Records with `null` values are ignored and not included in the calculation. |

## Returns

The average value of *Expr* across the group.

## Examples

This example returns the average of damaged crops per state.
**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVXAsS3dJzE1MTw3Jdy7KLyhWsFVILEvXgIiBRTQVkioVgksSS1IBk8Ju20QAAAA=)**\]**

```kusto
StormEvents
| summarize AvgDamageToCrops = avg(DamageCrops) by State
```