---
title:  Bar chart visualization
description: This article describes the bar chart visualization in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/02/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Bar chart

The bar chart visual needs a minimum of two columns in the query result. By default, the first column is used as the y-axis. This column can contain text, datetime, or numeric data types. The other columns are used as the x-axis and contain numeric data types to be displayed as horizontal lines. Bar charts are used mainly for comparing numeric and nominal discrete values, where the length of each line represents its value.

> [!NOTE]
> This visualization can only be used in the context of the [render operator](render-operator.md).

## Syntax

*T* `|` `render` `barchart` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *T* | string |  :heavy_check_mark: | Input table name.|
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

::: zone pivot="azuredataexplorer, fabric"

### Supported properties

All properties are optional.

|*PropertyName*|*PropertyValue*                                                                   |
|--------------|----------------------------------------------------------------------------------|
|`accumulate`  |Whether the value of each measure gets added to all its predecessors (`true` or `false`).|
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
|`none`    |A single y-axis is displayed for all series data. This is the default.      |
|`axes`    |A single chart is displayed with multiple y-axes (one per series).|
|`panels`  |One chart is rendered for each `ycolumn` value.|

::: zone-end

::: zone pivot="azuremonitor"

### Supported properties

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

| `kind` value | Description                                                        |
|--------------|--------------------------------------------------------------------|
| `default`    | Each "bar" stands on its own.                                      |
| `unstacked`  | Same as `default`.                                                 |
| `stacked`    | Stack "bars".                                                      |
| `stacked100` | Stack "bars" and stretch each one to the same width as the others. |

## Examples

### Render a bar chart

The following query creates a bar chart displaying the number of storm events for each state, filtering only those states with more than 10 events. The chart provides a visual representation of the event distribution across different states.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WNwQ3CMAxF753C6qmVukKOTJABUJpYJKhJkOMCrRiexCBAwgfL/v/5W3OmeLhi4tI9oKwxGgo7AjbpaPOaWEkfRpg30GwYK3ihfEbLr336patJmBwSzIasN8Qd1LoF9jDIyIEXVL1un0FuWnJpSf0kxPaPvJ37x/nSC57qQ+WDc5hEGZ+m61uP1gAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize event_count=count() by State
| project State, event_count
| render barchart
    with (
    title="Storm count by state",
    ytitle="Storm count",
    xtitle="State",
    legend=hidden
    )
```

:::image type="content" source="media/visualization-barchart/labeled-bar-chart.png" alt-text="Screenshot of a labeled bar chart." lightbox="media/visualization-barchart/labeled-bar-chart.png":::

### Render a `stacked` bar chart

The following query creates a `stacked` bar chart that shows the total count of storm events by their type for selected states of Texas, California, and Florida. Each bar represents a storm event type, and the stacked bars show the breakdown of storm events by state within each type.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WMwQqDMBBE7/2KJScFf8FDsAqCVFAPvabJQoIYy2atWPrxjdpLT8PMm5meZ5rKF3oOlw+sFgmhZ8UIzkMihvIue5GBKGRTV213q+Xuqqbt6qsUadyEZZoUuTfCcVPMi2fIQe+apPDYznzYnpid13E0k0H6Y6CC/nEwGHQsEfqjpUhbRQyrYwvJ6LzJAys9okm/XvmC/L8AAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| where State in ("TEXAS", "CALIFORNIA", "FLORIDA")
| summarize EventCount = count() by EventType, State
| order by EventType asc, State desc
| render barchart with (kind=stacked)
```

:::image type="content" source="media/visualization-barchart/stacked-bar-chart.png" alt-text="Scrrenshot of a stacked bar chart visualization." lightbox="media/visualization-barchart/stacked-bar-chart.png":::

### Render a `stacked100` bar chart

The following query creates a `stacked100` bar chart that shows the total count of storm events by their type for selected states of Texas, California, and Florida. The chart shows the distribution of storm events across states within each type. Although the stacks visually sum up to 100, the values actually represent the number of events, not percentages. This visualization is helpful for understanding both the percentages and the actual event counts.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WMvQqDQBCE+zzFcpWChXkAi8MoCBJBLdJe7hY8xFP21oghDx9/0qQaZr6ZaXikIXuhY3/5wNIhITSsGME6CESbPWQjIhCpLIu8qu+F3F1eVnVxkyLcNn4eBkX2jXDcpOPsGBLQuwYhPNczb9cJo/N6G41kkP4YKK9/HAx6vZUI3dFSpDtFDIvlDoLeOpN4VrpHc43j8AvTVplzwgAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where State in ("TEXAS", "CALIFORNIA", "FLORIDA")
| summarize EventCount = count() by EventType, State
| order by EventType asc, State desc
| render barchart with (kind=stacked100)
```

:::image type="content" source="media/visualization-barchart/stacked-100-bar-chart.png" alt-text="Screenshot of a stacked 100 bar chart visualization." lightbox="media/visualization-barchart/stacked-100-bar-chart.png":::

::: zone pivot="azuredataexplorer, fabric"

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
| render barchart with (ysplit=axes)
```

:::image type="content" source="media/visualization-barchart/bar-chart-ysplit-axes.png" alt-text="Screenshot of column chart using ysplit axes property." lightbox="media/visualization-barchart/bar-chart-ysplit-axes.png":::

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
| render barchart with (ysplit=panels)
```

:::image type="content" source="media/visualization-barchart/bar-chart-ysplit-panels.png" alt-text="Screenshot of column chart using ysplit panels property." lightbox="media/visualization-barchart/bar-chart-ysplit-panels.png":::


::: zone-end