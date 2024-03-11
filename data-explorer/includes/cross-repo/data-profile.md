---
title: data profile include file
description: data profile include file
ms.topic: include
ms.date: 03/11/2024
ms.reviewer: mibar
ms.custom: include file
---
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
