---
title:  Ladder chart visualization
description:  This article describes the ladder chart visualization.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "azure-data-explorer"
---
# Ladder chart

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The last two columns are the x-axis, and the other columns are the y-axis.

> [!NOTE]
> * This visualization can only be used in the context of the [render operator](render-operator.md).
> * This visualization is available in [Kusto.Explorer](/azure/data-explorer/data-explorer-overview) but not in the [Azure Data Explorer web UI](/azure/data-explorer/web-ui-query-overview).

## Syntax

*T* `|` `render` `ladderchart` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *T* | `string` |  :heavy_check_mark: | Input table name.
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

## Examples

### Dates of storms by state

```kusto
StormEvents
| where EventType  has "rain"
| summarize min(StartTime), max(EndTime) by State
| render ladderchart
```

:::image type="content" source="media/visualization-ladderchart/ladderchart-state.png" alt-text="Screenshot of ladderchart showing dates of storms by state." lightbox="media/visualization-ladderchart/ladderchart-state.png":::

### Dates of storms by event type

```kusto
StormEvents
| where State == "WASHINGTON"
| summarize min(StartTime), max(EndTime) by EventType
| render ladderchart
```

:::image type="content" source="media/visualization-ladderchart/ladderchart-event-type.png" alt-text="Screenshot of ladderchart showing dates of storms by event type." lightbox="media/visualization-ladderchart/ladderchart-event-type.png":::

### Dates of storms by state and event type

```kusto
StormEvents
| where State startswith "W"
| summarize min(StartTime), max(EndTime) by State, EventType
| render ladderchart with (series=State, EventType)
```

:::image type="content" source="media/visualization-ladderchart/ladderchart-state-and-event-type.png" alt-text="Screenshot of ladderchart showing dates of storms by state and event type." lightbox="media/visualization-ladderchart/ladderchart-state-and-event-type.png":::
