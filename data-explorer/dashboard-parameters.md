---
title: Parameters in Azure Data Explorer dashboards
description: Use parameters as a building block for dashboard filters.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: reference
ms.date: 06/04/2020
---

# Parameters in Azure Data Explorer dashboards

Parameters are used as building blocks for dashboard filters. They're managed in the dashboard scope, and can be added to queries to filter the data presented by the underlying visual. This document describes the creation and use of parameters and linked filters in Azure Data Explorer dashboards. A query can contain one or more parameters and one or more dashboard filters.

> [!NOTE]
> Parameter management is available in edit mode to dashboard editors.

## Prerequisites

* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)

## View parameters list

Click on the **Parameters** button at the top of the dashboard to view the list of all dashboard parameters.

:::image type="content" source="media/dashboard-parameters/dashboard-icons.png" alt-text="parameters button top of dashboard":::

## Create a parameter

Select the **New parameter** button on the top of the right pane.

:::image type="content" source="media/dashboard-parameters/new-parameter-button.png" alt-text="New parameters button":::

### Properties

1. In the **Add parameter** screen, configure the properties detailed below.

:::image type="content" source="media/dashboard-parameters/properties.png" alt-text="add parameter properties":::

|Field  |Description |
|---------|---------|
|**Parameter display name**    |   The name of the parameter shown on the dashboard or the edit card.      |
|**Parameter type**    |One of the following:<ul><li>**Single selection**: Only one value can be selected in the filter as input for the parameter.</li><li>**Multiple selection**: One or more values can be selected in the filter as input(s) for the parameter.</li><li>**Time range**: Allows creating additional parameters to filter the queries and dashboards based on time.Every dashboard has a time range picker by default.</li></ul>    |
|**Variable name**     |   The name of the parameter to be used in the query.      |
|**Data type**    |    The data type of the parameter values.     |
|**Pin as dashboard filter**   |   Pin the parameter-based filter to the dashboard or unpin from the dashboard.       |
|**Source**     |    The source of the parameter values: <ul><li>**Fixed values**: Manually introduced static filter values. </li><li>**Query**: Dynamically introduced values using a KQL query.  </li></ul>    |
|**Add a “Select all” value**    |   Applicable only to single selection and multiple selection parameter types. Used to retrieve data for all the parameter values. This value should be built into the query to provide the functionality. See [Multiple selection query-based parameter](#multiple-selection-static-list-parameter) for more examples on building such queries.     |

## Modify a parameter

Modify each parameter by selecting the **Edit** option in the parameter card three dots menu. You can also delete, clone, filter pin to or unpin from the dashboard.

The following values can be viewed in the side pane:
* Parameter display name
* Variable names 
* Number of queries the parameter was used in 
* Filter pin/unpin state in the dashboard

:::image type="content" source="media/dashboard-parameters/modify-parameter.png" alt-text="Modify parameters":::

## Parameter Types

Several dashboard parameter types are supported. A parameter must be used in the query to make the filter applicable for that query visual. The following examples describe how to use the parameters in a query for various parameter types. Once defined, you can see the parameters in the **Query** page > filter top bar and in the query itself using intellisense.

### The default Time range parameter

Every dashboard has a *Time range* parameter by default. It only shows up on the dashboard as a filter when used in a query.

Use the parameter keywords `_startTime` and `__endTime` to use the default time range parameter in a query.

```kusto
EventsAll
| where Repo.name has 'Microsoft'
| where CreatedAt between (_startTime.._endTime)
| summarize TotalEvents = count() by RepoName=tostring(Repo.name)
| top 5 by TotalEvents
```

Once saved, the time range filter starts to show up on the dashboard. Now it can be used to filter the data on the card. You can filter your dashboard using either a relative time slot (last xx) or using a custom time range.

:::image type="content" source="media/dashboard-parameters/time-range.png" alt-text="filter using custom time range":::

### Single selection static list parameter

Static list-based parameters are based on predefined values specified by the user. The following example shows how to create a single selection static list-based parameter.

#### Create the parameter

1. Open the **parameters** pane and select **add new parameter** from the side bar

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

1. Click **Done** to create the parameter.
The parameter shows up in the parameter side pane, but isn't currently being used in any visuals.

:::image type="content" source="media/dashboard-parameters/startend-side-pane.png" alt-text="start time end time parameters in side pane":::

#### Use the parameter

1. Run a sample query using the *new Company* parameter by using the `_company` variable name:

    ```kusto
    EventsAll
    | where CreatedAt > ago(7d)
    | where Type == "WatchEvent"
    | where Repo.name has _company
    | summarize WatchEvents=count() by RepoName = tolower(tostring(Repo.name))
    | top 5 by WatchEvents
    ```

The new parameter shows up in the parameter list at the top of the dashboard. Select different values to see the visual
gets updated based on the selection.

:::image type="content" source="media/dashboard-parameters/topfive-repos.png" alt-text="top five repos result":::

### Multiple selection static list parameters

Static list-based parameters are based on predefined values specified by the user. The following example shows how to can create a multiple selection static
list-based parameter.

#### Create the parameter

Open the **parameters** pane and select **add new parameter option** from the side bar.

Fill in the details as mentioned in the [**Single selection static list parameter**](#single-selection-static-list-parameter) above with the below changes:

* **Parameter display name**: Companies
* **Parameter type**: Multiple selection
* **Variable name**: `_companies`

Click **Done** to create the parameter.

The new parameter shows up in the parameter side pane but isn't being used in any visuals currently.

:::image type="content" source="media/dashboard-parameters/companies-side-pane.png" alt-text="companies side pane":::

#### Use the parameter 
<!--(Gabi: this query is not working. Need your help to fix)-->

Run a sample query using the new Companies parameter by using the `_companies` variable.

```kusto
EventsAll
| where CreatedAt > ago(7d)
| where Type == "WatchEvent"
| where Repo.name in (_companies)
| summarize WatchEvents=count() by RepoName = tolower(tostring(Repo.name))
| top 5 by WatchEvents
```

The new parameter shows up in the parameter list at the top of the dashboard. Select **multiple values** to view the visual updating based on the selection.

:::image type="content" source="media/dashboard-parameters/select-companies.png" alt-text="select companies":::

### Single selection query-based parameter

Query-based parameter values are retrieved at dashboard load time by executing the parameter query. The following example shows how to create a single selection query-based parameter:

#### Create the parameter

1. Open the **parameters** pane and select **add new parameter** from the side bar.

2. Fill in the details as mentioned in the [**Single selection static list parameter**](#single-selection-static-list-parameter) above with the below changes:

    * **Parameter display name**: Event
    * **Variable name**: `_event`
    * **Source**: Query
    * **Data source**: GitHub

    * Click **Add query** and enter the below and click **done**

    ```kusto
    EventsAll
    | distinct Type
    | order by Type asc
    ```

    * **Value**: Type
    * **Display name**: Type
    * **Default value**: WatchEvent

Click **Done** to create the parameter.

#### Use a parameter in the query

Sample query using the new Event parameter by using the `_ event` variable:

``` kusto
EventsAll
| where Type in (_event)
| summarize count(Id) by Type, bin(CreatedAt,7d)
```

The new parameter shows up in the parameter list at the top of the dashboard. Select different values to see the visual updating based on the selection.

### Multiple selection query-based parameter

Query-based parameter values are derived at dashboard load time by executing the user specified query. The following example shows how to can create a multiple selection query-based parameter:

#### Create a parameter

1. Open the **parameters** pane and select **add new parameter** from the side bar.

Fill in the details as mentioned in the [**Single selection static list parameter**](#single-selection-static-list-parameter) above with the below changes:

* **Parameter display name**: Events
* **Parameter type**: Multiple selection
* **Variable name**: `_events`

Click **Done** to create the parameter.

#### Using parameter in the query

Sample query using the new Events parameter by using the `_events` variable:
This sample uses the **Select All** option by checking for empty values with the `isempty()` function.

``` kusto
EventsAll
| where Type in (_event) or isempty(_events)
| summarize count(Id) by Type, bin(CreatedAt,7d)
```

The new parameter shows up in the parameter list at the top of the dashboard. Select different values to see the visual updating based on the selection.
