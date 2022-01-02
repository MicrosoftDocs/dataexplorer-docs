---
title: Use the one-click table retention policy wizard to change the retention policy for a table in Azure Data Explorer.
description: In this article, you learn how to change a table's retention policy using the one-click experience.
author: orspod+
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: how-to
ms.date: 01/02/2022
---
# Use one-click to update a table's retention policy

The [retention policy](kusto/management/retentionpolicy.md) controls the mechanism that automatically removes data from tables. It is used to remove data whose relevance is age-based. In this article, you can define and assign a retention policy for a table using the one-click experience.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Create [a cluster and database](create-cluster-database-portal.md).

## Define and assign a table retention policy

1. In the left menu of the [Web UI](https://dataexplorer.azure.com/), select the **Data** tab. 

    :::image type="content" source="media/one-click-table-policies/one-click-retention-policy-start.png" alt-text="Select one-click table retention policy in the web UI.":::

1. In the **Table retention policy** card, select **Update**. 

The **Table retention policy** window opens with the **Policy update** tab selected.

### Policy update
 
:::image type="content" source="media/one-click-table-policies/one-click-retention.png" alt-text="Screen shot of table retention policy tab. Cluster, Database, Table and Policy fields must be filled out before proceeding to Update.":::

1. The **Cluster** and **Database** fields are auto-populated. You may select a different cluster or database from the drop-down menus, or add a cluster connection.

1. Under **Table**, select a table from the drop-down menus.  

1. Under **Retention policy**, select **On** to inherit the retention policy from the database. To create or update a table policy, select **Off**. 

1. If using a separate policy, fill in the following fields:

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Recoverability | *Yes*  | Enable or disable data recoverability. |
    | Retention period (days) |  *365* | The time span (in days) for which it's guaranteed that the data is kept available to query. The time span is measured from the time that data is ingested.  |


1. Under **Cache policy**, select **On** to inherit the caching policy from the database. To create or update a table policy, select **Off**. 

1. If using a separate policy, fill in the following fields:

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Data (days) | *31* | The time span (in days) for which to keep frequently queried data available in SSD storage or RAM, rather than in longer-term storage. |
    | Index (days) |  31    | The amount of time for indexed access to data stored in external storage.  |

1. Select **Update**.

## Update table policy

In the **Update table policy** window, all steps will be marked with green check marks when the update finishes successfully. The cards below these steps give you options to explore your data with **Quick queries**, or undo changes made using **Tools**.

:::image type="content" source="media/one-click-table-policies/one-click-table-retention-policy-finished.png" alt-text="Screenshot of final screen in update table retention policy wizard for Azure Data Explorer with the one click experience.":::

## Next steps

* [Query data in Azure Data Explorer Web UI](web-query-data.md)
* [Write queries for Azure Data Explorer using Kusto Query Language](write-queries.md)