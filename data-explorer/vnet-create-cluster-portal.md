---
title: Create an Azure Data Explorer cluster & DB in your virtual network
description: 'In this article, you learn how to create an Azure Data Explorer cluster in your virtual network.'
ms.reviewer: basaba
ms.topic: how-to
ms.date: 07/23/2024

#Customer intent: As a database administrator, I want to create an Azure Data Explorer cluster and database in my virtual network.
---

# Create an Azure Data Explorer cluster in your virtual network

Azure Data Explorer supports deploying a cluster into a subnet in your virtual network (VNet). This capability enables you to access the cluster privately from your Azure virtual network or on-premises, access resource such as Event Hubs and Azure Storage inside your virtual network, and restrict inbound and outbound traffic.

> [!WARNING]
> Virtual Network Injection will be retired for Azure Data Explorer by 1 February 2025. For more information on the deprecation, see [Deprecation of Virtual Network Injection for Azure Data Explorer](https://aka.ms/adx.security.vnet.deprecation).

**See also**

> [!div class="nextstepaction"]
> [Deploy Azure Data Explorer into your Virtual Network](vnet-deployment.md)
