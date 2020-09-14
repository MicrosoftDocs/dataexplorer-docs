---
title: Enable Private Endpoint between ADX and Event Hub
description: Enable Private Endpoint between ADX and Event Hub
author: gunjand
ms.author: gunjand
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/21/2020
---
# Enable Private Endpoint between ADX and Event Hub

Currently thousands of the companies use Azure Data Explorer in their own Virtual Network (VNet), so they  can secure the data  inside their network. There are another options where you can secure your data ingestion  in Azure Data Explorer inside your network without exposing to internet. 

Private endpoints enable clients on an Azure virtual network (VNet) to securely access data from a storage account over a private link. This enables network traffic between the Azure Data Explorer and the storage service to traverse over the Microsoft backbone, eliminating exposure from the public internet. A private endpoint uses an IP address from your VNet’s address space for the storage account service.
 
Private endpoints enable you to block exfiltration of data from your VNet. Using private endpoints also enables you to securely connect between a storage account and Azure Data Explorer. The storage accounts will access private endpoint of the Azure Data Explorer for ingestion.
 


## Allow Access to Azure Storage Account from ADX Subnets

This section shows you how to use Azure portal to add a virtual network service endpoint. To limit access, you need to integrate the virtual network service endpoint for this Event Hubs namespace.
#### Use Azure portal
1.	Go to the storage account you want to secure.
1.	Click on the settings menu called **Firewalls and virtual networks**.
1.	Check that you've selected to allow access from **Selected networks**.

    ![storage vnet diagram](media/vnet-enable-privatelink-storage\Storage-1.png)

1.	Select the virtual network from the list of virtual networks, and then pick the **subnet**. You have to enable the service endpoint before adding the virtual network to the list. If the service endpoint isn't enabled, the portal will prompt you to enable it.
1.	You should see the following successful message after the service endpoint for the subnet is enabled for **Microsoft.EventHub**. Select **Add** at the bottom of the page to add the network.



    ![storage add network diagram](media/vnet-enable-privatelink-storage\Storage-2.png)

1.	Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to show up on the portal notifications.

    ![storage subnet diagram](media/vnet-enable-privatelink-storage\Storage-3.png)