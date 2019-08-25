---
title: Virtual Network deployment - Azure Data Explorer | Microsoft Docs
description: This article describes Virtual Network deployment in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/22/2019
---
# Virtual Network deployment

Azure Data Explorer supports deploying a cluster into a subnet in your Virtual Network (VNet). This enables you to:

* Enforce Network Security Group (NSG) rules on your Azure Data Explorer cluster traffic.
* Connect your on-premise network to Azure Data Explorer cluster's subnet.
* Secure your data connection sources (Event Hub and Event Grid) with service endpoints.

Azure Data Explorer cluster has the following IP addresses for each service (Engine and Data Management services):

* Private IP: Used for accessing the cluster inside the VNet.
* Public IP: Used for accessing the cluster from outside the VNet (e.g. management and monitoring) and as a source address for outbound connections initiated from the cluster.

> [!NOTE]
> The feature is still in private preview, please  fill this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR6nDlY4aY3NAipxPJw0yfjhUNDRSOFpXQURZTFZDMEhEVk5HTzhJNjZYRi4u)  to deploy the Azure Data Explorer cluster into your VNet.

