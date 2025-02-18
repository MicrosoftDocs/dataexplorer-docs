---
title:  Ladder chart visualization
description:  This article describes the ladder chart visualization.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/18/2025
monikerRange: "azure-data-explorer"
---
# Ladder chart

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

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
| *T* | `string` |  :heavy_check_mark: | Input table name|
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

The example in this section shows how to use the syntax to help you get started.
	
The examples in this article use publicly available tables in the help cluster, such as the *StormEvents* table in the Samples database.

### Dates of storms by state

This query outputs a state-wise visualization of the duration of rain-related storm events, displayed as a ladder chart to help you analyze the temporal distribution of these events.

```kusto
StormEvents
| where EventType  has "rain"
| summarize min(StartTime), max(EndTime) by State
| render ladderchart
```

:::image type="content" source="media/visualization-ladderchart/ladderchart-state.png" alt-text="Screenshot of ladderchart showing dates of storms by state." lightbox="media/visualization-ladderchart/ladderchart-state.png":::

### Dates of storms by event type

This query outputs a visualization of the duration of various storm events in Washington, displayed as a ladder chart to help you analyze the temporal distribution of these events by type.

```kusto
StormEvents
| where State == "WASHINGTON"
| summarize min(StartTime), max(EndTime) by EventType
| render ladderchart
```

:::image type="content" source="media/visualization-ladderchart/ladderchart-event-type.png" alt-text="Screenshot of ladderchart showing dates of storms by event type." lightbox="media/visualization-ladderchart/ladderchart-event-type.png":::

### Dates of storms by state and event type

This query outputs a visualization of the duration of various storm events in states starting with "W", displayed as a ladder chart to help you analyze the temporal distribution of these events by state and event type.

```kusto
StormEvents
| where State startswith "W"
| summarize min(StartTime), max(EndTime) by State, EventType
| render ladderchart with (series=State, EventType)
```

:::image type="content" source="media/visualization-ladderchart/ladderchart-state-and-event-type.png" alt-text="Screenshot of ladderchart showing dates of storms by state and event type." lightbox="media/visualization-ladderchart/ladderchart-state-and-event-type.png":::
