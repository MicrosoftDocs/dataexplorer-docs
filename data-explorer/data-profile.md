---
title: Access the data profile of a table
description: Learn how to access the data profile of a table in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 12/20/2023
---

# Access the data profile of a table

The data profile feature in the Azure Data Explorer web UI provides a fast way to gain insights into the data within your tables. It features a time chart illustrating data distribution according to a specified datetime field and presents each column of the table along with essential related statistics. This article explains how to access and understand the data profile of a table.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Open the data profile

To open the data profile view for a table:

1. From the left menu, select **Query**.
1. There are two ways to open the data profile:

     * Right-click the desired table, and select **Data profile**:

         :::image type="content" source="media/data-profile/data-profile-in-menu.png" alt-text="Screenshot of data profile in menu.":::
     
     * Select the desired table, and then select the **Data profile** icon in the top bar:

         :::image type="content" source="media/data-profile/data-profile-button.png" alt-text="Screenshot of the button to open the data profile view.":::

The data profile for the selected table view opens in a side window.

> [!NOTE]
> The data profile is based on data from the [hot cache](kusto/management/cache-policy.md).

## Filter data by time range

To filter the data presented in the data profile by ingestion time, select one of the tabs at the top of the profile. These tabs allow you to filter by one day (`1d`), one week (`7d`), one month (`30d`), one year (`365d`) or the full time range of your data (`max`). 

:::image type="content" source="media/data-profile/data-profile-filter-time-range.png" alt-text="Screenshot of the time range filter tabs.":::


## Filter time chart by datetime columns

To filter the time chart by a different datetime column, select the dropdown tab at the top right of the chart. All of the filter options will be presented there, which will include the ingestion time as well as any other datetime columns.

:::image type="content" source="media/data-profile/data-profile-filter-time-chart.png" alt-text="Screenshot of the time chart filter.":::

## View columns and their top values

Within the profile, you can explore information about columns and their top values. Each column name is accompanied by a relevant statistic based on its data type, and selecting the column reveals more details specific to that data type:

|Type|Statistic|On selection|
|--|--|--|
|string|Count of unique values| Top 10 values|
|numeric|Minimum and maximum values| Top 10 values|
|datetime|Date range| Top 10 values|
|dynamic|No specific statistic|Random sampled value|
|bool|No specific statistic|Count of true and false|

For example, in the following image, the `Manufacturer` column of type string is selected:

:::image type="content" source="media/data-profile/data-profile-columns.png" alt-text="Screenshot of example column selected.":::

## Related content

* [Write Kusto Query Language queries in the Azure Data Explorer web UI](web-ui-kql.md)
* [Explore the Azure Data Explorer web UI results grid](web-results-grid.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
