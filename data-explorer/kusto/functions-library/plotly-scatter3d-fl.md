---
title: plotly_scatter3d_fl() - Azure Data Explorer
description: Learn how to use the plotly_scatter3d_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 01/15/2023
---
# plotly_scatter3d_fl()

The function `plotly_scatter3d_fl()` allows you to customize a [plotly](https://plotly.com/python/) template to create an interactive 3D scatter chart.  

The function accepts a table containing the records to be rendered, the names of the x, y, z & aggregation columns, and the chart title string. The function returns a single cell table containing [plotly JSON](https://plotly.com/chart-studio-help/json-chart-schema/) to be rendered in an [Azure Data Explorer dashboard](../../azure-data-explorer-dashboards.md) tile. For more information, see [Plotly visual in dashboards](../../dashboard-customize-visuals.md#plotly-preview).

> [!NOTE]
>
> * `plotly_scatter3d_fl()` is a [user-defined function](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Prerequisite

Extract the required 'scatter3d' template from the publicly available `PlotlyTemplate` table. Copy this table from the Samples database to your database by running the following KQL command from your target database: 

```kusto
.set PlotlyTemplate <| cluster('help.kusto.windows.net').database('Samples').PlotlyTemplate
```

## Syntax

plotly_scatter3d_fl(tbl:(*), x_col:string, y_col:string, z_col:string, aggr_col:string='', chart_title:string='3D Scatter chart')

`T | invoke plotly_scatter3d_fl(`*x_col*`,` *y_col*`,` *z_col*`,` *aggr_col* [`,` *chart_title* ]`)`
  
## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x_col* | string | &check; | The name of the column for the X coordinated of the 3D plot.|
| *y_col* | string | &check; | The name of the column for the Y coordinated of the 3D plot.|
| *z_col* | string | &check; | The name of the column for the Z coordinated of the 3D plot.|
| *aggr_col* | string | &check; | The name of the grouping column. Records in the same group are rendered in distinct color.|
| *chart_title* | string | | The chart title. The default is '3D Scatter chart'.|

## Usage

`plotly_scatter3d_fl()` is a user-defined [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for examples.

### [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permission is required.

```kusto
let plotly_scatter3d_fl=(tbl:(*), x_col:string, y_col:string, z_col:string, aggr_col:string='', chart_title:string='3D Scatter chart')
{
    let scatter3d_chart = toscalar(PlotlyTemplate | where name == "scatter3d" | project plotly);
    let tbl_ex = tbl | extend _x = column_ifexists(x_col, 0.0), _y = column_ifexists(y_col, 0.0), _z = column_ifexists(z_col, 0.0), _aggr = column_ifexists(aggr_col, 'ALL');
    tbl_ex
    | serialize 
    | summarize _x=pack_array(make_list(_x)), _y=pack_array(make_list(_y)), _z=pack_array(make_list(_z)) by _aggr
    | summarize _aggr=make_list(_aggr), _x=make_list(_x), _y=make_list(_y), _z=make_list(_z)
    | extend plotly = scatter3d_chart
    | extend plotly=replace_string(plotly, '$CLASS1$', tostring(_aggr[0]))
    | extend plotly=replace_string(plotly, '$CLASS2$', tostring(_aggr[1]))
    | extend plotly=replace_string(plotly, '$CLASS3$', tostring(_aggr[2]))
    | extend plotly=replace_string(plotly, '$X_NAME$', x_col)
    | extend plotly=replace_string(plotly, '$Y_NAME$', y_col)
    | extend plotly=replace_string(plotly, '$Z_NAME$', z_col)
    | extend plotly=replace_string(plotly, '$CLASS1_X$', tostring(_x[0]))
    | extend plotly=replace_string(plotly, '$CLASS1_Y$', tostring(_y[0]))
    | extend plotly=replace_string(plotly, '$CLASS1_Z$', tostring(_z[0]))
    | extend plotly=replace_string(plotly, '$CLASS2_X$', tostring(_x[1]))
    | extend plotly=replace_string(plotly, '$CLASS2_Y$', tostring(_y[1]))
    | extend plotly=replace_string(plotly, '$CLASS2_Z$', tostring(_z[1]))
    | extend plotly=replace_string(plotly, '$CLASS3_X$', tostring(_x[2]))
    | extend plotly=replace_string(plotly, '$CLASS3_Y$', tostring(_y[2]))
    | extend plotly=replace_string(plotly, '$CLASS3_Z$', tostring(_z[2]))
    | extend plotly=replace_string(plotly, '$TITLE$', chart_title)
    | project plotly
}
;
Iris
| invoke plotly_scatter3d_fl(x_col='SepalLength', y_col='PetalLength', z_col='SepalWidth', aggr_col='Class', chart_title='3D scatter chart using plotly_scatter3d_fl()')
```

### [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md).  Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One time installation

```kusto
.create-or-alter function with (folder = "Packages\\Plotly", docstring = "Render 3D scatter chart using plotly template")
plotly_scatter3d_fl(tbl:(*), x_col:string, y_col:string, z_col:string, aggr_col:string='', chart_title:string='3D Scatter chart')
{
    let scatter3d_chart = toscalar(PlotlyTemplate | where name == "scatter3d" | project plotly);
    let tbl_ex = tbl | extend _x = column_ifexists(x_col, 0.0), _y = column_ifexists(y_col, 0.0), _z = column_ifexists(z_col, 0.0), _aggr = column_ifexists(aggr_col, 'ALL');
    tbl_ex
    | serialize 
    | summarize _x=pack_array(make_list(_x)), _y=pack_array(make_list(_y)), _z=pack_array(make_list(_z)) by _aggr
    | summarize _aggr=make_list(_aggr), _x=make_list(_x), _y=make_list(_y), _z=make_list(_z)
    | extend plotly = scatter3d_chart
    | extend plotly=replace_string(plotly, '$CLASS1$', tostring(_aggr[0]))
    | extend plotly=replace_string(plotly, '$CLASS2$', tostring(_aggr[1]))
    | extend plotly=replace_string(plotly, '$CLASS3$', tostring(_aggr[2]))
    | extend plotly=replace_string(plotly, '$X_NAME$', x_col)
    | extend plotly=replace_string(plotly, '$Y_NAME$', y_col)
    | extend plotly=replace_string(plotly, '$Z_NAME$', z_col)
    | extend plotly=replace_string(plotly, '$CLASS1_X$', tostring(_x[0]))
    | extend plotly=replace_string(plotly, '$CLASS1_Y$', tostring(_y[0]))
    | extend plotly=replace_string(plotly, '$CLASS1_Z$', tostring(_z[0]))
    | extend plotly=replace_string(plotly, '$CLASS2_X$', tostring(_x[1]))
    | extend plotly=replace_string(plotly, '$CLASS2_Y$', tostring(_y[1]))
    | extend plotly=replace_string(plotly, '$CLASS2_Z$', tostring(_z[1]))
    | extend plotly=replace_string(plotly, '$CLASS3_X$', tostring(_x[2]))
    | extend plotly=replace_string(plotly, '$CLASS3_Y$', tostring(_y[2]))
    | extend plotly=replace_string(plotly, '$CLASS3_Z$', tostring(_z[2]))
    | extend plotly=replace_string(plotly, '$TITLE$', chart_title)
    | project plotly
}
```

### Usage

```kusto
Iris
| invoke plotly_scatter3d_fl(x_col='SepalLength', y_col='PetalLength', z_col='SepalWidth', aggr_col='Class', chart_title='3D scatter chart using plotly_scatter3d_fl()')
```

---

The output is a Plotly JSON string that can be rendered in an Azure Data Explorer dashboard tile. For more information on creating dashboard tiles, see [Visualize data with Azure Data Explorer dashboards ](../../azure-data-explorer-dashboards.md).

![Screenshot of 3D scatter chart of a sample data set.](images\plotly-scatter3d-fl\plotly-scatter3d-chart.png)

You can rotate, zoom and hover over specific records:

![Screenshot of rotated 3D scatter chart of a sample data set.](images\plotly-scatter3d-fl\plotly-scatter3d-chart-rotated.png)
