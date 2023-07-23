---
title: Add a cluster connection in the Azure Data Explorer web UI
description: Learn how to add cluster connections for multiple user accounts or Azure AD directories in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 07/23/2023
---

# Add a cluster connection in the Azure Data Explorer web UI

In the [Azure Data Explorer web UI](https://dataexplorer.azure.com/), each cluster connection is associated with a specific user account and Azure Active Directory (Azure AD) directory. The provided credentials are used to authenticate to the cluster and run queries.

This functionality is especially valuable for users who manage multiple clusters across different user accounts or Azure AD directories. It removes the need for repetitive sign-in and sign-out or directory switches, and allows for you to seamlessly switch between clusters associated with different credentials within a unified and user-friendly interface.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Sign-in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Add a cluster connection

To add a connection to your Azure Data Explorer cluster:

1. From the main left menu, select **Query**.

    :::image type="content" source="media/web-ui-add-cluster/query-widget.png" alt-text="Screenshot of the query widget in the main menu of the web UI." lightbox="media/web-ui-add-cluster/query-widget.png":::

1. In the upper left corner, select **Add**. From the dropdown menu, select **Connection**.

1. In the **Add connection** dialog box, enter the cluster **Connection URI** and **Display name**. To find the connection URI, go to your cluster resource in the [Azure portal](https://ms.portal.azure.com/). The connection URI is the **URI** found in the **Overview**. To add a free sample cluster, specify "help" as the **Connection URI**.

    :::image type="content" source="media/web-ui-add-cluster/add-connection-dialog.png" alt-text="Screenshot of add cluster connection dialog box." lightbox="media/web-ui-add-cluster/add-connection-dialog.png":::

1. If the displayed user isn't the intended user, select **Connect as another user** and proceed to add or select the appropriate account.

1. To access a list of all Azure AD directories associated with the current account, select **Switch directory**. Choose the relevant directory for this specific cluster connection.

    :::image type="content" source="media/web-ui-add-cluster/switch-directories.png" alt-text="Screenshot of option to switch directory." lightbox="media/web-ui-add-cluster/switch-directories.png":::

1. Select **Add** to add the connection. Your cluster and databases should now be visible in the left panel. For example, the following image shows the `help` cluster connection.

    :::image type="content" source="media/web-ui-add-cluster/help-cluster-web-ui.png" alt-text="Screenshot of the help cluster and databases." lightbox="media/web-ui-add-cluster/help-cluster-web-ui.png":::

## Next steps

* Get data with the [ingestion wizard](ingest-data-wizard.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
