---
title: Add a cluster connection in the Azure Data Explorer web UI
description: Learn how to add cluster connections for multiple user accounts or Microsoft Entra directories in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 01/20/2025
---

# Add a cluster connection in the Azure Data Explorer web UI

This article explains how to add a cluster connection in the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

The Azure Data Explorer web UI allows you to seamlessly manage clusters from various user accounts or Microsoft Entra directories. Follow the optional steps in this article to set up connections with alternative credentials. Once connected, you can switch between clusters associated with different credentials within a unified interface, without a need to repeatedly sign in and sign out or switch directories.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.

## Add a cluster connection

To add a connection to your Azure Data Explorer cluster:

1. From the main left menu, select **Query**.

    :::image type="content" source="media/web-ui-add-cluster/query-widget.png" alt-text="Screenshot of the query widget in the main menu of the web UI.":::

1. In the upper left corner, select **Add**. From the dropdown menu, select **Connection**.

1. In the **Add connection** dialog box, enter the cluster **Connection URI** and **Display name**. To find the connection URI, go to your cluster resource in the [Azure portal](https://ms.portal.azure.com/). The connection URI is the **URI** found in the **Overview**. To add a free sample cluster, specify "help" as the **Connection URI**.

    :::image type="content" source="media/web-ui-add-cluster/add-connection-dialog.png" alt-text="Screenshot of add cluster connection dialog box.":::

1. (Optional) If you have multiple user accounts and want to authenticate with a different account, select **Connect as another user**, and proceed to add or select the appropriate account.

1. (Optional) If your account is linked to multiple Microsoft Entra directories, select **Switch directory** and choose the relevant directory for this connection.

    :::image type="content" source="media/web-ui-add-cluster/switch-directories.png" alt-text="Screenshot of option to switch directory.":::

1. Select **Add** to add the connection. Your cluster and databases should now be visible in the left panel.

    For example, the following image shows a cluster connection pane that contains three clusters: `HomeCluster`, `help`, and `TestCluster`.

    :::image type="content" source="media/web-ui-add-cluster/cluster-pane-with-various-accounts.png" alt-text="Screenshot of the help cluster and databases.":::

## Manage cluster connections

To organize and manage your clusters, you can add clusters to **Favorites** or to groups.

### Manage cluster connections using Favorites

To add your cluster to **Favorites**:

1. From the **More [...]** menu next to your cluster, select **Add to favorites**.

1. Verify that your cluster appears under **Favorites** in the **Cluster connection** pane.

To remove a cluster from **Favorites**:

1. Select the **More [...]** menu next to the cluster and then **Remove from favorites**.
 
1. Verify that your cluster doesn't appear under **Favorites** in the **Cluster connection** pane.

    :::image type="content" source="media/web-ui-add-cluster/cluster-pane-remove-from-favorites.png" alt-text="Screenshot of the Remove from favorites selection.":::

### Manage cluster connections using groups

**Before you start**: If the group you wish to assign the cluster to doesn't exist, we recommend you create it first. In the **Cluster connection** pane, select **Add** > **Group**, enter a group name, and then select the check mark.

To add your cluster to a group:

1. From the **More [...]** menu next to your cluster, select **Add to group**, and then select a group name.

    :::image type="content" source="media/web-ui-add-cluster/add-groups-favorites.png" alt-text="Screenshot of the add to group options. The add to group dropdown includes the New Group selection and an existing group.":::

1. Verify that your cluster appears under the selected group in the **Cluster connection** pane.

To remove a cluster from a group:

1. Select the **More [...]** menu next to the cluster, then **Add to group**. Under the **Remove from group** heading, select the group name.

    :::image type="content" source="media/web-ui-add-cluster/cluster-pane-remove-from-groups.png" alt-text="Screenshot of the Remove from group option." :::

1. Verify that your cluster doesn't appear under the selected group in the **Cluster connection** pane.

    > [!NOTE]
    > Clusters can be included in groups and **Favorites** at the same time.

## Related content

* [Get data overview](ingest-data-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](/kusto/query/tutorials/learn-common-operators?view=azure-data-explorer&preserve-view=true)
