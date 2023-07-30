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

### Render a `stacked` bar chart

The following query creates a stacked bar chart that shows the total count of storm events by their type for selected states of Texas, California, and Florida. Each bar represents a state, and the stacked bars show the breakdown of storm events by type within each state.

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

The following query uses the `stacked100` kind to visualize the proportion of each storm event type within their corresponding state for the month of January 2007. Each bar represents a state, and the chart shows the relative contribution of different storm event types to the total number of events. Although the stacks appear to sum up to 100 visually, the actual values represent the number of events, not percentages.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WQTU8CMRCG7yT8h8melgTJogcPhsMKRBqgayjGg/FQtiM07HZNO4hr/PG2u/iZ2DSZr2fambdAAkHS0kQSwgiUN6RLjM+T5PIsGfrbu+p2Co9NjfoPuviCllod0RFa418ldIGujSx1Hj9EbLFgPGMi6kPE+ISlPG3c7L6x85SLtCku2XjGblLe+pxPRbZO20CI7G7Fgs+n16tUzJs8z1brGUzS+YnLZiwL1sO/8vdMjDMuGI8ew8SCKltOX9CQ63be4bhDi60ca78ebJCOiAbib4UGg08der86fEl78O/6DeQOZSmtfkNovhpXB0PX9bp+DlrmIYp7sKnbZ/otFKqht7IK7VcRpMt/AKDQ5YGyaBpM2nznJ+12wJ+jph3Erb/XRo0cyXyPapgk/TZb4NY3jnZaKTSnXE2aChxFt2hz/43cIlRPQBXJAlyQy0Un8vVENpNFvQ/J9tyzSgIAAA==" target="_blank">Run the query</a>

```kusto
let StartDate = datetime(2007-01-01);
let EndDate = datetime(2007-01-31);
let MidwesternStates = dynamic(["ILLINOIS", "INDIANA", "IOWA", "KANSAS", "MICHIGAN", "MINNESOTA", "MISSOURI", "NEBRASKA", "NORTH DAKOTA", "OHIO", "SOUTH DAKOTA", "WISCONSIN"]);
StormEvents
| where StartTime between (StartDate .. EndDate)
| where State in (MidwesternStates)
| summarize EventCountByType = count() by State, EventType
| order by State asc, EventType desc
| render barchart
    with (
    kind=stacked100,
    legend=hidden,
    ytitle="Percentage of total storms",
    xtitle="State")
```

:::image type="content" source="images/visualization-barchart/stacked-100-bar-chart.png" alt-text="Screenshot of  a "stacked100" bar chart visualization." lightbox="images/visualization-barchart/stacked-100-bar-chart.png":::

To see a similar graph without using `stacked100`, you'd need to calculate the percentages as shown in the following query.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5VSwW7bMAy95ysIn+whS9zusMPgg5sEi5BWLmIPPQw7ODZbq7XlTJaXedjHj5KSJW0QYAsciJIe+R4fVaOGVOdKz3ONEEFJixYN+tdh+PF9eEVf8GlUE2ohy0uYDwfMnSh32GlUkmpq7Ax4kHkjCv+rx25vGU9Y6o3BY3zOYh7bMHmw6yrmaWwv79hsyT7H3MWcL9Iki90mTZMva2ZivrhZx+nKnvNknS1hHq/2uGTJErMS+NX5A0tnCU8Z976R4FS3qln8QKm70W/YVajQWZFRb7BBvUOU4B/dmUwOJgSnCXQjCPe292A0ncIsr4u+NhBd0b/VeQ2ybzaooH0EtOTw2CrAvKigM4lUuuubJlfiF0JmMpxG8rJoe6n9ADaD4z1nsAhb2tSz9UEPWzzneG5J9IuQZSSkRNVL8b1H8EdAv1NnzP6/3XmTdNEhhzu2azlnpoebITOyz3seO5C5temuSCsvObJFVRA+f8J/smWr2mcs9N4Gw2fDv5xue38sGoEihaXvn2l/B1dhOAkDmJ6OcQzX5vW0qqQ3cGgK8q44aQxK7AoCKZQWlauiIpst9U7oaj8mOz0SXrxg6XTV+EQpUSXKEqU7GrTQNUbe/Ssf3EvszJw7zwF/7oFWkBf8AY2JRG4ZBAAA" target="_blank">Run the query</a>

```kusto
let StartDate = datetime(2007-01-01);
let EndDate = datetime(2007-01-31);
let MidwesternStates = dynamic(["ILLINOIS", "INDIANA", "IOWA", "KANSAS", "MICHIGAN", "MINNESOTA", "MISSOURI", "NEBRASKA", "NORTH DAKOTA", "OHIO", "SOUTH DAKOTA", "WISCONSIN"]);
StormEvents
| where StartTime between (StartDate .. EndDate)
| where State in (MidwesternStates)
// Calculate the total number of events for each state
| summarize TotalEvents = count() by State
// Calculate the count of each event type for each state
| join kind=innerunique (
    StormEvents
    | where StartTime between (StartDate .. EndDate)
    | where State in (MidwesternStates)
    | summarize EventCountByType = count() by State, EventType
    )
    on State
// Calculate the percentage of each event type for each state
| project
    State,
    EventType,
    Percentage = round((EventCountByType * 100.0) / TotalEvents, 2)
| order by State asc, EventType desc
| render barchart
    with (
    kind=stacked,
    legend=hidden,
    ytitle="Percentage of total storms",
    xtitle="State")
```
