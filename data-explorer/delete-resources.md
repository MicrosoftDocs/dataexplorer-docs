---
title: Delete resources in Azure Data Explorer
description: Learn how to delete a database and cluster in Azure Data Explorer.
ms.reviewer: avneraa
ms.topic: how-to
ms.date: 08/20/2023
---

# Delete resources in Azure Data Explorer

This article explains how to delete a database and cluster in Azure Data Explorer.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).

## Delete a database

To delete a database from your Azure Data Explorer cluster:

1. Open your cluster in the [Azure portal](https://portal.azure.com/).

1. In the left-hand menu, under **Data**, select **Databases**.

1. Select the box next to the database to delete. Then, in the top menu, select the **Delete** icon.

    :::image type="content" source="media/delete-resources/delete-database.png" alt-text="Screenshot of the option to delete a database in Azure portal." lightbox="media/delete-resources/delete-database.png":::

1. In the **Delete database** pop-up, select **Yes**.

Once deleted, the database is taken off the list.

## Delete a cluster

To delete your Azure Data Explorer cluster:

1. Open your cluster in the [Azure portal](https://portal.azure.com/).

1. From the left-hand menu, select **Overview**.

1. In the top menu, select the **Delete** icon.

    :::image type="content" source="media/delete-resources/delete-cluster.png" alt-text="Screenshot of the option to delete a cluster." lightbox="media/delete-resources/delete-cluster.png":::

1. In the **Delete cluster** window, type in the name of the cluster. Then, select **Delete**.

    > [!CAUTION]
    > Deleting a cluster is a permanent action and cannot be undone. All cluster content will be lost.
    
## Related content

* [Troubleshoot: Failure to create or delete a database or table](troubleshoot-database-table.md)
* [Quickstart: Create a cluster and database](create-cluster-and-database.md)
