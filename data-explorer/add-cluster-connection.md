---
title: Add a cluster connection in the Azure Data Explorer web UI
description: Learn how to add cluster connections for multiple user accounts or Microsoft Entra directories in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 01/16/2025
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

    :::image type="content" source="media/web-ui-add-cluster/add-connection-dialog.png" alt-text="Screenshot of add cluster connection dialog box." lightbox="media/web-ui-add-cluster/add-connection-dialog.png":::

1. (Optional) If you have multiple user accounts and want to authenticate with a different account, select **Connect as another user** and proceed to add or select the appropriate account.

1. (Optional) If your account is linked to multiple Microsoft Entra directories, select **Switch directory** and choose the relevant directory for this connection.

    :::image type="content" source="media/web-ui-add-cluster/switch-directories.png" alt-text="Screenshot of option to switch directory." lightbox="media/web-ui-add-cluster/switch-directories.png":::

1. Select **Add** to add the connection. Your cluster and databases should now be visible in the left panel.

    For example, the following image shows a cluster connection pane that contains three clusters: `HomeCluster`, `help`, and `TestCluster`.

    :::image type="content" source="media/web-ui-add-cluster/cluster-pane-with-various-accounts.png" alt-text="Screenshot of the help cluster and databases." lightbox="media/web-ui-add-cluster/cluster-pane-with-various-accounts.png":::

1. (Optional) You can add your cluster to **Favorites** or to a group to help organize multiple clusters. Select the ellipsis menu next to your cluster and then **Add to favorites** or **Add to group** and the group name.

    To add your cluster to a new group, select **Add to group > New Group** or from the upper left  corner, select **Add** and then **Group**.

    :::image type="content" source="media/web-ui-add-cluster/add-groups-favorites.png" alt-text="Screenshot of the Add to favorites and Add to group options. The Add to group dropdown includes the New Group selection and an existing group. "  lightbox="media/web-ui-add-cluster/add-groups-favorites.png":::

    > [!NOTE]
    > Clusters can be included in groups and favorites at the same time.

## Related content

* [Get data overview](ingest-data-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](/kusto/query/tutorials/learn-common-operators?view=azure-data-explorer&preserve-view=true)
