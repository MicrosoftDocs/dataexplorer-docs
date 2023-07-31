---
title:  Bar chart visualization
description: This article describes the bar chart visualization in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/30/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Bar chart

The bar chart visual needs a minimum of two columns in the query result. By default, the first column is used as the y-axis. This column can contain text, datetime, or numeric data types. The other columns are used as the x-axis and contain numeric data types to be displayed as horizontal lines. Bar charts are used mainly for comparing numeric and nominal discrete values, where the length of each line represents its value.

> [!NOTE]
> This visualization can only be used in the context of the [render operator](renderoperator.md).

## Syntax

*T* `|` `render` `barchart` [`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`]

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
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKC7NzU0syqxKVUgFCcUn55fmldiCSQ1NhaRKheCSxJJUoMLyjNQiFEUKdgqGBkCJgqL8rNTkEohCHWQVQMmi1LyU1CKFpMSi5IzEohIA1FziU3wAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize event_count=count() by State
| where event_count > 10
| project State, event_count
| render barchart
```

:::image type="content" source="images/visualization-barchart/bar-chart.png" alt-text="Screenshot of bar chart visualization result." lightbox="images/visualization-barchart/bar-chart.png":::

### Use properties to label a bar chart

The following query demonstrates how to use properties to label a bar chart.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WNwQ3CMAxF753C6qmVukKOTJABUJpYJKhJkOMCrRiexCBAwgfL/v/5W3OmeLhi4tI9oKwxGgo7AjbpaPOaWEkfRpg30GwYK3ihfEbLr336patJmBwSzIasN8Qd1LoF9jDIyIEXVL1un0FuWnJpSf0kxP0feTvbx/nSC57qQ+WDc5hEGZ/psjhB1gAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| summarize event_count=count() by State
| project State, event_count
| render barchart
    with (
    title="Storm count by state",
    xtitle="Storm count",
    ytitle="State",
    legend=hidden
    )
```

:::image type="content" source="images/visualization-barchart/labeled-bar-chart.png" alt-text="Screenshot of a labeled bar chart." lightbox="images/visualization-barchart/labeled-bar-chart.png":::

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

:::image type="content" source="images/visualization-barchart/stacked-bar-chart.png" alt-text="Scrrenshot of a stacked bar chart visualization." lightbox="images/visualization-barchart/stacked-bar-chart.png":::

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

:::image type="content" source="images/visualization-barchart/stacked-100-bar-chart.png" alt-text="Screenshot of a stacked 100 bar chart visualization." lightbox="images/visualization-barchart/stacked-100-bar-chart.png":::
