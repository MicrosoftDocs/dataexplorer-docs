---
title: Parameters in Azure Data Explorer dashboards
description: Use parameters as a building block for dashboard filters.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 11/16/2021
---

# Use parameters in Azure Data Explorer dashboards

Parameters are used as building blocks for dashboard filters in Azure Data Explorer dashboards. They're managed in the dashboard scope, and can be added to queries to filter the data presented by the underlying visual. A query can use one or more parameters. This document describes the creation and use of parameters and linked filters in Azure Data Explorer dashboards. Parameters can be used to slice and dice dashboard visuals either directly by selecting [parameter values in the filter bar](#use-parameters-in-your-query) or by using [cross-filters](#use-cross-filters-as-dashboard-parameters).

> [!NOTE]
> Parameter management is available in edit mode to dashboard editors.

## Prerequisites

[Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)

## View parameters list

Select the **Parameters** button at the top of the dashboard to view the list of all dashboard parameters.

:::image type="content" source="media/dashboard-parameters/dashboard-icons.png" alt-text="parameters button top of dashboard.":::

## Create a parameter

To create a parameter, select the **New parameter** button at the top of the right pane.

:::image type="content" source="media/dashboard-parameters/new-parameter-button.png" alt-text="New parameters button.":::

### Properties

In the **Add parameter** pane, configure the properties detailed below.

:::image type="content" source="media/dashboard-parameters/properties.png" alt-text="add parameter properties.":::

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

In the three dots menu in the parameter card, select **Edit**, **Duplicate parameter**, **Delete**, or **Move to**.

The following indicators can be viewed in the parameter card:

* Parameter display name
* Variable names
* Number of queries in which the parameter was used
* Pages the parameter is pinned to

The parameter cards can be ordered by drag and drop or by using the **Move to >** and select the new location

:::image type="content" source="media/dashboard-parameters/modify-parameter.png" alt-text="Modify parameters.":::

## Use parameters in your query

A parameter must be used in the query to make the filter applicable for that query visual. Once defined, you can see the parameters in the **Query** page > filter top bar and in the query intellisense.

:::image type="content" source="media/dashboard-parameters/query-intellisense.png" alt-text="See parameters in top bar and intellisense.":::

> [!NOTE]
> If the parameter isn't used in the query, the filter remains disabled. Once the parameter is added to the query, the filter becomes active.

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

    * **Parameter display name**: Company
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

The parameters can be seen in the **Parameters** side pane, but aren't currently being used in any visuals.

:::image type="content" source="media/dashboard-parameters/start-end-side-pane.png" alt-text="start time end time parameters in side pane.":::

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

    * **Parameter display name**: Companies
    * **Parameter type**: Multiple selection
    * **Variable name**: `_companies`

1. Click **Done** to create the parameter.

The new parameters can be seen in the **Parameters** side pane, but aren't currently being used in any visuals.

:::image type="content" source="media/dashboard-parameters/companies-side-pane.png" alt-text="companies side pane.":::

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

    * **Parameter display name**: Event
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
    | summarize count(Id) by Type, bin(CreatedAt,7d)
    ```

    The new parameter shows up in the parameter list at the top of the dashboard.

1. Select different values to update the visuals.

### Use the multiple-selection query-based parameter

Query-based parameter values are derived at dashboard load time by executing the user specified query. The following example shows how to can create a multiple-selection query-based parameter:

#### Create a query-based parameter

1. Select **Parameters** to open the **Parameters** pane and select **New parameter**.

1. Fill in the details as mentioned in [Use the single selection fixed value parameter](#use-the-single-selection-fixed-value-parameter) with the following changes:

    * **Parameter display name**: Events
    * **Parameter type**: Multiple selection
    * **Variable name**: `_events`

1. Click **Done** to create the parameter.

#### Use the parameters in the query

1. The following sample query uses the new *Events* parameter by using the `_events` variable.

    ``` kusto
    EventsAll
    | where Type in (_event) or isempty(_events)
    | summarize count(Id) by Type, bin(CreatedAt,7d)
    ```

    > [!NOTE]
    > This sample uses the **Select All** option by checking for empty values with the `isempty()` function.

    The new parameter shows up in the parameter list at the top of the dashboard.

1. Select one or more different values to update the visuals.

### Use the free text parameter

Free text parameters don't contain any values. They allow you to introduce your own value.

#### Create a free text parameter

1. Select **Parameters** to open the **Parameters pane** and select **New parameter**.
1. Fill in the details as follows:
    * **Parameter display name**: Company
    * **Parameter type**: Free text
    * **Variable name**: _company
    * **Data type**: String
    * **Pin as dashboard filter**: checked
    * **Default value**: No default value

#### Use parameters in the query

1. Run a sample query using the new *Company* parameter by using the `_company` variable name:

    ```kusto
    EventsAll
    | where CreatedAt > ago(7d)
    | where Type == "WatchEvent"
    | where Repo.name has _company
    | summarize WatchEvents=count() by RepoName = tolower(tostring(Repo.name))
    | top 5 by WatchEvents
    ```

The new parameter is now visible in the parameter list at the top of the dashboard.

## Use cross-filters as dashboard parameters

Cross-filters allow you to select a value in one visual and all dashboard visuals, such as line or scatter charts, are filtered to only show related data. Using cross-filters achieves the same result as selecting the equivalent value for the parameter in the parameter list at the top of the dashboard.

### Define cross-filters

To create a cross-filter, you must enable it in the visual and the specify the parameter that is used to filter the data.

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

## Use drillthrough as dashboard parameters

drillthrough allows you to select a value in one visual and use the value as a filter in a target dashboard page to filter the page visuals, such as line or scatter charts, are filtered to only show related data. Using drillthrough achieves the same result as navigating to the target dashboard page and selecting the equivalent value for the parameter in the parameter list at the top of the dashboard.

### Define drillthroughs

To create a drillthrough, you must enable it in the visual, select the target page(s) and specify the parameter that is used to filter the data.

1. Edit the dashboard, and then edit the visual where you want to add drillthrough.
1. Select **Visual**.
1. In the right pane, select **Interactions**, then turn on drillthrough and select **Create new drillthrough**.
3. Specify the destination page(s) that you can drill through to from the current visual. You can select one or more pages (pending they were not already used as target pages in the current visual. In addition, specify the column that will be used to provide the value for a parameter used to filter the visual's query. You can also add a short description in the notes control.

    > [!IMPORTANT]
    > The column and parameter must be of the same data type.

:::image type="content" source="media/dashboard-parameters/cross-filter-query.png" alt-text="Screenshot of the edit visual page, showing the interactions tab.":::

## Interact with your data using drillthrough

Once the drillthrough is defined, you can use it to interact with your data. In visuals where you've defined a drillthrough, you can select a data point and use its value to filter the destination dashboard page. For table visuals, select data points by right-clicking on the relevant cell and then in the context menu, select **Drill through to**.

:::image type="content" source="media/dashboard-parameters/cross-filter-query.png" alt-text="Screenshot of a table visual, showing the cross-filter context menu option.":::

By selecting the **Back** arrow at the top right side of the dashboard page you will navigte to the previous (source) page and all filtersassigned by the drill through will be removed.

:::image type="content" source="media/dashboard-parameters/cross-filter-reset.png" alt-text="Screenshot of a table visual, showing the reset button.":::

## Use filter search for single and multiple selection filters

In single and multiple selection filters, type the value that you want. The filter search will present only the recently retrieved values that match the search term.

## Next Steps

* [Customize dashboard visuals](dashboard-customize-visuals.md)
* [Query data in Azure Data Explorer](web-query-data.md)
