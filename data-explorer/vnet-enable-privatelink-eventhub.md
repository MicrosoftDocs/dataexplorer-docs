---
title: Enable Private Endpoint between ADX and Event Hub
description: Learn how to Enable Private Endpoint between ADX and Event Hub
author: gunjand
ms.author: gunjand
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/21/2020
---
# Enable Private Endpoint between ADX and Event Hub

Customers deploying Azure Data Explore in their virtual network (VNET) can establish security network connection to other Azure services via [Private Endpoint](/azure/private-link/private-endpoint-overview). In this document we will discuss steps for enabling Private Endpoint between Azure Data Explorer and Event Hub.

The virtual network rule is an association of the Event Hubs namespace with a virtual network subnet. While the rule exists, all workloads bound to the subnet are granted access to the Event Hubs namespace. Event Hubs itself never establishes outbound connections, doesn't need to gain access, and is therefore never granted access to your subnet by enabling this rule.
 
Private endpoints enable you to block exfiltration of data from your VNet. Using private endpoints also enables you to securely connect between a event hub and Azure Data Explorer. The event hubs will access private endpoint of the Azure Data Explorer for ingestion.

## Important
Virtual networks are supported in **standard** and **dedicated** tiers of Event Hubs. It's not supported in the basic tier. 


## Allow Access to Azure Event Hub from ADX Subnets

#### Use Azure portal
1.	Go to the **Event Hubs namespace** you want to secure.
1.	Click on the settings menu called **Firewalls and virtual networks**.
1.	Select **Networking** under **Settings** on the left menu. You see the **Networking** tab only for **standard** or **dedicated** namespaces.
1.  Select the Selected Networks option at the top of the page if it isn't already selected.
1.  In the **Virtual Network** section of the page, select **+Add existing virtual network***. Select **+ Create new virtual network** if you want to create a new VNet.

    ![storage vnet diagram](media/vnet-enable-privatelink-eventhub\Eventhub-1.png)

1.	To grant access to a virtual network with a new network rule, under **Virtual networks**, 
1.	click **Add existing virtual network**, 
1.	select **Virtual networks** where Azure Data Explorer subnet exist.
1.	 And On **Subnets** options, select Azure Data Explorer subnet
1.	and then lastly click **Add**.

    ![storage add network diagram](media/vnet-enable-privatelink-eventhub\Eventhub-2.png)

1.	Select **Save** on the toolbar to save the settings. Wait for a few minutes for the confirmation to show up on the portal notifications

    ![storage subnet diagram](media/vnet-enable-privatelink-eventhub\Eventhub-3.png)