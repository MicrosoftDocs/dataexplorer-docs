---
title:  Time pivot visualization
description:  This article describes the time pivot visualization and iteractivity.
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

## Interactive display

After you render the time pivot, you can further investigate and interact with the data by adding slice levels, and by drilling into specific time slices. The data in the table updates interactively according to the slice options you configure. The slice options that are available are:

* Change, add, and remove multiple slice levels
* Expand rows to view details of each level
* Toggle to view by start time or by end time
* Select specific rows, or specific time slices, and view their data in the table.

> [!TIP]
>
> * Time pivots have built-in support for the OpenTelemetry schema. When interacting with the first-level of the slice options, the OpenTelemtry spans and their nested hierarchy display in the list.

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
|`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|

## Examples

The examples in this section show how to use the syntax to help you get started.

### Visualize flood events per state ###

This query outputs a visualization of flood events in the specified Midwestern states, displayed as a time pivot chart.

```kusto
let midwesternStates = dynamic([
  "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "MICHIGAN", "MINNESOTA",
  "MISSOURI", "NEBRASKA", "NORTH DAKOTA", "OHIO", "SOUTH DAKOTA", "WISCONSIN"
]);
StormEvents
| where EventType == "Flood" and State in (midwesternStates)
| render timepivot with (series=State)
 ```

**Output**

:::image type="content" source="media/visualization-timepivot/time-pivot-visualization.jpg" lightbox="media/visualization-timepivot/time-pivot-visualization.jpg" alt-text="Screenshot of timepivot in Kusto.Explorer.":::

### Modify slice options to view flood events ###

Select a new slice option to change the data displayed in the time pivot. The data in the table below the time pivot updates to reflect the new series.

:::image type="content" source="media/visualization-timepivot/time-pivot-slice-options.png" lightbox="media/visualization-timepivot/time-pivot-slice-options.png" alt-text="Screenshot of timepivot slice options in Kusto.Explorer.":::

### Add slice levels to view flood events per state and per source ###

Add slice option levels to further investigate and interact with the data. Expand each row to see the levels added.

:::image type="content" source="media/visualization-timepivot/time-pivot-add-levels.png" lightbox="media/visualization-timepivot/time-pivot-add-levels.png" alt-text="Screenshot of timepivot with multiple levels expanded in Kusto.Explorer.":::

### View time slice data for a specific flood in Ohio  ###

To display the data relevant for a specific slice, select one or more time slices in a row of the time pivot.

:::image type="content" source="media/visualization-timepivot/time-pivot-slice-specific.png" lightbox="media/visualization-timepivot/time-pivot-slice-specific.png" alt-text="Screenshot of specific time slicein Kusto.Explorer.":::

### View and slice OpenTelemetry data

OpenTelemetry data slice options reflect its nested hierarchy. In this example,....