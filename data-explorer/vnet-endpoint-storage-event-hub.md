---
title: Create a private or service endpoint to resources used by data connections, such as event hub and Azure Storage
description: Learn how to enable a private or service endpoint to resources used by data connections, such as event hub and Storage
ms.reviewer: gunjand
ms.topic: how-to
ms.date: 10/12/2020
---
# Create a private or service endpoint to event hub and Azure Storage

> [!IMPORTANT]
> Consider moving to an Azure Private Endpoint based solution for implementing network security with Azure Data Explorer. It is less error-prone and provides [feature parity](security-network-overview.md#private-endpoint-vs-virtual-network-injection).

[Azure Virtual Network (VNet)](/azure/virtual-network/virtual-networks-overview) enables many types of Azure resources to securely communicate with each other. [Azure Private Link](/azure/private-link/) enables you to access Azure Services and Azure hosted customer-owned/partner services over a Private Endpoint in your virtual network. A [Private Endpoint](/azure/private-link/private-endpoint-overview) uses an IP address from your virtual network’s address space for the Azure service to securely connect between Azure Data Explorer and Azure services such as Azure Storage and event hub. Azure Data Explorer accesses the Private Endpoint of the storage accounts or event hubs over the Microsoft backbone, and all communication, for example, data export, external tables, and data ingestion, takes place over the private IP address. 

In contrast to a Private Endpoint, a [service endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) remains a publicly routable IP address. A Virtual Network (VNet) service endpoint provides secure and direct connectivity to Azure services over an optimized route over the Azure backbone network. 

This article shows you how to create a connection between Azure Data Explorer and [event hub](ingest-data-event-hub-overview.md) or [Azure Storage](/azure/storage/).

## Prerequisites

* [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview)
* [Azure Data Explorer subnet](vnet-deployment.md)

## Private Endpoint

Azure [Private Endpoint](/azure/private-link/private-endpoint-overview) is a network interface that connects you privately and securely to a service powered by Azure [Private Link](/azure/private-link/). Private Endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network. 
 
# [Azure Storage - Private Endpoint](#tab/storage-account)

### Allow access to Azure Storage Account from Azure Data Explorer Subnets using a Private Endpoint

For a tutorial on how to create a Private Endpoint in your Azure Storage account, see [Tutorial: Connect to a storage account using an Azure Private Endpoint](/azure/private-link/tutorial-private-endpoint-storage-portal).

Within this tutorial, select the virtual network where the Azure Data Explorer subnet exists, and the Azure Data Explorer subnet.

# [Event hub - private endpoint](#tab/event-hub)

### Allow access to Azure Event Hubs from Azure Data Explorer Subnets using a Private Endpoint

For a tutorial on how to create a Private Endpoint in your event hub, see [Add a Private Endpoint using Azure portal](/azure/event-hubs/private-link-service#add-a-private-endpoint-using-azure-portal).

Within this tutorial, select the virtual network where the Azure Data Explorer subnet exists, and the Azure Data Explorer subnet.

---

## Service Endpoint

Virtual Network (VNet) [service endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) provides secure and direct connectivity to Azure services over an optimized route over the Azure backbone network. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. 

# [Azure Storage - service endpoint](#tab/storage-account)

### Allow access to Azure Storage account from Azure Data Explorer subnets using a service endpoint

This section shows you how to use Azure portal to add a virtual network service endpoint. To limit access, integrate the virtual network service endpoint for this Azure Storage account.

### Add a virtual network 

1. Navigate to the storage account you want to secure.
1. In the left-hand menu, select **Firewalls and virtual networks**.
1. Enable access from **Selected networks**.
1. Under **Virtual Networks**, select **+ Add existing virtual network**. 

    :::image type="content" source="media/vnet-private-link-storage-event-hub/storage-add-existing-vnet.png" alt-text="Add existing virtual network connection Azure Storage to Azure Data Explorer.":::

### Add networks pane

:::image type="content" source="media/vnet-private-link-storage-event-hub/storage-add-networks.png" alt-text="Add virtual network to Azure Storage Account to connect to Azure Data Explorer.":::

1. In the right-hand **Add networks** pane, select your Azure subscription.

1. Select the virtual network from the list of virtual networks, and then pick the subnet. 

    > [!NOTE]
    > Enable the service endpoint before adding the virtual network to the list. If the service endpoint is not enabled, the portal will prompt you to enable it.
    
1. Select **Add**.

### Save and verify virtual network settings

1. Select **Save** on the toolbar to save the settings. 

    :::image type="content" source="media/vnet-private-link-storage-event-hub/storage-virtual-network.png" alt-text="Vnet to connect storage account to Azure Data Explorer.":::

    Wait for a few minutes for confirmation to appear on the portal notifications.

# [Event hub - service endpoint](#tab/event-hub)

### Allow access to Azure Event Hubs from Azure Data Explorer subnets using a service endpoint

> [!IMPORTANT]
> Virtual networks are supported in **standard** and **dedicated** tiers of event hubs, and aren't supported in the basic tier. 

### Add a virtual network

1. In the Azure portal, navigate to the **Event hubs namespace** you want to secure.
1. On the left-hand menu, select **Networking**. This tab appears only in **standard** or **dedicated** namespaces.
1. Select the **Firewalls and virtual networks** tab. 

    :::image type="content" source="media/vnet-private-link-storage-event-hub/networking.png" alt-text="Networking in event hub.":::

1. Enable access from **Selected Networks**.
1. Under **Virtual Networks**, select **+ Add existing virtual network**. 

    :::image type="content" source="media/vnet-private-link-storage-event-hub/event-hub-add-existing-vnet.png" alt-text="Add existing virtual network in Azure Data Explorer.":::

### Add networks pane

:::image type="content" source="media/vnet-private-link-storage-event-hub/add-networks.png" alt-text="Add networks fields to connect Virtual Network to Azure Data Explorer.":::  

1. In the right-hand **Add networks** pane, select your Azure subscription.

1. Select the virtual network from the list of virtual networks, and then pick the subnet. You must enable the service endpoint before adding the virtual network to the list. 
    > [!NOTE]
    > Enable the service endpoint before adding the virtual network to the list. If the service endpoint is not enabled, the portal will prompt you to enable it.
1. Select **Add**.

### Save and verify virtual network settings

1. Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to appear on the portal notifications
    
    :::image type="content" source="media/vnet-private-link-storage-event-hub/event-hub-firewalls-and-vnet.png" alt-text="Add virtual network and subnet in event hub to connect to Azure Data Explorer."::: 

---

## Related content

* [Export data to storage](kusto/management/data-export/export-data-to-storage.md)
* [Ingest data from event hub into Azure Data Explorer](ingest-data-event-hub.md)
