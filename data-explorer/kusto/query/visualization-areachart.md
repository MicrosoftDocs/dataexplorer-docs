---
title:  Area chart visualization
description:  This article describes the area chart visualization.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# Area chart

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The area chart visual shows a time-series relationship. The first column of the query should be numeric and is used as the x-axis. Other numeric columns are the y-axes. Unlike line charts, area charts also visually represent volume. Area charts are ideal for indicating the change among different datasets.

> [!NOTE]
> This visualization can only be used in the context of the [render operator](render-operator.md).

## Syntax

*T* `|` `render` `areachart` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | Input table name.
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

::: moniker range="microsoft-fabric  || azure-data-explorer"

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
|`ysplit`      |How to split multiple the visualization. 
|`ytitle`      |The title of the y-axis (of type `string`).                                       |

#### `ysplit` property

This visualization supports splitting into multiple y-axis values:

|`ysplit`  |Description                                                       |
|----------|------------------------------------------------------------------|
|`none`    |A single y-axis is displayed for all series data. (Default)       |
|`axes`    |A single chart is displayed with multiple y-axes (one per series).|
|`panels`  |One chart is rendered for each `ycolumn` value (up to some limit).|


::: moniker-end

::: moniker range="azure-monitor || microsoft-sentinel"

### Supported properties

All properties are optional.

|*PropertyName*|*PropertyValue*                                                                   |
|--------------|----------------------------------------------------------------------------------|
|`kind`        |Further elaboration of the visualization kind. For more information, see [`kind` property](#kind-property).                        |
|`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|
|`title`       |The title of the visualization (of type `string`).                                |

::: moniker-end

#### `kind` property

This visualization can be further elaborated by providing the `kind` property.
The supported values of this property are:

| `kind` value       | Description                                                                      |
|--------------|----------------------------------------------------------------------------------|
| `default`    | Each "area" stands on its own.                                                   |
| `unstacked`  | Same as `default`.                                                               |
| `stacked`    | Stack "areas" to the right.                                                      |
| `stacked100` | Stack "areas" to the right and stretch each one to the same width as the others. |

## Examples

### Simple area chart

The following example shows a basic area chart visualization.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJzc2PL04tykwtNuaqUShKzUtJLVJILEpNTM5ILCoBAEjF66IfAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
demo_series3
| render areachart
```

:::image type="content" source="media/visualization-areachart/area-chart.png" alt-text="Screenshot of area chart visualization." lightbox="media/visualization-areachart/area-chart.png":::

### Area chart using properties

The following example shows an area chart using multiple property settings.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WRO2%2BEMAzH9%2FsUFhNIDNA9Uzt0u6G3n0ywwLokoDwoVP3wDY87Ui92%2Fr84fuQqZRjRyOWDPEnPg7n8ggtao%2BUfApy6%2B%2Fv1TUSfR1%2BUm%2BJJj2KN8luMyKIPlg7WB80t%2B2Xnn8epgGaBhk1%2BY03Oox5LqPsi1rJkWrKAllD2aP0Fon2z7yGHLV7twaYFATFRPqgtX7qijjYyseNG0UkWOaigjRPPEf53d86RpODMDoQaukTz7BWByL5iyzGYUAXKEq7ZxPJ1lUo4g6jrqkrEeX8bFBtCm%2Bh7m5GciznhURyyFWblqr3gs7FttGSsuA5%2Ffkq23S%2F%2BAJslc3TmAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
OccupancyDetection
| summarize avg_CO2=avg(CO2), avg_temp= avg(Temperature), avg_humidity= avg(Humidity) by bin(Timestamp, 1h)
| render areachart
    with ( 
        kind = stacked,
        legend = visible,
        ycolumns= avg_CO2, avg_humidity, avg_temp,
        yaxis =log,
        ytitle ="Sample value",
        ymin = 10,
        ymax =11000,
        xaxis = linear,
        xcolumn = Timestamp,
        xtitle = "Time",    
        title ="CO2, humidity, and temperature"
    )
```

:::image type="content" source="media/visualization-areachart/area-chart-with-properties.png" alt-text="Screenshot of area chart visualization with properties." lightbox="media/visualization-areachart/area-chart-with-properties.png":::

::: moniker range="microsoft-fabric  || azure-data-explorer"
### Area chart using split panels

The following example shows an area chart using split panels. In this example, the `ysplit` property is set to `panels`.
::: moniker-end
:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02RsW6DMBCG9zzFL08gMSQP4IG2kSpFyhAYuho4BUvGINskUPXhe0AbfIN1%2Fn7f%2Bfy7CL3rzg%2BywR9%2B8GzJEYqgAkFbJKI8f%2BWFyCCu57dbXlzyJb%2Fk14JpCmUbrLXlPBCkhPhU2ghu5MeuU05%2FE%2Bp%2BtEGua5KimrfuGSptE05dKHXH21OTcpkj25CDcqTqlrUDOJ46tEjWdInZD0YHiUFZMj57cUN3robEQ3tdGdqVue7N2Fm%2FTRFxNWkPafp7xIIOht8i3pezIhI6NkTiGBM1QZ6OEZq2jjDaknIR3yZgZX%2FyLv5dCfHBzrDBHC%2Fxf5zFWND6T2IV018qvG0uugEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

::: moniker range="microsoft-fabric  || azure-data-explorer"

```kusto
StormEvents
| where State in ("TEXAS", "NEBRASKA", "KANSAS") and EventType == "Hail"
| summarize count=count() by State, bin(StartTime, 1d)
| render areachart
    with (
        ysplit= panels,
        legend = visible,
        ycolumns=count,
        yaxis =log,
        ytitle ="Count",
        ymin = 0,
        ymax =100,
        xaxis = linear,
        xcolumn = StartTime,
        xtitle = "Date",    
        title ="Hail events"
    )
```

:::image type="content" source="media/visualization-areachart/area-chart-with-split-panels.png" alt-text="Screenshot of area chart visualization with split panels." lightbox="media/visualization-areachart/area-chart-with-split-panels.png":::

::: moniker-end
