---
title: Create a Private Endpoints for Azure Data Explorer
description: 'In this article you will learn how to create a private endpoint for Azure Data Explorer.'
author: herauch
ms.author: herauch
ms.reviewer: eladb
ms.service: data-explorer
ms.topic: how-to
ms.date: 01/21/2022
---

# Create a Private Endpoints for Azure Data Explorer (public preview)

Use a Private Endpoint to connect to your Azure Data Explorer cluster in your Azure Virtual Network.

Azure Private Endpoints use private IP addresses from your Azure Virtual Network to connect you privately to Azure Data Explorer. With this setup, network traffic between a client on your private network and the Azure Data Explorer cluster travels over the VNet and a Private Link on the Microsoft backbone network. This article shows you how to create Private Endpoint for your Azure Data Explorer cluster.

## Prerequisites

* [Create an Azure Data Explorer Cluster](create-cluster-database-portal.md) that is not injected in a virtual network
* [Create a virtual network](/azure/virtual-network/quick-create-portal)

## Create a Private Endpoint

![Schematic private endpoint based architecture.](media/security-network-private-endpoint/pe-create-1.png)

![Schematic private endpoint based architecture.](media/security-network-private-endpoint/pe-create-2.png)

![Schematic private endpoint based architecture.](media/security-network-private-endpoint/pe-create-3.png)

![Schematic private endpoint based architecture.](media/security-network-private-endpoint/pe-create-4.png)

![Schematic private endpoint based architecture.](media/security-network-private-endpoint/pe-create-5.png)

![Schematic private endpoint based architecture.](media/security-network-private-endpoint/pe-create-6.png)

![Schematic private endpoint based architecture.](media/security-network-private-endpoint/pe-create-7.png)

## Next steps

* [Troubleshooting Private Endpoints in Azure Data Explorer](security-network-private-endpoint-troubleshoot.md)
