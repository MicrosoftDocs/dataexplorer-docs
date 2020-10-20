---
title: Enable Private Link between Azure Data Explorer and Event Hub or Azure Storage
description: Learn how to Enable Private Link between Azure Data Explorer and Event Hub or Azure Storage
author: orspod
ms.author: orspodek
ms.reviewer: gunjand
ms.service: data-explorer
ms.topic: how-to
ms.date: 10/12/2020
---
# Create a private endpoint to resources used by data connections, such as Event Hub and Storage

[Azure Virtual Network (VNet)](/azure/virtual-network/virtual-networks-overview) enables many types of Azure resources to securely communicate with each other. The virtual network rule is an association of an Azure service, such as Event Hub or Azure Storage, with a virtual network subnet. While the rule exists, all workloads bound to the subnet are granted access to the Azure service. The service itself never establishes outbound connections, doesn't need to gain access, and is never granted access to your subnet by enabling this rule.

[Private Link](/azure/private-link/private-link-service-overview) enables clients on an Azure virtual network (VNet) to securely access data from a storage account. This allows network traffic between the Azure Data Explorer and the Azure service to travel over the Microsoft backbone, removing exposure from the public internet. A [Private Endpoint](/azure/private-link/private-endpoint-overview) uses an IP address from your VNet’s address space for the Azure service. Private Link enables you to block exfiltration of data from your VNet. Using Private Link enables you to securely connect between Azure data explorer and Azure services. Azure Data Explorer accesses the Private Endpoint of the storage accounts or Event Hubs.

**What is the difference between a Service Endpoints and a Private Endpoints?**
* Private Endpoints grant network access to specific resources behind a given service providing granular segmentation. Traffic can reach the service resource from on premises without using public endpoints.
* A service endpoint remains a publicly routable IP address. A private endpoint is a private IP in the address space of the virtual network where the private endpoint is configured.

This article shows you how to create a connection between Azure Data Explorer and [Event Hub](ingest-data-event-hub-overview.md) or [Azure Storage](/azure/storage/).

## Prerequisites

* [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview)
* [Azure Data Explorer subnet](vnet-deployment.md)
* [Private Endpoint in your Azure Data Explorer cluster in your virtual network](vnet-create-private-endpoint.md) //I don't think this is an actua

# [Event Hub - Private Endpoint](#tab/event-hub-private)

> [!IMPORTANT]
> Virtual networks are supported in **standard** and **dedicated** tiers of Event Hubs, and aren't supported in the basic tier. 

## Allow Access to Azure Event Hub from Azure Data Explorer Subnets using a Private Endpoint

1. In the Azure portal, navigate to the **Event Hubs namespace** you want to secure.
1. On the left-hand menu, select **Networking**. This tab appears only in **standard** or **dedicated** namespaces.
1. Select **Networking** under **Settings** on the left menu.
1. Select the Private endpoint connections tab at the top of the page.
1. Select **+ Private Endpoint** at the top of the page.
    
    :::image type="content" source="media/vnet-private-link-storage-event-hub/private-link-service.png" alt-text="Screenshot of Private endpoint connections tab for adding Private Endpoint":::

### Basics tab

:::image type="content" source="media/vnet-private-link-storage-event-hub/create-private-endpoint-basics-tab.png" alt-text="Screenshot of Basics tab in Create a private endpoint screen":::

1. Select the Azure subscription in which you want to create the private endpoint.
1. Select the resource group for the private endpoint resource.
1. Enter a name for the private endpoint.
1. Select a region for the private endpoint. Your private endpoint must be in the same region as your virtual network, but can be in a different region from the private link resource that you are connecting to.
1. Select **Next: Resource >** button at the bottom of the page.

### Resource tab

:::image type="content" source="media/vnet-private-link-storage-event-hub/create-private-endpoint-resource-tab.png" alt-text="Screenshot of Create Private Endpoint Resource tab":::

1. Select **Connect to an Azure resource in my directory**
1. Fill in the following information: 

    | Setting | Field description|
    |---|---|
    | **Subscription** | The Azure subscription in which your Event Hubs namespace exists.|
    | **Resource type** | Select Microsoft.EventHub/namespaces for the Resource type. |
    | **Resource** | An Event Hubs namespace from the drop-down list.

