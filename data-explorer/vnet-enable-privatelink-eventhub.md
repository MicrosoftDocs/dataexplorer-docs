---
title: Deploy Azure Data Explorer into your Virtual Network
description: Learn how to deploy Azure Data Explorer into your Virtual Network
author: gunjand
ms.author: gunjand
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/21/2020
---
# Enable Private Endpoint between ADX and Event Hub

Currently thousands of the companies use Azure Data Explorer in their own Virtual Network (VNet), so they  can secure the data  inside their network. There are another options where you can secure your data ingestion  in Azure Data Explorer inside your network without exposing to internet. 

Private endpoints enable clients on an Azure virtual network (VNet) to securely access data from a Event hubs over a private link. This enables network traffic between the Azure Data Explorer and the event hub service to traverse over the Microsoft backbone, eliminating exposure from the public internet. A private endpoint uses an IP address from your VNet’s address space for the storage account service.
 
Private endpoints enable you to block exfiltration of data from your VNet. Using private endpoints also enables you to securely connect between a event hub and Azure Data Explorer. The event hubs will access private endpoint of the Azure Data Explorer for ingestion.
 


## Allow Access to Azure Event Hub from ADX Subnets

#### Use Azure portal
1.	Go to the storage account you want to secure.
1.	Click on the settings menu called **Firewalls and virtual networks**.
1.	Check that you've selected to allow access from **Selected networks**.

    ![storage vnet diagram](media/vnet-enable-privatelink-eventhub\Eventhub-1.png)

1.	To grant access to a virtual network with a new network rule, under **Virtual networks**, 
1.	click **Add existing virtual network**, 
1.	select **Virtual networks** where ADX subnet exist.
1.	 And On **Subnets** options, select ADX subnet
1.	and then lastly click **Add**.

    ![storage add network diagram](media/vnet-enable-privatelink-eventhub\Eventhub-2.png)

1.	Click **Save** to apply your changes.

    ![storage subnet diagram](media/vnet-enable-privatelink-eventhub\Eventhub-3.png)