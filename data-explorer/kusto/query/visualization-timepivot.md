---
title:  Time pivot visualization
description:  This article describes the time pivot visualization.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/02/2025
monikerRange: "azure-data-explorer"
---
# Time pivot

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The time pivot visualization is an interactive navigation over the events time-line pivoting on time axis.

> [!NOTE]
>
> * This visualization can only be used in the context of the [render operator](render-operator.md).
> * This visualization can be used in Kusto.Explorer but isn't available in the Azure Data Explorer web UI.

## Syntax

*T* `|` `render` `timepivot` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *T* | `string` |  :heavy_check_mark: | Input table name.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

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

This query outputs a visualization of flood events in the specified Midwestern states, displayed as a time pivot chart.

[!INCLUDE [help-cluster-note-data-explorer-only](../includes/help-cluster-note-data-explorer-only.md)]

```kusto
let midwesternStates = dynamic([
    "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "MICHIGAN", "MINNESOTA",
    "MISSOURI", "NEBRASKA", "NORTH DAKOTA", "OHIO", "SOUTH DAKOTA", "WISCONSIN"
]);
StormEvents
| where EventType == "Flood" and State in (midwesternStates)
| render timepivot with (xcolumn=State)
```

**Output**

:::image type="content" source="media/visualization-timepivot/time-pivot-visualization.jpg" lightbox="media/visualization-timepivot/time-pivot-visualization.jpg" alt-text="Screenshot of timepivot in Kusto.Explorer.":::