1. Confirm that the **Target subresource** is set to namespace.
1. Select **Next: Configuration >** button at the bottom of the page.

### Configuration tab

:::image type="content" source="media/vnet-private-link-storage-event-hub/create-private-endpoint-configuration-tab.png" alt-text="Screenshot of Create a private endpoint configuration tab":::

1. Fill in the following information:

    | Setting | Field description|
    |---|---|
    | **Virtual network** | The VNet where the Azure Data Explorer subnet exists. Only virtual networks in the currently selected subscription and location are listed in the drop-down list.|
    | **Subnet** | The Azure Data Explorer subnet.|

1. Select **Next: Tags >** button at the bottom of the page.

### Tags tab

1. Create any tags (names and values) that you want to associate with the private endpoint resource. 
1. Select **Review + create** button at the bottom of the page.

### Review and create

Review all the settings, and select **Create** to create the private endpoint.

Confirm that you see the private endpoint connection you created shows up in the list of endpoints. In this example, the private endpoint is auto-approved because you connected to an Azure resource in your directory and you have sufficient permissions.



# [Event Hub - Service Endpoint](#tab/event-hub-service)

## Allow Access to Azure Event Hub from Azure Data Explorer Subnets using a Service Endpoint

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

1. In the right-hand **Add networks** pane, fill in the following information:

    :::image type="content" source="media/vnet-private-link-storage-event-hub/add-networks.png" alt-text="Add networks fields to connect VNet to Azure Data Explorer":::  

    | Setting | Field description|
    |---|---|
    | **Subscription** | Select your Azure subscription. |
    | **Virtual networks** | The VNet where the Azure Data Explorer subnet exists.|
    | **Subnets** | The Azure Data Explorer subnet.|

1. Select **Add**.

### Save and verify virtual network settings

1. Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to appear on the portal notifications
    
    :::image type="content" source="media/vnet-private-link-storage-event-hub/event-hub-firewalls-and-vnet.png" alt-text="Add virtual network and subnet in Event Hub to connect to Azure Data Explorer"::: 

# [Azure Storage](#tab/storage-account)

## Allow Access to Azure Storage Account from Azure Data Explorer Subnets

This section shows you how to use Azure portal to add a virtual network service endpoint. To limit access, integrate the virtual network service endpoint for this Azure Storage account.

### Add a virtual network 

1. Navigate to the storage account you want to secure.
1. In the left-hand menu, select **Firewalls and virtual networks**.
1. Enable access from **Selected networks**.
1. Under **Virtual Networks**, select **+ Add existing virtual network**. 

    :::image type="content" source="media/vnet-private-link-storage-event-hub/storage-add-existing-vnet.png" alt-text="Add existing VNet connection Azure Storage to Azure Data Explorer":::

### Add networks pane

1. In the right-hand **Add networks** pane, fill in the following information:

    :::image type="content" source="media/vnet-private-link-storage-event-hub/storage-add-networks.png" alt-text="Add virtual network to Azure Storage Account to connect to Azure Data Explorer":::

    | Setting | Field description|
    |---|---|
    | **Subscription** | Select your Azure subscription.|
    |**Virtual networks** | The VNet where the Azure Data Explorer subnet exists.|
    | **Subnets** | The Azure Data Explorer subnet.|

    > [!NOTE]
    > Enable the service endpoint before adding the virtual network to the list. If the service endpoint isn't enabled, the portal will prompt you to enable it.
    
1. Select **Add**.

### Save and verify virtual network settings

1. Select **Save** on the toolbar to save the settings. Wait for a few minutes for confirmation to appear on the portal notifications.

    :::image type="content" source="media/vnet-private-link-storage-event-hub/storage-virtual-network.png" alt-text="Vnet to connect storage account to Azure Data Explorer":::

---

## See also

* [Azure Virtual Network (VNet)](/azure/virtual-network/virtual-networks-overview)
* [Private Endpoint](/azure/private-link/private-endpoint-overview)
* [Create an Azure Data Explorer cluster in your virtual network](vnet-create-cluster-portal.md)
* [Deploy Azure Data Explorer cluster into your Virtual Network](vnet-deployment.md)
* [Private Link FAQ](/azure/private-link/private-link-faq)
