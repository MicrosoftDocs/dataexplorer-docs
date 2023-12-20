---
title: Access the data profile of a table
description: Learn how to access the data profile of a table in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 12/20/2023
---

# Access the data profile of a table

The data profile feature in the Azure Data Explorer web UI provides a fast way to gain insights into the data within your tables.

When you open a data profile, a time chart illustrates the records ingested over time or the distribution of data based on a specified datetime field. The data profile provides quick access to column names, types, essential statistics, and top values within each column.

This article guides you through the process of accessing and interpreting the data profile of a table.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Open the data profile

To open the data profile view for a table:

1. From the left menu, select **Query**.
1. Select the desired table.
1. Select the **Data profile** icon in the top bar:

    :::image type="content" source="media/data-profile/data-profile-button.png" alt-text="Screenshot of the button to open the data profile view.":::

The data profile for the selected table view opens in a side window.

## Explore the data profile

Within the profile, explore information about columns and their top values.

Each column name is accompanied by a relevant statistic based on its data type, and selecting the column reveals more details specific to that data type:

|Type|Statistic|On selection|
|--|--|--|
|string|Count of unique values| Top 10 values|
|numeric|Minimum and maximum values| Top 10 values|
|datetime|Date range| Top 10 values|
|dynamic|No specific statistic|Random sampled value|
|bool|No specific statistic|Count of true and false|

For example, in the following image, the `Manufacturer` column of type string is selected:

:::image type="content" source="media/data-profile/data-profile-columns.png" alt-text="Screenshot of example column selected.":::

## Write queries with an open data profile

You can pin the data profile to keep it visible while writing queries. This view is valuable for quickly accessing available column names or understanding the structure of columnar data while crafting queries.

To pin the data profile, select the **Pin** icon in the upper corner:

:::image type="content" source="media/data-profile/data-profile-pin.png" alt-text="Screenshot of option to pin data profile.":::

This selection opens the pinned view, which helps you write queries with access to sample data:

<!-- TO DO: Create a GIF that uses a string and a dynamic field to create a query quickly. -->

:::image type="content" source="media/data-profile/data-profile-pinned-view.png" alt-text="Screenshot of pinned view.":::

> [!TIP]
> While in the pinned view, you can choose different tables in the connection pane to switch the data profile view from one table to another.

To unpin the data profile, select the **Unpin** button in the upper corner of the profile pane:

:::image type="content" source="media/data-profile/data-profile-unpin.png" alt-text="Screenshot of option to unpin data profile.":::

## Related content

* [Write Kusto Query Language queries in the Azure Data Explorer web UI](web-ui-kql.md)
* [Explore the Azure Data Explorer web UI results grid](web-results-grid.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
