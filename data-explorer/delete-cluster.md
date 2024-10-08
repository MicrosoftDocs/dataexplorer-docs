---
title: Delete an Azure Data Explorer cluster
description: Learn how to delete an Azure Data Explorer cluster.
ms.topic: how-to
ms.date: 10/08/2024
---

# Delete an Azure Data Explorer cluster

This article explains how to delete an Azure Data Explorer cluster. If you delete a cluster that was active for more than 14 days, it enters a soft delete period for 14 days. During this soft delete time period, the cluster is recoverable and can be restored, and you can't create another cluster with the same name. After 14 days, the cluster is permanently deleted and can't be restored. 

You can opt out of the soft delete period by setting a tag on your cluster. See [Opt out of soft delete](#opt-out-of-soft-delete).

To delete only table records, see [Soft delete overview](/kusto/concepts/data-soft-delete?view=azure-data-explorer&preserve-view=true)

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

## Opt out of soft delete

You can opt out of the soft delete period by setting a tag on your cluster. Once you've set the tag, a deleted cluster won't enter the soft delete period and is permanently deleted immediately.

Tags can be set on Azure resources through the portal, PowerShell, Azure CLI, or ARM templates. For more information on these different methods, see [Use tags to organize your Azure resources](/azure/azure-resource-manager/management/tag-resources).

The key for the tag is `opt-out-of-soft-delete` and the value is `true`.

## Related content

* [Troubleshoot: Failure to create or delete a database or table](troubleshoot-database-table.md)
* [Quickstart: Create a cluster and database](create-cluster-and-database.md)
