---
title: Change the retention policy for a table in Azure Data Explorer using the table retention policy wizard
description: In this article, you learn how to change a table's retention policy using the retention policy wizard.
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 09/14/2022
---
# Create a table's retention and cache policies with the table retention policy wizard

The [retention policy](kusto/management/retentionpolicy.md) controls the mechanism that automatically removes data from tables. It's used to remove data whose relevance is age-based.

The [cache policy](kusto/management/cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority. The cache policy defines how much data will be available in a local SSD or RAM. Data is queried faster when it's in a local SSD, particularly for queries that scan large amounts of data. However, a local SSD can cost much more.

In this article, you can define and assign a retention policy and a cache policy for a table using the table retention policy wizard.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Define and assign a table retention policy

1. In the left menu of the [Azure Data Explorer web UI](https://dataexplorer.azure.com/) select the **Data** tab, [or use the link](https://dataexplorer.azure.com/oneclick).

    :::image type="content" source="media/one-click-table-policies/one-click-retention-policy-start.png" alt-text="Screenshot of Data management screen showing the table retention policy wizard in the Azure Data Explorer web UI.":::

1. In the **Table retention policy** tile, select **Update**.

The **Table retention policy** window opens with the **Policy update** tab selected.

### Policy update

:::image type="content" source="media/one-click-table-policies/one-click-retention.png" alt-text="Screen shot of Update table retention policy page. Cluster, Database, Table and Policy fields must be filled out before proceeding to Update.":::

1. The **Cluster** and **Database** fields are auto-populated. You may select a different cluster or database from the drop-down menus, or [add a cluster connection](create-cluster-and-database.md).

1. Under **Table**, select a table from the drop-down menus.

1. Under **Retention policy**, toggle **On** to apply the retention policy values from the database to the table. To create or update a separate policy for the table, toggle to **Off**.

1. If you selected **Off** for a separate retention policy, you can fill in the following fields:

    |**Setting** | **Default value** | **Field description**
    |---|---|---|
    | Recoverability | *Yes*  | Enable or disable data recoverability. |
    | Retention period |  *365* | The number of days that data is stored in long-term storage before it's deleted. The period is measured from the time that the data is ingested.  |

1. Under **Cache policy**, toggle **On** to apply the caching policy values from the database to the table. To create or update a separate policy for the table, toggle to **Off**.

1. If you selected **Off** for a separate cache policy, fill in the following fields:

    |**Setting** | **Default value** | **Field description**
    |---|---|---|
    | Data (days) | *31* | The number of days that frequently queried data is available in RAM or SSD storage where it can be rapidly accessed to optimize query performance. |
    | Index (days) |  *31*  | The amount of time for indexed access to data stored in external storage.  |

1. Select **Update**.

## Summary

In the **Summary** tab, all steps will be marked with green check marks when the update finishes successfully. The tiles below these steps give you options to explore your data with **Quick queries**, or undo changes made using **Tools**.

:::image type="content" source="media/one-click-table-policies/one-click-table-retention-policy-finished.png" alt-text="Screenshot of final screen in the update table retention policy wizard for Azure Data Explorer.":::

## Related content

* [Write queries using Kusto Query Language](kusto/query/tutorials/learn-common-operators.md)
