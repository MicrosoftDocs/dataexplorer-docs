---
title: Gain quick insights into table data
description: Learn how to gain quick insights into table data in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 12/18/2023
---

# Gain quick insights into table data

The data profile feature in the Azure Data Explorer web UI provides a fast way to gain insights into the data within your tables.

When you open a data profile, a time chart illustrates the records ingested over time or the distribution of data based on a specified datetime field. The data profile provides quick access to column names, types, essential statistics, and top values within each column.

This article guides you through the process of accessing and interpreting the data profile of a table.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* Sign in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Open the data profile view

To open the data profile view for a table:

1. From the left menu, select **Query**.
1. Select the desired table.
1. Select the data profile icon in the top bar:

    :::image type="content" source="media/data-profile/data-profile-view.png" alt-text="Screenshot of the icon to open the data profile view.":::

The data profile for the selected table view opens in a side window.

To switch tables, select the table name at the top of the data profile, and a dropdown opens with all other tables in the context database:

:::image type="content" source="media/data-profile/data-profile-switch-tables.png" alt-text="Screenshot of option to switch tables.":::

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

This selection opens the pinned view, which looks like this:

:::image type="content" source="media/data-profile/data-profile-pinned-view.png" alt-text="Screenshot of pinned view.":::

> [!TIP]
> While in the pinned view, you can choose different tables in the connection pane to switch the data profile view from one table to another.

To unpin the data profile, select the **Unpin** button in the upper corner of the profile pane:

:::image type="content" source="media/data-profile/data-profile-unpin.png" alt-text="Screenshot of option to unpin data profile.":::

## Related content

* [Write Kusto Query Language queries in the Azure Data Explorer web UI](web-ui-kql.md)
* [Explore the Azure Data Explorer web UI results grid](web-results-grid.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
