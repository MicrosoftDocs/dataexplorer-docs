---
title:  Stacked area chart visualization
description:  This article describes the stacked area chart visualization.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# Stacked area chart

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The stacked area chart visual shows a continuous relationship. This visual is similar to the [Area chart](visualization-areachart.md), but shows the area under each element of a series. The first column of the query should be numeric and is used as the x-axis. Other numeric columns are the y-axes. Unlike line charts, area charts also visually represent volume. Area charts are ideal for indicating the change among different datasets.

> [!NOTE]
> This visualization can only be used in the context of the [render operator](render-operator.md).

## Syntax

*T* `|` `render` `stackedareachart` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Supported parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` | :heavy_check_mark: | Input table name. |
| *propertyName*, *propertyValue* | `string` |  | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties). |

### Supported properties

All properties are optional.

| *PropertyName* | *PropertyValue* |
|--|--|
| `accumulate` | Whether the value of each measure gets added to all its predecessors. (`true` or `false`) |
| `legend` | Whether to display a legend or not (`visible` or `hidden`). |
| `series` | Comma-delimited list of columns whose combined per-record values define the series that record belongs to. |
| `ymin` | The minimum value to be displayed on Y-axis. |
| `ymax` | The maximum value to be displayed on Y-axis. |
| `title` | The title of the visualization (of type `string`). |
| `xaxis` | How to scale the x-axis (`linear` or `log`). |
| `xcolumn` | Which column in the result is used for the x-axis. |
| `xtitle` | The title of the x-axis (of type `string`). |
| `yaxis` | How to scale the y-axis (`linear` or `log`). |
| `ycolumns` | Comma-delimited list of columns that consist of the values provided per value of the x column. |
| `ytitle` | The title of the y-axis (of type `string`). |

## Example

The following query summarizes data from the `nyc_taxi` table by number of passengers and visualizes the data in a stacked area chart. The x-axis shows the pickup time in two day intervals, and the stacked areas represent different passenger counts.

[!INCLUDE [help-cluster-note](../includes/help-cluster-note.md)]

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WNMQ7CMAwAd17hMZE6sfctketY1CpxI9sRLeLxIEZYT7o7PakEHnJ5gY/W0OTJQPvQSBmWEzq6s97YyhdOsIimLrSNXioGhzSe4FrzJ2CslQ08kDauaIy0ogU8JFZIB+330XT+k51N2OefU34D4n9FXJoAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
nyc_taxi
| summarize count() by passenger_count, bin(pickup_datetime, 2d)
| render stackedareachart with (xcolumn=pickup_datetime, series=passenger_count)
```

**Output**

:::image type="content" source="media/visualization-stacked-areachart/stacked-area-chart.png" alt-text="Screenshot of stacked area chart visual output." lightbox="media/visualization-stacked-areachart/stacked-area-chart.png":::

## Related content

* [render operator](render-operator.md)
* [bin()](bin-function.md)
* [summarize operator](summarize-operator.md)