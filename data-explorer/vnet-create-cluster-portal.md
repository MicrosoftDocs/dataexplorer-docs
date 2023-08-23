---
title: Create an Azure Data Explorer cluster & DB in your virtual network
description: 'In this article, you learn how to create an Azure Data Explorer cluster in your virtual network.'
ms.reviewer: basaba
ms.topic: how-to
ms.date: 03/08/2023

#Customer intent: As a database administrator, I want to create an Azure Data Explorer cluster and database in my virtual network.
---

# Create an Azure Data Explorer cluster in your virtual network

Azure Data Explorer supports deploying a cluster into a subnet in your virtual network (VNet). This capability enables you to access the cluster privately from your Azure virtual network or on-premises, access resource such as Event Hubs and Azure Storage inside your virtual network, and restrict inbound and outbound traffic.

> [!IMPORTANT]
> In the Azure portal, the ability to inject a cluster into your virtual network during cluster creation was removed. You can still, though [not recommended](security-network-overview.md#comparison-and-recommendation), inject a cluster into a virtual network using [ARM templates](https://azure.microsoft.com/resources/templates/kusto-vnet/).

> [!Note]
> Injecting a cluster into a virtual network enables you to manage all of its traffic. Therefore, you are responsible for ensuring that any connected services are able to communicate with each other, including Azure Event Hubs or Azure Storage accounts.

**See also**

> [!div class="nextstepaction"]
> [Deploy Azure Data Explorer into your Virtual Network](vnet-deployment.md)
