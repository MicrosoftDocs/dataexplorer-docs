---
title:  Time chart visualization
description:  This article describes the time chart visualization.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# Time chart

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

A time chart visual is a type of line graph. The first column of the query is the x-axis, and should be a datetime. Other numeric columns are y-axes. One string column values are used to group the numeric columns and create different lines in the chart. Other string columns are ignored. The time chart visual is like a [line chart](visualization-linechart.md) except the x-axis is always time.

> [!NOTE]
> This visualization can only be used in the context of the [render operator](render-operator.md).

## Syntax

*T* `|` `render` `timechart` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *T* | `string` |  :heavy_check_mark: | Input table name.
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

::: moniker range="microsoft-fabric || azure-data-explorer"

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
|`ysplit`      |How to split the visualization into multiple y-axis values. For more information, see [`ysplit` property](#ysplit-property).                             |
|`ytitle`      |The title of the y-axis (of type `string`).                                       |

#### `ysplit` property

This visualization supports splitting into multiple y-axis values:

|`ysplit`  |Description                                                       |
|----------|------------------------------------------------------------------|
|`none`    |A single y-axis is displayed for all series data. (Default)       |
|`axes`    |A single chart is displayed with multiple y-axes (one per series).|
|`panels`  |One chart is rendered for each `ycolumn` value. Maximum five panels.|

## Examples

[!INCLUDE [help-cluster-note](../includes/help-cluster-note.md)]

Review the examples and run them in your Data Explorer query page.

### Render a timechart

The following example renders a timechart with a title "Web app. traffic over a month, decomposing" that decomposes the data into baseline, seasonal, trend, and residual components.
::: moniker-end

::: moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQ3WqDQBCF7%2FMU506l2qilFBp8igR6KRsd49L9kXXy09KH72xioIX2aneYM%2Bd8M4YYVruW0aBXTKwtpXVZvRRlVZTP2WZlokJd%2FlLURfmEun4ty0XXR1E9blY9Wd9a9U7tTEHTXK%2B%2BEMviVsIdbaNOh1TeDN5hJ6ZbVnbCELxdiNgvwTPTFL33H5h1D%2FE6jxToWjQNkt22SgCs18BMhjqGkp47GEKkxRI6%2BCCNzpByFHDS81EZ%2FalYeyeWdGFyPdK9Eg%2FtKJcxNXunTA4O0soRSBJlKJMtb55tT523k58prpKjqHIkcXrQnGQ3pLtExyD4IcLJreTzE06W%2FTcvhxKyOxjSu%2FDhqssEPr6yUzTsRhUYZ81jypoNNckb7aGm6VFs1TDoDv5E8RLWOx7z33xJ9g1PIpCWEgIAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

::: moniker range="microsoft-fabric || azure-data-explorer"

```kusto
let min_t = datetime(2017-01-05);
let max_t = datetime(2017-02-03 22:00);
let dt = 2h;
demo_make_series2
| make-series num=avg(num) on TimeStamp from min_t to max_t step dt by sid 
| where sid == 'TS1'   //  select a single time series for a cleaner visualization
| extend (baseline, seasonal, trend, residual) = series_decompose(num, -1, 'linefit')  //  decomposition of a set of time series to seasonal, trend, residual, and baseline (seasonal+trend)
| render timechart with(title='Web app. traffic over a month, decomposition')
```

:::image type="content" source="media/visualization-timechart/visualization-timechart.png" alt-text="Screenshot of timechart visualization output." lightbox="media/visualization-timechart/visualization-timechart.png":::

### Label a timechart

The following example renders a timechart that depicts crop damage grouped by week. The timechart x axis label is "Date" and the y axis label is "Crop damage."
::: moniker-end

::: moniker range="azure-data-explorer"

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WOQQrCMBBF957i01UCVlpddFU36gn0AqkZbKBJJR2tiod3GoogDgMz/JnP+0fuoz/cKfCweGNsKRKObCKfnCc0xCNRgLKGiUVR66Ko8qKU1lit8KuX63xTao0FpEyw2BtvLrSL/XXAFoUQhpv3JroXIUF3/S0wapynqTSaJxoX1DfBEpXVYosULEVMqHMrt0QYHbdQaWXHHdXZRJJMExT9fTZky/TymH/2EnmWnv+2+dLRRYh166ylkBT9AeKYKXcqAQAA" target="_blank">Run the query</a>
::: moniker-end

::: moniker range="microsoft-fabric || azure-data-explorer"

```kusto
StormEvents
| where StartTime between (datetime(2007-01-01) .. datetime(2007-12-31)) 
    and DamageCrops > 0
| summarize EventCount = count() by bin(StartTime, 7d)
| render timechart
    with (
    title="Crop damage over time",
    xtitle="Date",
    ytitle="Crop damage",
    legend=hidden
    )
```

:::image type="content" source="media/visualization-timechart/time-chart-with-labels.png" alt-text="Screenshot of timechart with labels." lightbox="media/visualization-timechart/time-chart-with-labels.png":::

### View multiple y-axes

The following example renders daily hail events in the states of Texas, Nebraska, and Kansas. The visualization uses the `ysplit` property to render each state's events in separate panels for comparison.
::: moniker-end

::: moniker range="azure-data-explorer"

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyWMsQqDMBiE90Lf4ciUgEsfwCEFoSA4GIeuUX8wYKIkvxVLH76x3e6+4zvDS/TViwKn6+WDfaJIMGyZ4AKk6KqnNqKAaKp7q02tz1zrxmSqYMOIn9wdK6EsIR7WzeJ8Spv3Nro3YVi2wFKhP/7HBXoXZI6RO+dzvY3qNCKFkSI4s2HKI3bHE+SR1tlxudpAc1JfbEl6kbAAAAA=" target="_blank">Run the query</a>

::: moniker-end

::: moniker range="microsoft-fabric || azure-data-explorer"
```kusto
StormEvents
| where State in ("TEXAS", "NEBRASKA", "KANSAS") and EventType == "Hail"
| summarize count() by State, bin(StartTime, 1d)
| render timechart with (ysplit=panels)
```

:::image type="content" source="media/visualization-timechart/ysplit-panels.png" alt-text="Screenshot of the time chart query result with the ysplit panels property." lightbox="media/visualization-timechart/ysplit-panels.png":::

## Related content

* [Add a query visualization in the web UI](/azure/data-explorer/add-query-visualization)

::: moniker-end

::: moniker range="azure-monitor || microsoft-sentinel"

### Supported properties

All properties are optional.

|*PropertyName*|*PropertyValue*|
|--------------|----------------------------------------------------------------------------------|
|`series`      |Comma-delimited list of columns whose combined per-record values define the series that record belongs to.|
|`title`       |The title of the visualization (of type `string`). |

## Example

The following example renders a timechart with a title "Web app. traffic over a month, decomposing" that decomposes the data into baseline, seasonal, trend, and residual components.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQ3WqEQAyF7/cpcqdS7aqlFLr4FLvQS4ka16HzIzPZn5Y+fDOrCy20V5mQk3O+jCYGo2zL0MCATKwMpXVZvRRlVZTP2W6jowKvfynqonyCun4ty1U3RFE97TYDGdcafKc2kFcU6s0XxLZYWrAn0+D5mErNwFk4iOme0cwwemdWInZrcGCao3f3AUENIF6XiTzdmqaB5LCvEgDYbgECaeoZUGb2qAkiLayho/My6DWhJQ9nFU6o1SeyclYs6cpkB0g7FA9lKZc1DM6izoG9jHLwJImylMmVi2c7UO/M7ALFU3IoqhySuD0qTrIF6S5RMQjcGOHkr+TxE06O/TcvBxSyOxikd+HDTZcJfKxyUzTsJ/QMF8VTyoo1NckbdYDz/Ci2OI6qXxiMszzlv+mS7BvAR09lEAIAAA==" target="_blank">Run the query</a>

```kusto
let min_t = datetime(2017-01-05);
let max_t = datetime(2017-02-03 22:00);
let dt = 2h;
demo_make_series2
| make-series num=avg(num) on TimeStamp from min_t to max_t step dt by sid 
| where sid == 'TS1'   //  select a single time series for a cleaner visualization
| extend (baseline, seasonal, trend, residual) = series_decompose(num, -1, 'linefit')  //  decomposition of a set of time series to seasonal, trend, residual, and baseline (seasonal+trend)
| render timechart with(title='Web app. traffic of a month, decomposition')
```

:::image type="content" source="media/visualization-timechart/visualization-timechart.png" alt-text="Screenshot of timechart visualization output." lightbox="media/visualization-timechart/visualization-timechart.png":::

::: moniker-end
