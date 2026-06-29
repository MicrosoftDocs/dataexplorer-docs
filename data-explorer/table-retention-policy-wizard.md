---
title: Configure table retention and cache policies by using the table retention policy wizard in Azure Data Explorer
description: Learn how to configure retention and cache policies for a table by using the table retention policy wizard.
ms.reviewer: tzgitlin
ms.topic: how-to
ms.date: 06/16/2026
# customer intent: As a data engineer, I want to configure table retention and cache policies so that I can control data lifecycle, query performance, and storage cost.
---
# Configure table retention and cache policies by using the table retention policy wizard

A retention policy controls how long table data remains queryable.

A cache policy controls how much data stays in local SSD or RAM to improve query performance. Use these policies to balance data retention requirements, query speed, and storage cost.

In this article, you update retention and cache settings for a table in Azure Data Explorer by using the table retention policy wizard.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. You don't need an Azure subscription.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* An Azure Data Explorer cluster and database. To set one up, see [Create a cluster and database](create-cluster-and-database.md).

## Define and assign a table retention policy

1. In the left menu of the [Azure Data Explorer web UI](https://dataexplorer.azure.com/), select the **Data** tab.

1. Alternatively, open the page directly by using the [one-click table policy entry point](https://dataexplorer.azure.com/oneclick).

    :::image type="content" source="media/one-click-table-policies/one-click-retention-policy-start.png" alt-text="Screenshot of Data management screen showing the table retention policy wizard in the Azure Data Explorer web UI.":::

1. In the **Table retention policy** tile, select **Update**.

The **Table retention policy** window opens with the **Policy update** tab selected.

### Policy update

You can either inherit values from the database or set new values.

:::image type="content" source="media/one-click-table-policies/one-click-retention.png" alt-text="Screenshot of Update table retention policy page. Cluster, Database, Table, and Policy fields must be filled out before proceeding to Update.":::

1. The **Cluster** and **Database** fields automatically populate. Select a different cluster or database from the drop-down lists, or [add a cluster connection](add-cluster-connection.md).

1. Under **Table**, select a table from the drop-down list.

1. Under **Retention policy**, toggle **On** to apply the retention policy values from the database to the table. To create or update a separate policy for the table, toggle to **Off**.

1. If you selected **Off** for a separate retention policy, enter values in the following fields:

     | **Setting** | **Default value** | **Field description** |
     | --- | --- | --- |
     | Recoverability | *Yes* | Turn on or turn off data recoverability. |
     | Retention period | *365* | The number of days that data is stored in  long-term storage before it's deleted. The period is measured from when the data is ingested. |

1. Under **Caching policy**, toggle **On** to apply the caching policy values from the database to the table. To create or update a separate policy for the table, toggle to **Off**.

1. If you selected **Off** for a separate cache policy, enter values in the following fields:

     | **Setting** | **Default value** | **Field description** |
     | --- | --- | --- |
     | Data (days) | *31* | The number of days that frequently queried data is  available in RAM or SSD storage where it can be rapidly accessed to optimize query performance. |
     | Index (days) | *31* | The number of days for indexed access to data stored in external storage. |

1. Select **Update**.

## Review the update summary

In the **Summary** tab, all steps show checkmark icons when the update finishes successfully. The tiles under these steps give you options to explore your data by using **Quick queries** or to undo changes by using **Tools**.

:::image type="content" source="media/one-click-table-policies/one-click-table-retention-policy-finished.png" alt-text="Screenshot of the final screen in the update table retention policy wizard for Azure Data Explorer.":::

## Related content

* [Retention policy](/kusto/management/show-table-retention-policy-command?view=azure-data-explorer&preserve-view=true)
* [cache policy](/kusto/management/cache-policy?view=azure-data-explorer&preserve-view=true)
* [Write queries using Kusto Query Language](/kusto/query/tutorials/learn-common-operators?view=azure-data-explorer&preserve-view=true)
