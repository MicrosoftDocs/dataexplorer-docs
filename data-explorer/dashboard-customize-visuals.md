---
title: Customize Azure Data Explorer Visuals
description: Easily customize your Azure Data Explorer Visuals
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: gabil
ms.service: data-explorer
ms.topic: reference
ms.date: 08/16/2020
---

# Customize Azure Data Explorer dashboard visuals

Visuals are essential part of any Azure Data Explorer Dashboard. This document details the different visual types and describes various options that are available to dashboard users to customize their visuals.

> [!NOTE]
> Visual customization is available in edit mode to dashboard editors.

## Prerequisites

[Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)

## Types of visuals

Azure Data Explorer supports several different types of visuals. This section describes the data columns needed in your result set to plot these visuals.

|Type  |Description |
|---------|---------|
|**Table**    |    Default - results are shown as a table.   |
|**Bar chart**    |   Need minimum 2 columns. First column is the x-axis and can be text, datetime or numeric. Other columns are numeric, displayed as horizontal strips.   |
|**Column chart**    |   Like **Bar Chart** with vertical strips instead of horizontal strips.   |
|**Area chart**     |   First column is the x-axis and should be a numeric column. Other numeric columns are y-axes.      |
|**Line chart**     |     First column is the x-axis. Other numeric columns are y-axes.     |
|**Stat**     |    Only shows one element. If there are multiple columns and rows in the output this will show the first element of the first column.     |
|**Pie chart**     |    First column is color-axis, second column is numeric.     |
|**Scatter chart**     |    First column is the x-axis and should be a numeric column. Other numeric columns are y-axes.     |
|**Time chart**     |    Line graph. First column is x-axis, and should be datetime. Other (numeric) columns are y-axes. There is one string column whose values are used to "group" the numeric columns and create different lines in the chart (further string columns are ignored)     |
|**Anomaly chart**     |    TBD     |
|**Map**     |    Map needs 4 columns to render. <ul><li>First column should be string and is used for label which is shown on hover.</li><li>Longitude (real).</li><li>Latitude (real).</li><li>Bubble size (int). This can be constant 1 if different sizes are not required</li>   |

## Access the visual customization dialogue

To access the visual customization dialogue, select **Edit Card** option on the cards. This is also visible at the time of creating a new card using **Add Query**

:::image type="content" source="Edit card.png" alt-text="parameters button top of dashboard":::

## Customize visuals using properties

This section lists the various properties which can be changed to customize visuals.

:::image type="content" source="Visual customization sidebar.png" alt-text="blalbla":::

|Property  |Description |
|---------|---------|
|**General**    |    Select the **stacked** or **non stacked** chart format for **Bar**, **Line** and **Area charts**   |
|**Data**    |   Select **Y and X Columns** for your visual. Keep the selection as **Infer** if you want the platform to automatically select a column based on the query result    |
|**Legend**    |   Toggle to show or hide the display of legends on your visuals   |
|**Y Axis**     |   Allows customization of Y-Axis properties: <ul><li>**Label**: Text for a custom label. </li><li>**Maximum Value**: Change the maximum value of the Y axis.  </li><li>**Minimum Value**: Change the minimum value of the Y axis.  </li></ul>      |
|**X Axis**     |    Allows customization of X-Axis properties: <ul><li>**Label**: Text for a custom label. </li>     |

## Next steps

[Use parameters in Azure Data Explorer dashboards](../../Source/repos/dataexplorer-docs-pr/data-explorer/dashboard-parameters.md)