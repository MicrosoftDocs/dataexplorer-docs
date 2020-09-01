---
title: Parameters in Azure Data Explorer dashboards
description: Use parameters as a building block for dashboard filters.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: how-to
ms.date: 06/09/2020
---

# Use parameters in Azure Data Explorer dashboards

Parameters are used as building blocks for dashboard filters in Azure Data Explorer dashboards. They're managed in the dashboard scope, and can be added to queries to filter the data presented by the underlying visual. A query can use one or more parameters. This document describes the creation and use of parameters and linked filters in Azure Data Explorer dashboards. 

> [!NOTE]
> Parameter management is available in edit mode to dashboard editors.

## Prerequisites

[Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)

## View parameters list

Select the **Parameters** button at the top of the dashboard to view the list of all dashboard parameters.

:::image type="content" source="media/dashboard-parameters/dashboard-icons.png" alt-text="parameters button top of dashboard":::

## Create a parameter

To create a parameter, select the **New parameter** button at the top of the right pane.

:::image type="content" source="media/dashboard-parameters/new-parameter-button.png" alt-text="New parameters button":::

### Properties

1. In the **Add parameter** pane, configure the properties detailed below.

:::image type="content" source="media/dashboard-parameters/properties.png" alt-text="add parameter properties":::

|Field  |Description |
|---------|---------|
|**Parameter display name**    |   The name of the parameter shown on the dashboard or the edit card.      |
|**Parameter type**    |One of the following:<ul><li>**Single selection**: Only one value can be selected in the filter as input for the parameter.</li><li>**Multiple selection**: One or more values can be selected in the filter as input(s) for the parameter.</li><li>**Time range**: Allows creating additional parameters to filter the queries and dashboards based on time. Every dashboard has a time range picker by default.</li>
<li>**Free text**: Does not have any values populated in the filter. The user can type a value or copy/paste a value to the text field. The filter keeps the recent values used.</li></ul>    |
|**Variable name**     |   The name of the parameter to be used in the query.      |
|**Data type**    |    The data type of the parameter values.     |
|**Pin as dashboard filter**   |   Pin the parameter-based filter to the dashboard or unpin from the dashboard.       |
|**Source**     |    The source of the parameter values: <ul><li>**Fixed values**: Manually introduced static filter values. </li><li>**Query**: Dynamically introduced values using a KQL query.  </li></ul>    |
|**Add a “Select all” value**    |   Applicable only to single selection and multiple selection parameter types. Used to retrieve data for all the parameter values. This value should be built into the query to provide the functionality. See [Use the multiple selection query-based parameter](#use-the-multiple-selection-query-based-parameter) for more examples on building such queries.     |

## Manage parameters in parameter card

In the three dots menu in the parameter card, select **Edit**, **Duplicate parameter**, **Delete**, or **Unpin from dashboard**/**Pin to dashboard**.

The following indicators can be viewed in the parameter card:
* Parameter display name 
* Variable names 
* Number of queries in which the parameter was used
* Pin/unpin state in the dashboard

:::image type="content" source="media/dashboard-parameters/modify-parameter.png" alt-text="Modify parameters":::

## Use parameters in your query

A parameter must be used in the query to make the filter applicable for that query visual. Once defined, you can see the parameters in the **Query** page > filter top bar and in the query intellisense.

:::image type="content" source="media/dashboard-parameters/query-intellisense.png" alt-text="See parameters in top bar and intellisense":::

> [!NOTE]
> If the parameter isn't used in the query, the filter remains disabled. Once the parameter is added to the query, the filter becomes active.

## Use different parameter types

Several dashboard parameter types are supported. The following examples describe how to use parameters in a query for various parameter types. 

### Use the default Time range parameter

Every dashboard has a *Time range* parameter by default. It shows up on the dashboard as a filter only when used in a query. Use the parameter keywords `_startTime` and `__endTime` to use the default time range parameter in a query as seen in the following example:

```kusto
EventsAll
| where Repo.name has 'Microsoft'
| where CreatedAt between (_startTime.._endTime)
| summarize TotalEvents = count() by RepoName=tostring(Repo.name)
| top 5 by TotalEvents
```

Once saved, the time range filter shows up on the dashboard. Now it can be used to filter the data on the card. You can filter your dashboard by selecting from the drop down: **Time range** (last x minutes/hours/days) or a **Custom time range**.

:::image type="content" source="media/dashboard-parameters/time-range.png" alt-text="filter using custom time range":::

### Use the single selection fixed value parameter

Fixed value parameters are based on predefined values specified by the user. The following example shows you how to create a single selection fixed value parameter.

#### Create the parameter

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

:::image type="content" source="media/dashboard-parameters/start-end-side-pane.png" alt-text="start time end time parameters in side pane":::

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

    :::image type="content" source="media/dashboard-parameters/top-five-repos.png" alt-text="top five repos result":::

### Use the multiple selection fixed value parameters

Fixed value parameters are based on predefined values specified by the user. The following example shows you how to create and use a multiple selection fixed value parameter.

#### Create the parameters

1. Select **Parameters** to open the **Parameters** pane and select **New parameter**.

1. Fill in the details as mentioned in [Use the single selection fixed value parameter](#use-the-single-selection-fixed-value-parameter) with the following changes:

    * **Parameter display name**: Companies
    * **Parameter type**: Multiple selection
    * **Variable name**: `_companies`

1. Click **Done** to create the parameter.

The new parameters can be seen in the **Parameters** side pane, but aren't currently being used in any visuals.

:::image type="content" source="media/dashboard-parameters/companies-side-pane.png" alt-text="companies side pane":::

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

    :::image type="content" source="media/dashboard-parameters/select-companies.png" alt-text="select companies":::

### Use the single selection query-based parameter

Query-based parameter values are retrieved during dashboard loading by executing the parameter query. The following example shows you how to create and use a single selection query-based parameter.

#### Create the parameter

1. Select **Parameters** to open the **Parameters** pane and select **New parameter**.

2. Fill in the details as mentioned in [Use the single selection fixed value parameter](#use-the-single-selection-fixed-value-parameter) with the following changes:

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

1. The following is a sample query using the new Event parameter by using the `_ event` variable:

    ``` kusto
    EventsAll
    | where Type has (_event)
    | summarize count(Id) by Type, bin(CreatedAt,7d)
    ```

    The new parameter shows up in the parameter list at the top of the dashboard. 

1. Select different values to update the visuals.

### Use the multiple selection query-based parameter

Query-based parameter values are derived at dashboard load time by executing the user specified query. The following example shows how to can create a multiple selection query-based parameter:

#### Create a parameter

1. Select **Parameters** to open the **Parameters** pane and select **New parameter**.

1. Fill in the details as mentioned in [Use the single selection fixed value parameter](#use-the-single-selection-fixed-value-parameter) with the following changes:

    * **Parameter display name**: Events
    * **Parameter type**: Multiple selection
    * **Variable name**: `_events`

1. Click **Done** to create the parameter.

#### Use parameters in the query

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

Free text parameters don't contain any values. They allow you to introduce your own value from scratch.

#### Create the parameter

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

## Use filter search for single and multiple selection filters

In single and multiple selection filters, type the value that you want. The filter search will present all the recently retrieved values that match the search term.

## Next Steps

* [Customize dashboard visuals](dashboard-customize-visuals.md)
* [Query data in Azure Data Explorer](web-query-data.md) 

