---
title: Create a Private Endpoints for Azure Data Explorer
description: 'In this article you will learn how to create a private endpoint for Azure Data Explorer.'
author: shsagir
ms.author: shsagir
ms.reviewer: eladb
ms.service: data-explorer
ms.topic: how-to
ms.date: 02/23/2022
---

# Create a private endpoint for Azure Data Explorer (public preview)

Use an Azure [private endpoint](/azure/private-link/private-endpoint-overview) to connect to your cluster in your [Azure virtual network](/azure/virtual-network/virtual-networks-overview) (VNet).

Private endpoints use private IP addresses from your VNet to connect you privately to your cluster. With this setup, network traffic between a client on your private network and the cluster travels over the VNet and a private link on the [Microsoft backbone network](/azure/networking/microsoft-global-network). This article shows you how to create a private endpoint for your cluster.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Sign in to the [Azure portal](https://portal.azure.com/).
* [Create a cluster](create-cluster-database-portal.md) that is not injected in a virtual network
* [Create a virtual network](/azure/virtual-network/quick-create-portal)

## Create a private endpoint

There are several ways to create a private endpoint for an cluster.

* During the deployment of your cluster in the portal
* By [creating a private endpoint](/azure/private-link/create-private-endpoint-portal) resource directly
* On an existing cluster

### Create a private endpoint during the deployment of your cluster in the portal

Use the following information to create a private endpoint whilst [creating your cluster](create-cluster-database-portal.md).

1. In the **Create an Azure Data Explorer cluster** page, select the **Network** tab.

1. Under **Connectivity method**, select **Private Endpoints**.
1. Under **Private Endpoint**, select **Add**.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-deployment.png" alt-text="Private Endpoint creation during deployment.":::

1. Configure the [private endpoint](#configure-your-private-endpoint).
1. Complete the steps to create the cluster.

### Create a private endpoint on an existing cluster

Use the following information to create a private endpoint on an existing cluster.

1. In the Azure portal, navigate to your cluster and then select **Networking**.

1. Select **Private endpoint connections**, and then select **+ Private endpoint**.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-1.png" alt-text="Start the creation of an Azure Private Endpoint.":::

1. Configure the [private endpoint](#configure-your-private-endpoint).

### Configure your private endpoint

1. On the **Basics** tab, fill out the basic cluster details with the following information, and then select on **Next**.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-2.png" alt-text="Define the Basics.":::

    | **Setting** | **Suggested value** | **Field description** |
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription to use for your private endpoint|
    | Resource group | Your resource group | Use an existing resource group or create a new resource group |
    | Name | myNewPrivateEndpoint | Choose a name that identifies your Private Endpoint in the resource group |
    | Region | *(Europe) West Europe* | Select the region that best meets your needs |
    | | | |

1. On the **Resources** tab, select **Connect to an Azure resource in my directory**, fill out the resource details with the following information, and then select **Next**.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-3.png" alt-text="Define the resource information.":::

    | **Setting** | **Suggested value** | **Field description** |
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster |
    | Resource type | Your resource group | Select "Microsoft.Kusto/clusters |
    | Resource | contoso-adx | Chose the Azure Data Explorer cluster which should be used as the destination for the new Azure Private Endpoint |
    | Target sub-resource | *cluster* | There is no other option |
    | | | |

    Alternatively, you can select **Connect to an Azure resource by resource ID or alias**. This enables you to create a private endpoint to a cluster in another tenant or if you don't have at least **Reader** access on the resource.

    | **Setting** | **Suggested value** | **Field description** |
    |---|---|---|
    | ResourceId or alias | /subscriptions/... | The resource ID or alias that someone has shared with you. The easiest way to get the resource ID is to navigate to the cluster in the Azure portal and copy the Resource ID from the **Properties** sections |
    | Tarrget sob-resource | *cluster* | There is no other option |
    | Request message | *Please approve* | The resource owner sees this message while managing private endpoint connection |
    | | | |

1. On the **Virtual Network** tab, under **Networking**, specify the **Virtual Network** and **Subnet** where you want to deploy the private endpoint.
1. Under **Private IP configuration**, select **Dynamically allocate IP address**. it is not supported to configure **Statically allocate IP address**.
1. Under **Private DNS integration**, turn on the **Integration with the private DNS zone**. It's needed to resolve the engine and data management endpoints including the storage accounts required for ingestion and export related features.
1. Select **Next**.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-4.png" alt-text="Virtual Network configuration.":::

1. On the **Tags** tab, configure any tags you require, and then select **Next**.

1. Review the configuration details and then select **Create** to create the private endpoint resource.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-5.png" alt-text="Review and create":::

### Verify the private endpoint creation

Once the creation of the private endpoint is complete, you'll be able to access it in the Azure Portal.

:::image type="content" source="media/security-network-private-endpoint/pe-create-6.png" alt-text="Private Endpoint creation result.":::

To see all the private endpoints created for your cluster:

1. In the Azure portal, navigate to your cluster and then select **Networking**

1. Select **Private endpoint**. In the table, you can see all private endpoints created for your cluster.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-7.png" alt-text="See all private endpoints of an Azure Data Explorer cluster in the portal.":::

## Alternative to the integration with the private DNS zone

In some situations it is required not to integrate with the private DNS zone of the Azure Virtual Network. Such a situation might be if you are using your own DNS server or you create DNS records using the host files on your virtual machines. This section describes a way to get to the DNS zones.

* Install [choco](https://chocolatey.org/install)
* Install ARMCLIENT

   ```powerShell
   choco install armclient
   ```

* Log in with ARMClient

   ```powerShell
   armclient login
   ```

* The REST API call to get the private DNS zones for a specific cluster is the following:

    ```powershell
    #replace the <...> placeholders with the correct values
    armclient GET /subscriptions/<subscriptionIdADX>/resourceGroups/<resourceGroupNameADX>/providers/Microsoft.Kusto/clusters/<clusterName>/privateLinkResources?api-version=2022-02-01
    ```

    Result:

    ```javascript
    {
      "value": [
        {
          "id": "/subscriptions/<subscriptionIdADX>/resourceGroups/<resourceGroupNameADX>/providers/Microsoft.Kusto/Clusters/<clusterName>/PrivateLinkResources/cluster",
          "name": "<clusterName>/cluster",
          "type": "Microsoft.Kusto/Clusters/PrivateLinkResources",
          "location": "<the region of your cluster>",
          "properties": {
            "groupId": "cluster",
            "requiredMembers": [
              "Engine",
              "DataManagement",
              "blob-storageAccount1",
              "queue-storageAccount1",
              "table-storageAccount1",
              "blob-storageAccount2",
              "queue-storageAccount2",
              "table-storageAccount2"
            ],
            "requiredZoneNames": [
              "privatelink.<the region of your cluster>.kusto.windows.net",
              "privatelink.blob.core.windows.net",
              "privatelink.queue.core.windows.net",
              "privatelink.table.core.windows.net"
            ],
            "provisioningState": "Succeeded"
          }
        }
      ]
    }
    ```

    The required DNS zones are in the "requiredZoneNames" array in the response of the result.

* the required information about the mapping of IP address to DNS name can be found in the Private Endpoint which has been created.

    ![DNS configuration of the private endpoint.](media/security-network-private-endpoint/pe-dns-config.png)

> [!WARNING]
> This information allows you to propagate your custom DNS server with the necessary records. We highly recommend to integrate with the private DNS Zones of the Azure Virtual Network and don't configure your own custom DNS server. The nature of private endpoints for Azure Data Explorer cluster is different than for other Azure PaaS services. In some situations (highend ingestion load) it might be necessary that the service scales  out the number of storage accounts which are accessible via the private endpoint in order to increase throughput. If you made the decision to propagate your own custom DNS server, then it is your responsibility to take care of updating the DNS records in such situations (and later remove records in cases the number of storage accounts was scaled back in).

## Next steps

* [Troubleshooting private endpoints for your cluster](security-network-private-endpoint-troubleshoot.md)
