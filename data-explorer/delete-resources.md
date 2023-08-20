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
1. Select the box next to the database to delete.
1. In the top menu, select the **Delete** icon.
1. In the **Delete database** pop-up, select **Yes**.

Once deleted, the database is taken off the list.

## Delete a cluster

1. Open your cluster in the [Azure portal](https://portal.azure.com/).
1. From the left-hand menu, select **Overview**.
1. In the top menu, select the **Delete** icon.
1. In the **Delete cluster** window, type in the name of the cluster. Then, select **Delete**.
   
> [!CAUTION]
> Deleting a cluster is a permanent action and cannot be undone. All cluster content will be lost.


## See also

* [Create a cluster and database](create-cluster-and-database.md)
