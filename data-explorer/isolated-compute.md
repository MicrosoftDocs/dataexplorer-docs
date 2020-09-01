---
title: Support for Isolated Compute
description: 'In this article, you learn about Azure Data Explorer support for Isolated Compute.'
author: orspod
ms.author: orspodek
ms.reviewer: dagrawal
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/01/2020

#Customer intent: I want to deploy Azure Data Explorer Cluster in Isolated Compute SKUs.
---

# Create an Azure Data Explorer cluster in Isolated Compute VMs
       
Isolated Compute Virtual machines enables customers to run their workload in hardware isolated environment and dedicated to single customer. Azure Data Explorer now provides support for Isolated compute SKU **Standard_E64i_v3**. Clusters deployed with Isolated compete VMs are best suited for workloads that require a high degree of isolation from other customers for compliance and regulatory requirements. Learn more about Azure guidance for Isolated compute [here](https://docs.microsoft.com/azure/azure-government/azure-secure-isolation-guidance#compute-isolation).

Azure Data Explorer currently supports isolated compute in following regions:
- US West 2
- US East
- South Central US

Isolated compute VMs are highly priced and ideal SKU for running workload that required server instance level isolation. Click [here](https://docs.microsoft.com/azure/data-explorer/manage-cluster-choose-sku) for list of all supported SKUs for Azure Data Explorer.

> [!NOTE]
> [Azure Dedicated Host](https://azure.microsoft.com/services/virtual-machines/dedicated-host/) is currently not supported by Azure Data Explorer. 