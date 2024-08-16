---
title: Access the data profile of a table
description: Learn how to access the data profile of a table in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: how-to
ms.date: 03/12/2024
---

# Access the data profile of a table

The data profile feature in the Azure Data Explorer web UI allows you to quickly gain insights into the data within your tables. It features a time chart illustrating data distribution according to a specified `datetime` field and presents each column of the table along with essential related statistics. This article explains how to access and understand the data profile of a table.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Open the data profile

To open the data profile view for a table:

1. From the left menu, select **Query**.
1. Right-click the desired table, and select **Data profile**:

    :::image type="content" source="media/data-profile/data-profile-in-menu.png" alt-text="Screenshot of data profile in menu.":::

The data profile for the selected table view opens in a side window.

> [!NOTE]
> The data profile is based on data from the [hot cache](kusto/management/cache-policy.md).

## Filter data by time range

To filter the data presented in the data profile by ingestion time, select one of the tabs at the top of the profile. These tabs allow you to filter by one day (`1d`), one week (`7d`), one month (`30d`), one year (`365d`) or the full time range of your data (`max`).

:::image type="content" source="media/data-profile/data-profile-filter-time-range.png" alt-text="Screenshot of the time range filter tabs.":::

## View data distribution by other `datetime` columns

By default, the time chart shows the data distribution by ingestion time. To view the distribution by a different `datetime` column, select the dropdown tab at the top right of the chart.

:::image type="content" source="media/data-profile/data-profile-filter-time-chart.png" alt-text="Screenshot of the time chart filter.":::

## View columns and their top values

You can browse the table schema in the profile by looking at the columns or finding a particular column. You can also choose columns to see their top values, value distributions, and sample values depending on their data type, as follows:

|Type|Statistic|On selection|
|--|--|--|
|string|Count of unique values| Top 10 values|
|numeric|Minimum and maximum values| Top 10 values|
|datetime|Date range| Top 10 values|
|dynamic|No specific statistic|Random sampled value|
|bool|No specific statistic|Count of true and false|

For example, in the following image, the `ColorName` column of type `string` is selected:

:::image type="content" source="media/data-profile/data-profile-columns.png" alt-text="Screenshot of example column selected.":::

## Related content

* [Write Kusto Query Language queries in the Azure Data Explorer web UI](web-ui-kql.md)
* [Explore the Azure Data Explorer web UI results grid](web-results-grid.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
