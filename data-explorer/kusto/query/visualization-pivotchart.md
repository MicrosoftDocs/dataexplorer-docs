---
title:  Pivot chart visualization
description: This article describes the pivot chart visualization in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/27/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Pivot chart

::: zone pivot="azuredataexplorer"

Displays a pivot table and chart. You can interactively select data, columns, rows and various chart types.

> [!NOTE]
>
> * This visualization can only be used in the context of the [render operator](renderoperator.md).
> * This visualization can be used in Kusto.Explorer but is not available in the Azure Data Explorer web UI.

## Syntax

*T* `|` `render` `pivotchart` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | Input table name.
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

### Supported properties

All properties are optional.

|*PropertyName*|*PropertyValue*                                                                   |
|--------------|----------------------------------------------------------------------------------|
|`accumulate`  |Whether the value of each measure gets added to all its predecessors. (`true` or `false`)|
|`legend`      |Whether to display a legend or not (`visible` or `hidden`).                       |
|`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|
|`ymin`        |The minimum value to be displayed on Y-axis.                                      |
|`ymax`        |The maximum value to be displayed on Y-axis.                                      |
|`title`       |The title of the visualization (of type `string`).                                |
|`xaxis`       |How to scale the x-axis (`linear` or `log`).                                      |
|`xcolumn`     |Which column in the result is used for the x-axis.                                |
|`xtitle`      |The title of the x-axis (of type `string`).                                       |
|`yaxis`       |How to scale the y-axis (`linear` or `log`).                                      |
|`ycolumns`    |Comma-delimited list of columns that consist of the values provided per value of the x column.|
|`ytitle`      |The title of the y-axis (of type `string`).                                       |

## Example

```kusto
SalesFact
| join kind= inner Products on ProductKey
| where ProductCategoryName contains "Computers"
| where DateKey between (datetime(2006-12-31) .. datetime(2007-02-01))
| summarize count() by SalesAmount, ProductName, DateKey
| render pivotchart 
```

:::image type="content" source="images/visualize-pivotchart/visualization-pivotchart.png" alt-text="Screenshot of query result showing a pivot chart visualization."  lightbox="images/visualize-pivotchart/visualization-pivotchart.png":::

::: zone-end

::: zone pivot="azuremonitor, fabric"

This visualization isn't supported.

::: zone-end
