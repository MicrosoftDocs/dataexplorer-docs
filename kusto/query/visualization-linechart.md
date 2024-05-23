---
title:  Line chart visualization
description:  This article describes the line chart visualization.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/26/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Line chart

::: zone pivot="azuredataexplorer, fabric"

The line chart visual is the most basic type of chart. The first column of the query should be numeric and is used as the x-axis. Other numeric columns are the y-axes. Line charts track changes over short and long periods of time. When smaller changes exist, line graphs are more useful than bar graphs.

> [!NOTE]
> This visualization can only be used in the context of the [render operator](render-operator.md).

## Syntax

*T* `|` `render` `linechart` [`with` `(` *propertyName* `=` *propertyValue* [`,` ...] `)`]

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
|`accumulate`  |Whether the value of each measure gets added to all its predecessors (`true` or `false`).|
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
|`ysplit`      |How to split multiple the visualization. For more information, see [`ysplit` property](#ysplit-property).                             |
|`ytitle`      |The title of the y-axis (of type `string`).                                       |

#### `ysplit` property

This visualization supports splitting into multiple y-axis values:

|`ysplit`  |Description                                                       |
|----------|------------------------------------------------------------------|
|`none`    |A single y-axis is displayed for all series data. (Default)       |
|`axes`    |A single chart is displayed with multiple y-axes (one per series).|
|`panels`  |One chart is rendered for each `ycolumn` value (up to some limit).|

## Examples

### Render a line chart

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLEm1tVUK8wxy9/TzdFQCyhQU5WelJpeA5IpKQjJzU3UUXBJzE9NTA4ryC1KLSiqBaopS81JSixRyMvNSkzOAygCpk5aiXAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where State=="VIRGINIA"
| project StartTime, DamageProperty
| render linechart 
```

:::image type="content" source="media/visualization-linechart/line-chart.png" alt-text="Screenshot of line chart visualization output." lightbox="media/visualization-linechart/line-chart.png":::

### Label a line chart

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22OwQrCMAyG73uK0JPCXmEHQZFeRJzsXrZsjaztSINz4MPb1Xkzp8D//V9SS2B3eqKXWLxhtsgItRjBqlKNvp31RR9USiYOD2xlzVju5LCEo3FmwCuHCVmWxDD6DhlG8tjahBWQZiaxsMurkIxYqV8DuiyAnoODuP4RgTw0xAN5MqrMpdfWyoeTwiGE/otvxPLfq3K4/wAc1ztT4QAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where State=="VIRGINIA"
| project StartTime, DamageProperty
| render linechart
    with (
    title="Property damage from storms in Virginia",
    xtitle="Start time of storm",
    ytitle="Property damage"
    )
```

:::image type="content" source="media/visualization-linechart/line-chart-with-labels.png" alt-text="Screenshot of line chart with labels." lightbox="media/visualization-linechart/line-chart-with-labels.png":::

### Limit values displayed on the y-axis

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAxXKsQrCMBRG4d2nuHRS6BBwcMogKJKliC3uof6YiDcp14s14MM3Pet3es3C5y+SfjZ/mgME1KtXWNvc3e3iOndsqkySXxh1NdEhMlo6efZPXCVPEC31EaQHhN4xYQx1ozlqoG3hmOzBGNNSYf+ze7O2WwCSj8TeegAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where State=="VIRGINIA"
| project StartTime, DamageProperty
| render linechart with (ymin=7000, ymax=300000)
```

:::image type="content" source="media/visualization-linechart/line-chart-limit-y-values.png" alt-text="Screenshot of line chart with limitations on y-axis values." lightbox="media/visualization-linechart/line-chart-limit-y-values.png":::

### View multiple y-axes

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyWMvwqDMBCH9z7FkSkBlz6AQwpCQXBoHLpGPfAgOSU5FUsfvmm7/f7wfU6WFJsdWfLlDceMCcGJFwRi0KpvntapClTX3B7WtfabW9u5shrwPMGP7c8Voa5B3T0FVUR5i9EneiGMy8aiDQzn31vBQKxLTNJTLPU6mQIk5AkTBGIc5/LBQTKDPvMaSOrVM4ZsPghjwq6tAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| where State in ("TEXAS", "NEBRASKA", "KANSAS") and EventType == "Hail"
| summarize count() by State, bin(StartTime, 1d)
| render linechart with (ysplit=panels)
```

:::image type="content" source="media/visualization-linechart/line-chart-ysplit-panels.png" alt-text="Screenshot of the time chart query result with the ysplit panels property." lightbox="media/visualization-linechart/line-chart-ysplit-panels.png":::

## Related content

* [Add a query visualization in the web UI](../../add-query-visualization.md)

::: zone-end

::: zone pivot="azuremonitor"

This visualization isn't supported in Azure Monitor.

::: zone-end