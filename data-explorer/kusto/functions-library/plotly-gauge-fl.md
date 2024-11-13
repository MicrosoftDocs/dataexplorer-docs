---
title:  plotly_gauge_fl()
description:  Learn how to use the plotly_gauge_fl() user-defined function.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 11/12/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# plotly_gauge_fl()

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The function `plotly_gauge_fl()` is a [user-defined function (UDF)](../query/functions/user-defined-functions.md) that allows you to customize a [plotly](https://plotly.com/python/) template to create a [gauge chart](https://plotly.com/python/gauge-charts/).  

The function accepts few parameters to customize the gauge chart and returns a single cell table containing [plotly JSON](https://plotly.com/chart-studio-help/json-chart-schema/). Optionally, you can render the data in an [Azure Data Explorer dashboard](/azure/data-explorer/azure-data-explorer-dashboards) tile. For more information, see [Plotly (preview)](../query/visualization-plotly.md).

## Prerequisite

Extract the required 'gauge' template from the publicly available `PlotlyTemplate` table. Copy this table from the Samples database to your database by running the following KQL command from your target database: 

```kusto
.set PlotlyTemplate <| cluster('help.kusto.windows.net').database('Samples').PlotlyTemplate
```

## Syntax

`T | invoke plotly_gauge_fl(`*value*`,` *max_range*`,` *mode*`,` *chart_title*`,` *font_color*`,` *bar_color*`,` *bar_bg_color*`,` *tick_color*`,` *tick_width*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `real` |  :heavy_check_mark: | The number to be displayed.|
| *max_range* | `range` | | The maximum range of the gauge.|
| *mode* | `string` | | Specifies how the value is displayed on the graph. Default is 'gauge+number'.|
| *chart_title* | `string` | | The chart title. The default is empty title.|
| *font_color* | `string` | | The chart's font color. Default is 'black'.|
| *bar_color* | `string` | | The gauge's filled bar color. Default is 'green'.|
| *bar_bg_color* | `string` | | The gauge's not filled bar color. Default is 'lightgreen'.|
| *tick_color* | `string` | | The gauge's ticks color. Default is 'darkblue'.|
| *tick_width* | `int` | | The gauge's ticks width. Default is 1.|

Plotly gauge charts support many parameters, still this function exposes only the above ones. For further information about them see [indicator traces reference](https://plotly.com/python/reference/indicator/).

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `plotly_gauge_fl()`, see [Example](#example).

```kusto
let plotly_gauge_fl=(value:real, max_range:real=real(null), mode:string='gauge+number', chart_title:string='',font_color:string='black',
                    bar_color:string='green', bar_bg_color:string='lightgreen', tick_color:string='darkblue', tick_width:int=1)
{
    let gauge_chart = toscalar(PlotlyTemplate | where name == "gauge" | project plotly);
    print plotly = gauge_chart
    | extend plotly=replace_string(plotly, '$VALUE$', tostring(value))
    | extend plotly=replace_string(plotly, '$MAX_RANGE$', iff(isnull(max_range), 'null', tostring(max_range)))
    | extend plotly=replace_string(plotly, '$MODE$', mode)
    | extend plotly=replace_string(plotly, '$TITLE$', chart_title)
    | extend plotly=replace_string(plotly, '$FONT_COLOR$', font_color)
    | extend plotly=replace_string(plotly, '$BAR_COLOR$', bar_color)
    | extend plotly=replace_string(plotly, '$BAR_BG_COLOR$', bar_bg_color)
    | extend plotly=replace_string(plotly, '$TICK_COLOR$', tick_color)
    | extend plotly=replace_string(plotly, '$TICK_WIDTH$', tostring(tick_width))
    | project plotly
};
// Write your query to use your function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Plotly", docstring = "Render gauge chart using plotly template")
plotly_gauge_fl(value:real, max_range:real=real(null), mode:string='gauge+number', chart_title:string='',font_color:string='black',
                    bar_color:string='green', bar_bg_color:string='lightgreen', tick_color:string='darkblue', tick_width:int=1)
{
    let gauge_chart = toscalar(PlotlyTemplate | where name == "gauge" | project plotly);
    print plotly = gauge_chart
    | extend plotly=replace_string(plotly, '$VALUE$', tostring(value))
    | extend plotly=replace_string(plotly, '$MAX_RANGE$', iff(isnull(max_range), 'null', tostring(max_range)))
    | extend plotly=replace_string(plotly, '$MODE$', mode)
    | extend plotly=replace_string(plotly, '$TITLE$', chart_title)
    | extend plotly=replace_string(plotly, '$FONT_COLOR$', font_color)
    | extend plotly=replace_string(plotly, '$BAR_COLOR$', bar_color)
    | extend plotly=replace_string(plotly, '$BAR_BG_COLOR$', bar_bg_color)
    | extend plotly=replace_string(plotly, '$TICK_COLOR$', tick_color)
    | extend plotly=replace_string(plotly, '$TICK_WIDTH$', tostring(tick_width))
    | project plotly
}
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let plotly_gauge_fl=(value:real, max_range:real=real(null), mode:string='gauge+number', chart_title:string='',font_color:string='black',
                    bar_color:string='green', bar_bg_color:string='lightgreen', tick_color:string='darkblue', tick_width:int=1)
{
    let gauge_chart = toscalar(PlotlyTemplate | where name == "gauge" | project plotly);
    print plotly = gauge_chart
    | extend plotly=replace_string(plotly, '$VALUE$', tostring(value))
    | extend plotly=replace_string(plotly, '$MAX_RANGE$', iff(isnull(max_range), 'null', tostring(max_range)))
    | extend plotly=replace_string(plotly, '$MODE$', mode)
    | extend plotly=replace_string(plotly, '$TITLE$', chart_title)
    | extend plotly=replace_string(plotly, '$FONT_COLOR$', font_color)
    | extend plotly=replace_string(plotly, '$BAR_COLOR$', bar_color)
    | extend plotly=replace_string(plotly, '$BAR_BG_COLOR$', bar_bg_color)
    | extend plotly=replace_string(plotly, '$TICK_COLOR$', tick_color)
    | extend plotly=replace_string(plotly, '$TICK_WIDTH$', tostring(tick_width))
    | project plotly
};
plotly_gauge_fl(value=180, chart_title='Speed', font_color='purple', tick_width=5)
| render plotly 
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
plotly_gauge_fl(value=180, chart_title='Speed', font_color='purple', tick_width=5)
| render plotly 
```

---

**Output**

The output is a Plotly JSON string that can be rendered in an Azure Data Explorer dashboard tile. For more information on creating dashboard tiles, see [Visualize data with Azure Data Explorer dashboards](/azure/data-explorer/azure-data-explorer-dashboards).

![Screenshot of gauge chart with random data.](media/plotly-gauge-fl\plotly-gauge-chart.png)
