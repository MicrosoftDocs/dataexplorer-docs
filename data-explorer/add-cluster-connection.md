---
title: Add a cluster connection in the Azure Data Explorer web UI
description: Learn how to add cluster connections for multiple user accounts or Azure AD directories in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 07/30/2023
---

# Add a cluster connection in the Azure Data Explorer web UI

This article explains how to add a cluster connection and manage clusters across various user accounts and Azure AD directories in the Azure Data Explorer web UI.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Sign-in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Add a cluster connection

To add a connection to your Azure Data Explorer cluster:

1. From the main left menu, select **Query**.

    :::image type="content" source="media/web-ui-add-cluster/query-widget.png" alt-text="Screenshot of the query widget in the main menu of the web UI." lightbox="media/web-ui-add-cluster/query-widget.png":::

1. In the upper left corner, select **Add**. From the dropdown menu, select **Connection**.

1. In the **Add connection** dialog box, enter the cluster **Connection URI** and **Display name**.

   To find the connection URI, go to your cluster resource in the [Azure portal](https://ms.portal.azure.com/). The connection URI is the **URI** found in the **Overview**. To add a free sample cluster, specify "help" as the **Connection URI**.

   If you want to add a cluster from a different user account or Azure AD directory, see [Manage clusters across multiple user accounts and Azure AD directories](#manage-clusters-across-multiple-user-accounts-and-azure-ad-directories).

    :::image type="content" source="media/web-ui-add-cluster/add-connection-dialog.png" alt-text="Screenshot of add cluster connection dialog box." lightbox="media/web-ui-add-cluster/add-connection-dialog.png":::

1. Select **Add**. Your cluster and databases should now be visible in the left panel. For example, the following image shows the `help` cluster connection.

    :::image type="content" source="media/web-ui-add-cluster/help-cluster-web-ui.png" alt-text="Screenshot of the help cluster and databases." lightbox="media/web-ui-add-cluster/help-cluster-web-ui.png":::

## Manage clusters across multiple user accounts and Azure AD directories

Each cluster connection is associated with a specific user account and Azure Active Directory (Azure AD) directory. The provided credentials are used to authenticate to the cluster and run queries. This functionality removes the need to repetitively sign in and sign out, or switch directories, and allows you to move between clusters associated with different credentials within a unified interface.

To add a cluster from a different user account or Azure AD directory:

1. Follow steps 1-3 in [Add a cluster connection](#add-a-cluster-connection).

1. In the **Add connection** dialog box, select **Connect as another user** and proceed to add or select the appropriate account.

1. To access a list of Azure AD directories associated with the selected account, select **Switch directory**. Choose the relevant directory for this specific cluster connection.

    :::image type="content" source="media/web-ui-add-cluster/switch-directories.png" alt-text="Screenshot of option to switch directory." lightbox="media/web-ui-add-cluster/switch-directories.png":::

1. Select **Add**. Cluster connections that use credentials different from those of the signed-in user are indicated by a small icon of a person in the upper-left corner.

## Next steps

* Get data with the [ingestion wizard](ingest-data-wizard.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
