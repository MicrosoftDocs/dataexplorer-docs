---
title: Connect a cluster behind a private endpoint to a Power BI service
description: Learn how to connect an Azure Data Explorer cluster behind a private endpoint to a Power BI service.
ms.reviewer: danyhoter
ms.topic: how-to
ms.date: 10/15/2023
---

# Connect a cluster behind a private endpoint to a Power BI service

In this article, you learn how to connect to a Power BI service from an Azure Data Explorer cluster that's behind a private endpoint.

A private endpoint is a network interface that uses private IP addresses from your virtual network. This network interface connects you privately and securely to your cluster powered by Azure Private Link. By enabling a private endpoint, you're bringing the service into your virtual network. For more information on private endpoints, see [Private endpoints for Azure Data Explorer](security-network-private-endpoint.md).

## Prerequisites

* A Microsoft account or a Microsoft Entra ID. An Azure subscription isn't required.
* An Azure Data Explorer cluster behind a private endpoint. For more information, see [Create a private endpoint for Azure Data Explorer](security-network-private-endpoint-create.md).
* You must have [AllDatabasesViewer](kusto/access-control/role-based-access-control.md) permissions.
* A data gateway installed on a virtual machine in the private endpoint. For more information, see [Install a data gateway](/data-integration/gateway/service-gateway-install).
* Verify that the virtual machine where the data gateway is installed can access the data on the target cluster. For more information, see [Add a cluster connection](add-cluster-connection.md).
* A [Power BI report](power-bi-data-connector.md?tabs=connector).

## Create a gateway connection

You need to create a gateway connection and add a data source that can be used with that gateway. In this example, you bridge between your data gateway and a Power BI service by using an Azure Data Explorer cluster as the data source.

1. Launch a Power BI service.
1. In the upper-right corner of the Power BI service, select the gear icon ![Settings gear icon.](./media/power-bi-private-endpoint/settings.png), and then **Manage connections and gateways**.

    :::image type="content" source="media/power-bi-private-endpoint/manage-connections-gateways.png" alt-text="Screenshot of the Settings pane in the Power BI service. The option titled Manage connections and gateways is highlighted.":::

1. Select **+ New** to create a new connection.
1. Fill out the **New connection** form with the following information:

    :::image type="content" source="media/power-bi-private-endpoint/new-connection.png" alt-text="Screenshot of the New connection form in Power BI showing the required information for creating an on-premises connection." lightbox="media/power-bi-private-endpoint/new-connection.png":::

    | Setting | Field description | Sample value |
    |---------|---------|--------|
    | Connection type| There are three types of connections: On-premises, Virtual network, or a Cloud connection.  | **On-premises** is autoselected. |
    | Gateway cluster name| The [on-premises gateway you installed](/data-integration/gateway/service-gateway-install). | Select your gateway cluster name from the dropdown.|
    | Connection name| The connection name connecting your on-premises data gateway to the Power BI service. | Provide a meaningful name for your connection. |
    | Connection type| The data source used with the gateway. | Azure Data Explorer (Kusto).|
    | Cluster| The Azure Data Explorer cluster URI used as the dataset of the report. | `https://`*clusterName*`.kusto.windows.net` |

    > [!IMPORTANT]
    > The link between your report's dataset and the data source within the gateway is based on your cluster URI. The names must match. For example, if you refer to the help cluster (`https://help.kusto.windows.net/`) as "help" when connecting to a data source in Power BI Desktop, you must also use "help" as the cluster URI for the data source when configuring the gateway.

1. Under **Authentication**, select **Edit credentials**, and then sign in.
1. Select **Create**, and then select **Close**. Your new connection appears in the list of connections.

## Allow refresh through a gateway cluster

To use any cloud data sources, such as Azure Data Explorer, you must ensure that the gateway has access to that data source.

1. Under **Data**, select the **On-premises data gateways** tab.
1. Select the gateway cluster name that you configured previously.
1. On the ribbon, select **Settings**.
1. Under **Power BI**, select **Allow user's cloud data sources to refresh through this gateway cluster**, and then select **Save**.

    :::image type="content" source="media/power-bi-private-endpoint/gateway-settings.png" alt-text="Screenshot of the data gateway settings in the Power BI service." lightbox="media/power-bi-private-endpoint/gateway-settings.png":::

1. Return to your workspace.

## Upload report and configure dataset

1. Select **Upload**, and browse for a Power BI report to upload to your workspace. Your report's dataset is uploaded along with your report.
1. Place your cursor over your report's dataset, and then select *More options* > **Settings**.

    :::image type="content" source="media/power-bi-private-endpoint/dataset.png" alt-text="Screenshot of a workspace in the Power BI service showing the more menu of dataset.":::

1. Expand **Gateway and cloud connections**.
1. Under **Gateway connections**, toggle on **Use an On-premises or VNet data gateway**.

    :::image type="content" source="media/power-bi-private-endpoint/dataset-settings.png" alt-text="Screenshot of the dataset settings showing the configured gateway and cloud connections.":::

1. Under **Gateway**, select your gateway cluster name.
1. Under **Actions**, use the dropdown menu to verify the data sources included in this dataset.
1. Expand the **Maps to** dropdown, and then select the connection you created earlier. This allows the report to request data from your Azure Data Explorer cluster.
1. Select **Apply**.

    > [!NOTE]
    > When you upload or republish your report, you must associate the dataset to a gateway and corresponding data source again. The previous association is not maintained after republishing.

    You've successfully bridged between your on-premises data gateway and your Power BI report that uses an Azure Data Explorer cluster.

1. Return to your workspace and then open your report to gain insights from the visualizations in your Power BI report.

## Related content

[Create reports and dashboards in Power BI](/power-bi/create-reports/).
