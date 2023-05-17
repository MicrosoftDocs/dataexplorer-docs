---
title: Add a cluster connection in the Azure Data Explorer web UI
description: This article describes how to add a cluster connection in the Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 05/17/2023
---

# Add a cluster connection in the Azure Data Explorer web UI

This article describes how to add a connection to an Azure Data Explorer cluster in the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* Sign-in to the [Azure Data Explorer web UI](https://dataexplorer.azure.com/).

## Add a cluster connection

To add a connection to your Azure Data Explorer cluster, do the following:

1. From the main left menu, select **Query**.

    :::image type="content" source="media/web-ui-add-cluster/query-widget.png" alt-text="Screenshot of the query widget in the main menu of the web UI." lightbox="media/web-ui-add-cluster/query-widget.png":::

1. In the upper left corner, select **Add connection**.

1. In the **Add connection** dialog box, enter the cluster **Connection URI** and **Display name**. To find the connection URI, go to your cluster resource in the [Azure portal](https://ms.portal.azure.com/). The connection URI is the **URI** found in the **Overview**. To add a free sample cluster, specify "help" as the **Connection URI**.

    :::image type="content" source="media/web-ui-add-cluster/cluster-connection-dialog.png" alt-text="Screenshot of add cluster connection dialog box." lightbox="includes/media/ingestion-wizard-cluster/add-cluster-connection.png":::

1. Select **Add** to add the connection. Your clusters and databases should now be visible in the left panel. For example, the following image shows the `help` cluster connection.

    :::image type="content" source="media/web-ui-add-cluster/help-cluster-web-ui.png" alt-text="Screenshot of the help cluster and databases." lightbox="media/web-ui-add-cluster/help-cluster-web-ui.png":::

## Next steps

* Ingest data with the [ingestion wizard](ingest-data-wizard.md)
* Query data with [Kusto Query Language (KQL)](kusto/query/index.md)
