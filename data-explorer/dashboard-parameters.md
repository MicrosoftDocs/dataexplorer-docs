---
title: Parameters in Azure Data Explorer dashboards
description: Use parameters as a building block for dashboard filters.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 07/20/2023
---

# Use parameters in Azure Data Explorer dashboards

Parameters are used as building blocks for dashboard filters in Azure Data Explorer dashboards. They're managed in the dashboard scope, and can be added to queries to filter the data presented by the underlying visual. A query can use one or more parameters.

This document describes the creation and use of parameters and linked filters in Azure Data Explorer dashboards. Parameters can be used to slice and dice dashboard visuals either directly by selecting [parameter values in the filter bar](#use-parameters-in-your-query) or by using [cross-filters](#use-cross-filters-as-dashboard-parameters).

> [!NOTE]
> Parameter management is available in **Editing** mode to dashboard editors.

## Prerequisites

[Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)

## View parameters list

Select the **Parameters** button at the top of the dashboard to view the list of all dashboard parameters.

:::image type="content" source="media/dashboard-parameters/parameters-widget.png" alt-text="Screenshot of the parameters button at the top of dashboard.":::

## Create a parameter

To create a parameter:

1. Select the **Parameters** button at the top of the dashboard.
1. Select the **+ New parameter** button at the top of the right pane.
1. Fill in the relevant [properties](#properties) for your parameter.

### Properties

In the **Add parameter** pane, configure the following properties.

|Field  |Description |
|---------|---------|
|**Label**|The name of the parameter shown on the dashboard or the edit card.|
|**Parameter type**|One of the following parameters:<ul><li>**Single selection**: Only one value can be selected in the filter as input for the parameter.</li><li>**Multiple selection**: One or more values can be selected in the filter as input(s) for the parameter.</li><li>**Time range**: Allows creating additional parameters to filter the queries and dashboards based on time. Every dashboard has a time range picker by default.</li><li>**Free text**: Doesn't have any values populated in the filter. The user can type a value or copy/paste a value to the text field. The filter keeps the recent values used.</li></ul>|
|**Variable name**|The name of the parameter to be used in the query.|
|**Data type**|The data type of the parameter values.|
|**Show on pages**|Select the pages where this parameter will be displayed. The **Select all** option shows the parameter on all pages.|
|**Source**|The source of the parameter values: <ul><li>**Fixed values**: Manually introduced static filter values. </li><li>**Query**: Dynamically introduced values using a KQL query.</li></ul>|
|**Default value**|The default value of the filter. The filter will start always with the default value upon initial rendering of the dashboard.
|**Add a "Select all" value**|Applicable only to single selection and multiple selection parameter types. Used to retrieve data for all the parameter values. This value should be built into the query to provide the functionality. See [Use the multiple-selection query-based parameter](#use-the-multiple-selection-query-based-parameter) for more examples on building such queries.|

## Manage parameters in parameter card

After selecting **Parameters** from the top bar, you can [view the list of existing parameters](#view-parameters-list). In each parameter card, you can select the pencil widget to edit the parameter, or select the **More [...]** menu to **Duplicate**, **Delete**, or move the parameter.

The following indicators can be viewed in the parameter card:

* Parameter display name
* Variable names
* Number of queries in which the parameter was used
* Pages the parameter is pinned to

The parameter cards can be ordered by drag and drop or by using the **Move to >** option and selecting the new location.

:::image type="content" source="media/dashboard-parameters/parameters-cards.png" alt-text="Screenshot of sample parameters cards.":::

## Use parameters in your query

A parameter must be used in the query to make the filter applicable for that query visual. Once defined, you can see the parameters in the **Query** page > filter top bar and in the query intellisense.

> [!NOTE]
> If the parameter isn't used in the query, the filter remains inactive. Once the parameter is added to the query, the filter becomes active.

## Use different parameter types

Several dashboard parameter types are supported. The following examples describe how to use parameters in a query for various parameter types.

### Use the default Time range parameter

Every dashboard has a *Time range* parameter by default. It shows up on the dashboard as a filter only when used in a query. Use the parameter keywords `_startTime` and `_endTime` to use the default time range parameter in a query as seen in the following example:

```kusto
EventsAll
| where Repo.name has 'Microsoft'
| where CreatedAt between (_startTime.._endTime)
| summarize TotalEvents = count() by RepoName=tostring(Repo.name)
| top 5 by TotalEvents
```

Once saved, the time range filter shows up on the dashboard. Now it can be used to filter the data on the card. You can filter your dashboard by selecting from the drop-down: **Time range** (last x minutes/hours/days) or a **Custom time range**.

:::image type="content" source="media/dashboard-parameters/time-range.png" alt-text="filter using custom time range.":::

### Use the single selection fixed value parameter

Fixed value parameters are based on predefined values specified by the user. The following example shows you how to create a single selection fixed value parameter.

#### Create a fixed value parameter

1. Select **Parameters** to open the **Parameters** pane and select **New parameter**.

1. Fill in the details as follows:

    * **Label**: Company
    * **Parameter type**: Single selection
    * **Variable name**: `_company`
    * **Data type**: String
    * **Pin as dashboard filter**: checked
    * **Source**: Fixed values

    In this example, use the following values:

    | Value      | Parameter display name |
    |------------|------------------------|
    | google/    | Google                 |
    | microsoft/ | Microsoft              |
    | facebook/  | Facebook               |
    | aws/       | AWS                    |
    | uber/      | Uber                   |

    * Add a **Select all** value: Unchecked
    * Default value: Microsoft

1. Select **Done** to create the parameter.

The parameter can be seen in the **Parameters** side pane, but aren't currently being used in any visuals.

#### Use the parameter

1. Run a sample query using the new *Company* parameter by using the `_company` variable name:

    ```kusto
    EventsAll
    | where CreatedAt > ago(7d)
    | where Type == "WatchEvent"
    | where Repo.name has _company
    | summarize WatchEvents=count() by RepoName = tolower(tostring(Repo.name))
    | top 5 by WatchEvents
    ```

    The new parameter shows up in the parameter list at the top of the dashboard.

1. Select different values to update the visuals.

    :::image type="content" source="media/dashboard-parameters/top-five-repos.png" alt-text="top five repos result.":::

### Use the multiple-selection fixed-value parameters

Fixed value parameters are based on predefined values specified by the user. The following example shows you how to create and use a multiple-selection fixed-value parameter.

#### Create the parameters

1. Select **Parameters** to open the **Parameters** pane and select **New parameter**.

1. Fill in the details as mentioned in [Use the single selection fixed value parameter](#use-the-single-selection-fixed-value-parameter) with the following changes:

    * **Label**: Companies
    * **Parameter type**: Multiple selection
    * **Variable name**: `_companies`

1. Select **Done** to create the parameter.

The new parameters can be seen in the **Parameters** side pane, but aren't currently being used in any visuals.

#### Use the parameters

1. Run a sample query using the new *companies* parameter by using the `_companies` variable.

    ```kusto
    EventsAll
    | where CreatedAt > ago(7d)
    | extend RepoName = tostring(Repo.name)
    | where Type == "WatchEvent"
    | where RepoName has_any (_companies)
    | summarize WatchEvents=count() by RepoName
    | top 5 by WatchEvents
    ```

    The new parameter shows up in the parameter list at the top of the dashboard.

1. Select one or more different values to update the visuals.

    :::image type="content" source="media/dashboard-parameters/select-companies.png" alt-text="select companies.":::

### Use the single selection query-based parameter

Query-based parameter values are retrieved during dashboard loading by executing the parameter query. The following example shows you how to create and use a single selection query-based parameter.

#### Create a single selection parameter

1. Select **Parameters** to open the **Parameters** pane and select **New parameter**.

1. Fill in the details as mentioned in [Use the single selection fixed value parameter](#use-the-single-selection-fixed-value-parameter) with the following changes:

    * **Label**: Event
    * **Variable name**: `_event`
    * **Source**: Query
    * **Data source**: GitHub
    * Select **Add query** and enter the following query. Select **Done**.

    ```kusto
    EventsAll
    | distinct Type
    | order by Type asc
    ```

    * **Value**: Type
    * **Display name**: Type
    * **Default value**: WatchEvent

1. Select **Done** to create the parameter.

#### Use a parameter in the query

1. The following sample query with the new Event parameter uses the `_event` variable:

    ``` kusto
    EventsAll
    | where Type has (_event)
    | summarize count() by Type, bin(CreatedAt,7d)
    ```

    The new parameter shows up in the parameter list at the top of the dashboard.

1. Select different values to update the visuals.

### Use the multiple-selection query-based parameter

Query-based parameter values are derived at dashboard load time by executing the user specified query. The following example shows how to can create a multiple-selection query-based parameter:

#### Create a query-based parameter

1. Select **Parameters** to open the **Parameters** pane and select **+ New parameter**.

1. Fill in the details as mentioned in [Use the single selection fixed value parameter](#use-the-single-selection-fixed-value-parameter) with the following changes:

    * **Label**: Events
    * **Parameter type**: Multiple selection
    * **Variable name**: `_events`

1. Select **Done** to create the parameter.

#### Use the parameter in a query

1. The following sample query uses the new *Events* parameter by using the `_events` variable.

    ``` kusto
    EventsAll
    | where Type in (_event) or isempty(_events)
    | summarize count() by Type, bin(CreatedAt,7d)
    ```

    > [!NOTE]
    > This sample uses the **Select All** option by checking for empty values with the `isempty()` function.

    The new parameter shows up in the parameter list at the top of the dashboard.

1. Select one or more different values to update the visuals.

### Use the free text parameter

Free text parameters don't contain any values. They allow you to introduce your own value.

#### Create a free text parameter

1. Select **Parameters** to open the **Parameters** pane and select **+ New parameter**.
1. Fill in the details as follows:
    * **Label**: Company
    * **Parameter type**: Free text
    * **Variable name**: _company
    * **Data type**: String
    * **Pin as dashboard filter**: checked
    * **Default value**: No default value

#### Use the parameter in a query

1. Run a sample query using the new *Company* parameter by using the `_company` variable name:

    ```kusto
    EventsAll
    | where CreatedAt > ago(7d)
    | where Type == "WatchEvent"
    | where Repo.name has _company
    | summarize WatchEvents=count() by RepoName = tolower(tostring(Repo.name))
    | top 5 by WatchEvents
    ```

### Use the data source parameter

Once you have [added data sources](azure-data-explorer-dashboards.md#add-data-source) to your dashboard, you can create a parameter that selects one or more of the available data sources. This parameter can be used in tiles and other parameters.

#### Create a data source parameter

1. Select **Parameters** to open the **Parameters** pane and select **+ New parameter**.
1. Fill in the details as follows:
    * **Label**: Cluster
    * **Parameter type**: Data source
    * **Show on pages**: Select all
    * **Values**: Select all
    * **Default value**: Samples

    :::image type="content" source="media/dashboard-parameters/data-source-parameter.png" alt-text="Screenshot of data source parameters.":::

1. Select **Done**.

The new parameter is now visible in the parameter list at the top of the dashboard.

#### Use the parameter in a query

1. Navigate to the query of a new or existing tile.
1. In **Source**, select the name of your new parameter under **Data source parameters**. For the above-created parameter, select **Cluster**

    :::image type="content" source="media/dashboard-parameters/data-source-parameter-in-query.png" alt-text="Screenshot of selecting a data source parameter in the query.":::

1. Select **Apply changes**.
1. Use the **Cluster** parameter to change the data source for this connected query.

## Use cross-filters as dashboard parameters

Cross-filters allow you to select a value in one visual and all dashboard visuals, such as line or scatter charts, are filtered to only show related data. Using cross-filters achieves the same result as selecting the equivalent value for the parameter in the parameter list at the top of the dashboard.

### Define cross-filters

To create a cross-filter, you must turn it on in the visual and then specify the parameter that is used to filter the data.

1. Edit the dashboard, and then edit the visual where you want to add cross-filters.
1. Select **Visual**.
1. In the right pane, select **Interactions**, and then turn on cross-filters.
1. Specify both the column that will be used to provide the value and a parameter used to filter the visuals' query.

    > [!IMPORTANT]
    > The column and parameter must be of the same data type.

:::image type="content" source="media/dashboard-parameters/cross-filter-query.png" alt-text="Screenshot of the edit visual page, showing the interactions tab.":::

## Interact with your data using cross-filter

Once the cross-filter is defined, you can use it to interact with your data. In visuals where you've defined cross-filters, you can select data points and use their values to filter the current dashboard page. For table visuals, select data points by right-clicking on the relevant cell and then in the context menu, select **Cross-filter**.

:::image type="content" source="media/dashboard-parameters/cross-filter-query.png" alt-text="Screenshot of a table visual, showing the cross-filter context menu option.":::

You can reset the cross-filter by selecting **Reset** at the top of the visual where it was selected.

:::image type="content" source="media/dashboard-parameters/cross-filter-reset.png" alt-text="Screenshot of a table visual, showing the reset button.":::

## Use drillthroughs as dashboard parameters

With drillthrough, you can select a value in a visual and use it to filter the visuals in a target page in the same dashboard. When the target page opens, the value is preselected in the relevant filters. The visuals on the page, such as line or scatter charts, are filtered to only show related data.

### Define a drillthrough

To create a drillthrough, you must first turn it on in the visual and then add one or more drillthroughs as required.

1. Edit the dashboard.

    :::image type="content" source="media/dashboard-parameters/drillthrough-edit.png" alt-text="Screenshot of the dashboard menu, showing the edit option.":::

1. Edit the visual where you want to add a drillthrough. Make sure that the **Visual** tab is selected.

    :::image type="content" source="media/dashboard-parameters/drillthrough-visual-edit.png" alt-text="Screenshot of a dashboard visual, showing the edit option.":::

1. In the right pane, select **Interactions**, then turn on drillthrough.

    :::image type="content" source="media/dashboard-parameters/drillthrough-visual-create.png" alt-text="Screenshot of drillthrough page, showing the turn on option.":::

1. Under **Drillthrough**, select **Create new**, and specify the following information. Optionally select **Add another pair** to add multiple parameters for a target page. Repeat this step to add drillthroughs to other pages in the current dashboard using different parameters.

    | Field | Description |
    |--|--|
    | Destination page | One or more target pages to drill through to using the defined parameters. |
    | Column | The query result's column to use as the value for a parameter in the target page. |
    | Parameter | The parameter used to filter visuals in the target page using the column value. |
    | Notes | Optional short description. |

    > [!IMPORTANT]
    > Column and parameter pairs must be of the same data type.

    :::image type="content" source="media/dashboard-parameters/drillthrough-visual-create-form.png" alt-text="Screenshot of drillthrough form, highlighting the fields to fill out.":::

## Interact with your data using drillthroughs

Once drillthroughs are defined, you can use them to interact with your data. To do so, in visuals or tables where you've defined a drillthrough, right-click on a data point, and then select **Drill through to** > *destination page*. The values from the data point will be used as the parameters to filter the visuals on the target page.

:::image type="content" source="media/dashboard-parameters/drillthrough-example.png" alt-text="Screenshot of a dashboard visual, showing the drillthrough interaction.":::

To return to the source page, in the top-right of the destination page, select **Back**. All filters assigned by the drillthrough will be reset.

## Use filter search for single and multiple selection filters

In single and multiple selection filters, type the value that you want. The filter search will present only the recently retrieved values that match the search term.

## Next Steps

* Get data with the [ingestion wizard](ingest-data-wizard.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Customize Azure Data Explorer dashboard visuals](dashboard-customize-visuals.md)
