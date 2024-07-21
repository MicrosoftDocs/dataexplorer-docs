---
title: Delete an Azure Data Explorer cluster
description: Learn how to delete an Azure Data Explorer cluster.
ms.topic: how-to
ms.date: 08/27/2023
---

# Delete an Azure Data Explorer cluster

This article explains how to delete an Azure Data Explorer cluster. If you delete a cluster that has been active for more than 14 days, it enters a soft delete period for 14 days. During this soft delete time period, the cluster is recoverable and can be restored, and you can't create another cluster with the same name. After 14 days, the cluster is permanently deleted and can't be restored. 

To delete only table records, see [Soft delete overview](kusto/concepts/data-soft-delete.md)

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).

## Delete a cluster

To delete your Azure Data Explorer cluster:

1. Open your cluster in the [Azure portal](https://portal.azure.com/).

1. From the left-hand menu, select **Overview**.

1. In the top menu, select the **Delete** icon.

    :::image type="content" source="media/delete-resources/delete-cluster.png" alt-text="Screenshot of the option to delete a cluster." lightbox="media/delete-resources/delete-cluster.png":::

1. In the **Delete cluster** window, type in the name of the cluster. Then, select **Delete**.

    > [!CAUTION]
    > Deleting a cluster is a permanent action and cannot be undone. All cluster content will be lost. To recover the cluster in the initial 14 days soft-delete period, please open a support ticket.


## Related content

* [Troubleshoot: Failure to create or delete a database or table](troubleshoot-database-table.md)
* [Quickstart: Create a cluster and database](create-cluster-and-database.md)
