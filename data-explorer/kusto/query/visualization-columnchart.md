---
title:  Column chart visualization
description: This article describes the column chart visualization in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/02/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Column chart

The column chart visual needs a minimum of two columns in the query result. By default, the first column is used as the x-axis. This column can contain text, datetime, or numeric data types. The other columns are used as the y-axis and contain numeric data types to be displayed as vertical lines. Column charts are used for comparing specific sub category items in a main category range, where the length of each line represents its value.

> [!NOTE]
> This visualization can only be used in the context of the [render operator](render-operator.md).

## Syntax

*T* `|` `render` `columnchart` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *T* | string | &check; | Input table name.|
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

::: zone pivot="azuredataexplorer, fabric"

### Supported properties

All properties are optional.

|*PropertyName*|*PropertyValue*                                                                   |
|--------------|----------------------------------------------------------------------------------|
|`accumulate`  |Whether the value of each measure gets added to all its predecessors. (`true` or `false`)|
|`kind`        |Further elaboration of the visualization kind.  For more information, see [`kind` property](#kind-property).                         |
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
|`ysplit`      |How to split the visualization into multiple y-axis values. For more information, see [`ysplit` property](#ysplit-property).                             |

#### `ysplit` property

This visualization supports splitting into multiple y-axis values:

|`ysplit`  |Description                                                       |
|----------|------------------------------------------------------------------|
|`none`    |A single y-axis is displayed for all series data. This is the default. |
|`axes`    |A single chart is displayed with multiple y-axes (one per series).|
|`panels`  |One chart is rendered for each `ycolumn` value.|

::: zone-end

::: zone pivot="azuremonitor"

### Properties 

All properties are optional.

|*PropertyName*|*PropertyValue*                                                                   |
|--------------|----------------------------------------------------------------------------------|
|`kind`        |Further elaboration of the visualization kind. For more information, see [`kind` property](#kind-property).                        |
|`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|
|`title`       |The title of the visualization (of type `string`).                                |

::: zone-end

#### `kind` property

This visualization can be further elaborated by providing the `kind` property.
The supported values of this property are:

| `kind` value | Definition |
| --- | ---|
|`default`          |Each "column" stands on its own.   |
|`unstacked`        |Same as `default`.                 |
|`stacked`          |Stack "columns" one atop the other.|
|`stacked100`       |Stack "columns" and stretch each one to the same height as the others.|

::: zone pivot="azuredataexplorer, fabric"

## Examples

### Render a column chart

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNQiFEUKdgqGBkCJgqL8rNTkEohCHWQVQMmi1LyU1CKF5Pyc0ty85IzEohIAvF8Py38AAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize event_count=count() by State
| where event_count > 10
| project State, event_count
| render columnchart
```

:::image type="content" source="media/visualization-columnchart/column-chart.png" alt-text="Screenshot of column chart visualization." lightbox="media/visualization-columnchart/column-chart.png":::

### Use the `ysplit` property

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOMQ6DMAxFd07hkagsPQAbHZjhAiFYwogkyDGlVD1800a04O1//2f/Rjzb2x2dhOwFYbFWMz0xgzitFz3VblyYMED52ea7rIjRiILLya1dn/zif6BCLcOOJ3GGk/dDv2S3QUcub0SztGSxgGuvYsGZ/RhDcFicWhbHnzHP6HpkMH5arDNDhGAlGSDfwjyRlPqBQb0BEH1UJQQBAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize
    TotalInjuries = sum(InjuriesDirect) + sum(InjuriesIndirect),
    TotalDeaths = sum(DeathsDirect) + sum(DeathsIndirect)
    by bin(StartTime, 1d)
| project StartTime, TotalInjuries, TotalDeaths
| render columnchart with (ysplit=axes)
```

:::image type="content" source="media/visualization-columnchart/column-chart-ysplit-axes.png" alt-text="Screenshot of column chart using ysplit axes property." lightbox="media/visualization-columnchart/column-chart-ysplit-axes.png":::

To split the view into separate panels, specify `panels` instead of `axes`:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOMQ6DMAxFd07hEVSWHoCNDsxwgRAsYZQ4yDGtqHr4pkW04O1//2f/VoP42x1ZY/aCuHhvhJ6YQZouqHENT4sQRqg+23yXNQlaLeBychseNr/8H6jR6LjjmzjDm/dDv2S/Qk+ct2pEO/JYwnUoUsFZwpRCcFicWpbHnykvyAMK2OAWz3ZMEDxIR8jXODvSajaMLhZvciiM8gYBAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize
    TotalInjuries = sum(InjuriesDirect) + sum(InjuriesIndirect),
    TotalDeaths = sum(DeathsDirect) + sum(DeathsIndirect)
    by bin(StartTime, 1d)
| project StartTime, TotalInjuries, TotalDeaths
| render columnchart with (ysplit=panels)
```

:::image type="content" source="media/visualization-columnchart/column-chart-ysplit-panels.png" alt-text="Screenshot of column chart using ysplit panels property." lightbox="media/visualization-columnchart/column-chart-ysplit-panels.png":::

::: zone-end

::: zone pivot="azuremonitor"

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNQiFEUKdgqGBkCJgqL8rNTkEohCHWQVQMmi1LyU1CKF5Pyc0ty85IzEohIAvF8Py38AAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize event_count=count() by State
| where event_count > 10
| project State, event_count
| render columnchart
```

:::image type="content" source="media/visualization-columnchart/column-chart.png" alt-text="Screenshot of column chart visualization." lightbox="media/visualization-columnchart/column-chart.png":::

::: zone-end
