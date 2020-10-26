---
title: Create an endpoint to resources used by data connections, such as Event Hub and Storage
description: Learn how to enable a private or service endpoint to resources used by data connections, such as Event Hub and Storage
author: orspod
ms.author: orspodek
ms.reviewer: gunjand
ms.service: data-explorer
ms.topic: how-to
ms.date: 10/12/2020
---
# Create an endpoint to resources used by data connections, such as Event Hub and Storage

[Azure Virtual Network (VNet)](/azure/virtual-network/virtual-networks-overview) enables many types of Azure resources to securely communicate with each other. [Azure Private Link](/azure/private-link/) enables you to access Azure Services and Azure hosted customer-owned/partner services over a Private Endpoint in your virtual network. Once a Private Link is established, all communication, for example, data export, external tables, and data ingestion, takes take place over the private IP address. A [Private Endpoint](/azure/private-link/private-endpoint-overview) uses an IP address from your VNet’s address space for the Azure service to securely connect between Azure Data Explorer and Azure services such as Azure Storage and Event Hub. Azure Data Explorer accesses the Private Endpoint of the storage accounts or Event Hubs over the Microsoft backbone, removing exposure to the public internet.

In contrast to a Private Endpoint, a [service endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) remains a publicly routable IP address. A Virtual Network (VNet) service endpoint provides secure and direct connectivity to Azure services over an optimized route over the Azure backbone network. Service endpoints enable private IP addresses in the VNet to reach the endpoint of an Azure service without needing a public IP address on the VNet.

This article shows you how to create a connection between Azure Data Explorer and [Event Hub](ingest-data-event-hub-overview.md) or [Azure Storage](/azure/storage/).

## Prerequisites

* [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview)
* [Azure Data Explorer subnet](vnet-deployment.md)

## Private Endpoint
 
# [Azure Storage - Private Endpoint](#tab/storage-account)

### Allow Access to Azure Storage Account from Azure Data Explorer Subnets using a Private Endpoint

For a tutorial on how to create a Private Endpoint in your Azure Storage account, see [Tutorial: Connect to a storage account using an Azure Private Endpoint](/azure/private-link/tutorial-private-endpoint-storage-portal).

Within this tutorial, select the VNet where the Azure Data Explorer subnet exists, and the Azure Data Explorer subnet.

# [Event Hub - Private Endpoint](#tab/event-hub)

### Allow Access to Azure Event Hub from Azure Data Explorer Subnets using a Private Endpoint

For a tutorial on how to create a Private Endpoint in your Event Hub, see [Add a Private Endpoint using Azure portal](/azure/event-hubs/private-link-service#add-a-private-endpoint-using-azure-portal).

Within this tutorial, select the VNet where the Azure Data Explorer subnet exists, and the Azure Data Explorer subnet.

---

## Service Endpoint

text bla bla bla

# [Azure Storage - service endpoint](#tab/storage-account)

### Allow Access to Azure Storage Account from Azure Data Explorer Subnets using a service endpoint

This section shows you how to use Azure portal to add a virtual network service endpoint. To limit access, integrate the virtual network service endpoint for this Azure Storage account.

### Add a virtual network 

1. Navigate to the storage account you want to secure.
1. In the left-hand menu, select **Firewalls and virtual networks**.
1. Enable access from **Selected networks**.
1. Under **Virtual Networks**, select **+ Add existing virtual network**. 

    :::image type="content" source="media/vnet-private-link-storage-event-hub/storage-add-existing-vnet.png" alt-text="Add existing VNet connection Azure Storage to Azure Data Explorer":::

### Add networks pane

:::image type="content" source="media/vnet-private-link-storage-event-hub/storage-add-networks.png" alt-text="Add virtual network to Azure Storage Account to connect to Azure Data Explorer":::

1. In the right-hand **Add networks** pane, select your Azure subscription.

1. Select the virtual network from the list of virtual networks, and then pick the subnet. 

    > [!NOTE]
    > Enable the service endpoint before adding the virtual network to the list. If the service endpoint is not enabled, the portal will prompt you to enable it.
    
1. Select **Add**.

### Save and verify virtual network settings

1. Select **Save** on the toolbar to save the settings. 

    :::image type="content" source="media/vnet-private-link-storage-event-hub/storage-virtual-network.png" alt-text="Vnet to connect storage account to Azure Data Explorer":::

    Wait for a few minutes for confirmation to appear on the portal notifications.

# [Event Hub - service endpoint](#tab/event-hub)

### Allow Access to Azure Event Hub from Azure Data Explorer Subnets using a service endpoint

> [!IMPORTANT]
> Virtual networks are supported in **standard** and **dedicated** tiers of Event Hubs, and aren't supported in the basic tier. 

### Add a virtual network

1. In the Azure portal, navigate to the **Event Hubs namespace** you want to secure.
1. On the left-hand menu, select **Networking**. This tab appears only in **standard** or **dedicated** namespaces.
1. Select the **Firewalls and virtual networks** tab.

    :::image type="content" source="media/vnet-private-link-storage-event-hub/networking.png" alt-text="Networking in Event Hub":::

1. Enable access from **Selected Networks**.
1. Under **Virtual Networks**, select **+ Add existing virtual network**. 

    :::image type="content" source="media/vnet-private-link-storage-event-hub/event-hub-add-existing-vnet.png" alt-text="Add existing virtual network in Azure Data Explorer":::

### Add networks pane

:::image type="content" source="media/vnet-private-link-storage-event-hub/add-networks.png" alt-text="Add networks fields to connect VNet to Azure Data Explorer":::  

1. In the right-hand **Add networks** pane, select your Azure subscription.

1. Select the virtual network from the list of virtual networks, and then pick the subnet. You must enable the service endpoint before adding the virtual network to the list. 
    > [!NOTE]
    > Enable the service endpoint before adding the virtual network to the list. If the service endpoint is not enabled, the portal will prompt you to enable it.
1. Select **Add**.

### Save and verify virtual network settings

1. Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to appear on the portal notifications
    
    :::image type="content" source="media/vnet-private-link-storage-event-hub/event-hub-firewalls-and-vnet.png" alt-text="Add virtual network and subnet in Event Hub to connect to Azure Data Explorer"::: 

---

## See also

* [Azure Virtual Network (VNet)](/azure/virtual-network/virtual-networks-overview)
* [Private Endpoint](/azure/private-link/private-endpoint-overview)
* [Create an Azure Data Explorer cluster in your Virtual Network](vnet-create-cluster-portal.md)
* [Deploy Azure Data Explorer cluster into your Virtual Network](vnet-deployment.md)
* [Private Link FAQ](/azure/private-link/private-link-faq)
