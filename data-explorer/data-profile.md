---
title: Access the data profile of a table
description: Learn how to access the data profile of a table in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 01/15/2024
---

# Access the data profile of a table

The data profile feature in the Azure Data Explorer web UI allows you to quickly gain insights into the data within your tables. It features a time chart illustrating data distribution according to a specified `datetime` field and presents each column of the table along with essential related statistics. This article explains how to access and understand the data profile of a table.

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

[!INCLUDE [data-profile](includes/cross-repo/data-profile.md)]

## Related content

* [Write Kusto Query Language queries in the Azure Data Explorer web UI](web-ui-kql.md)
* [Explore the Azure Data Explorer web UI results grid](web-results-grid.md)
* [Customize settings in the Azure Data Explorer web UI](web-customize-settings.md)
