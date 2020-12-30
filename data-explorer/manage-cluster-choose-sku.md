---
title: Select correct compute SKU for your Azure Data Explorer cluster
description: This article describes how to select the optimal compute SKU size for Azure Data Explorer cluster.
author: orspod
ms.author: orspodek
ms.reviewer: avnera
ms.service: data-explorer
ms.topic: how-to
ms.date: 10/13/2020
---

# Select the correct compute SKU for your Azure Data Explorer cluster 

When you create a new cluster or optimize a cluster for a changing workload, Azure Data Explorer offers multiple virtual machine (VM) SKUs to choose from. These compute SKUs have been carefully chosen to give you the most optimal cost for any workload. 

The size and VM SKU of the data-management cluster are fully managed by the Azure Data Explorer service. They're determined by such factors as the engine's VM size and the ingestion workload. 

You can change the compute SKU for the engine cluster at any time by [scaling up the cluster](manage-cluster-vertical-scaling.md). It's best to start with the smallest SKU size that fits the initial scenario. Keep in mind that scaling up the cluster results in a downtime of up to 30 minutes while the cluster is re-created with the new SKU. You can also use the [Azure Advisor recommendations](azure-advisor.md) to optimize your compute SKU.

> [!TIP]
> [Compute Reserved Instances (RI)](/azure/virtual-machines/windows/prepay-reserved-vm-instances) is applicable to the Azure Data Explorer cluster.  

This article describes various compute SKU options and provides the technical details that can help you make the best choice.

## Select a cluster type

Azure Data Explorer offers two types of clusters:

* **Production**: Production clusters contain two nodes for engine and data-management clusters and are operated under the Azure Data Explorer [SLA](https://azure.microsoft.com/support/legal/sla/data-explorer/v1_0/).

* **Dev/Test (no SLA)**: Dev/Test clusters have a single node for the engine and data-management cluster. This cluster type is the lowest cost configuration because of its low instance count and no engine markup charge. There's no SLA for this cluster configuration, because it lacks redundancy.

## Compute SKU types

Azure Data Explorer cluster supports a variety of SKUs for different types of workloads. Each SKU offers a distinct SSD and CPU ratio to help customers correctly size their deployment and build cost optimal solutions for their enterprise analytical workload.

### Compute optimized

* Provides a high core to cache ratio.
* Suited for a high rate of queries over small to moderate data sizes.
* Local SSD for low latency I/O.

### Heavy compute

* AMD SKUs that offer a much higher core to cache ratio.
* Local SSD for low latency I/O.

### Storage optimized

* Option for larger storage ranging from 1 TB to 4 TB per engine node.
* Suited for workloads that require storing a large volume of data with less intensive compute query requirements.
* Certain SKUs use premium storage (managed disk) attached to the engine node instead of local SSD for hot data storage.

### Isolated compute

Ideal SKU for running workloads that require server instance-level isolation.

## Select and optimize your compute SKU 

### Select your compute SKU during cluster creation

When you create an Azure Data Explorer cluster, select the *optimal* VM SKU for the planned workload.

The following attributes can also help you make SKU selection:
 
| Attribute | Details |
|---|---
|**Availability**| Not all SKUs are available in all regions |
|**Cost per GB cache per core**| High cost with compute and heavy compute optimized. Low cost with storage optimized SKUs |
|**Reserved Instances (RI) pricing**| RI discount varies by region and by SKU |  

> [!NOTE]
> For Azure Data Explorer cluster, compute cost is the most significant part of cluster cost as compared to storage and networking.

### Optimize your cluster compute SKU

To optimize your cluster compute SKU, [configure vertical scaling](manage-cluster-vertical-scaling.md#configure-vertical-scaling) and check [Azure Advisor recommendations](azure-advisor.md). 

With various compute SKU options to choose from, you can optimize costs for the performance and hot-cache requirements for your scenario. 
* If you need the most optimal performance for a high query volume, the ideal SKU should be compute-optimized. 
* If you need to query large volumes of data with relatively lower query load, the storage-optimized SKU can help reduce costs and still provide excellent performance.

Because the number of instances per cluster for the small SKUs is limited, it's preferable to use larger VMs that have greater RAM. More RAM is needed for some query types that put more demand on the RAM resource, such as queries that use `joins`. That's why, when you're considering scaling options, we recommend that you scale-up to a larger SKU rather than scale-out by adding more instances.

## Compute SKU options

The technical specifications for the Azure Data Explorer cluster VMs are described in the following table:

|**Name**| **Category** | **SSD size** | **Cores** | **RAM** | **Premium storage disks (1&nbsp;TB)**| **Minimum instance count per cluster** | **Maximum instance count per cluster**
|---|---|---|---|---|---|---|---
|Dev(No SLA) Standard_D11_v2| compute-optimized | 75&nbsp;GB    | 1 | 14&nbsp;GB | 0 | 1 | 1
|Dev(No SLA) Standard_E2a_v4| compute-optimized | 18&nbsp;GB    | 1 | 14&nbsp;GB | 0 | 1 | 1
|Standard_D11_v2| compute-optimized | 75&nbsp;GB    | 2 | 14&nbsp;GB | 0 | 2 | 8 
|Standard_D12_v2| compute-optimized | 150&nbsp;GB   | 4 | 28&nbsp;GB | 0 | 2 | 16
|Standard_D13_v2| compute-optimized | 307&nbsp;GB   | 8 | 56&nbsp;GB | 0 | 2 | 1,000
|Standard_D14_v2| compute-optimized | 614&nbsp;GB   | 16| 112&nbsp;GB | 0 | 2 | 1,000
|Standard_E2a_v4| heavy compute | 18&nbsp;GB    | 2 | 16&nbsp;GB | 0 | 2 | 8 
|Standard_E4a_v4| heavy compute | 54&nbsp;GB   | 4 | 32&nbsp;GB | 0 | 2 | 16
|Standard_E8a_v4| heavy compute | 127&nbsp;GB   | 8 | 64&nbsp;GB | 0 | 2 | 1,000
|Standard_E16a_v4| heavy compute | 273&nbsp;GB   | 16| 128&nbsp;GB | 0 | 2 | 1,000
|Standard_DS13_v2 + 1&nbsp;TB&nbsp;PS| storage-optimized | 1&nbsp;TB | 8 | 56&nbsp;GB | 1 | 2 | 1,000
|Standard_DS13_v2 + 2&nbsp;TB&nbsp;PS| storage-optimized | 2&nbsp;TB | 8 | 56&nbsp;GB | 2 | 2 | 1,000
|Standard_DS14_v2 + 3&nbsp;TB&nbsp;PS| storage-optimized | 3&nbsp;TB | 16 | 112&nbsp;GB | 2 | 2 | 1,000
|Standard_DS14_v2 + 4&nbsp;TB&nbsp;PS| storage-optimized | 4&nbsp;TB | 16 | 112&nbsp;GB | 4 | 2 | 1,000
|Standard_E8as_v4 + 1&nbsp;TB&nbsp;PS| storage-optimized | 1&nbsp;TB | 8 | 64&nbsp;GB | 1 | 2 | 1,000
|Standard_E8as_v4 + 2&nbsp;TB&nbsp;PS| storage-optimized | 2&nbsp;TB | 8 | 64&nbsp;GB | 2 | 2 | 1,000
|Standard_E16as_v4 + 3&nbsp;TB&nbsp;PS| storage-optimized | 3&nbsp;TB | 16 | 128&nbsp;GB | 3 | 2 | 1,000
|Standard_E16as_v4 + 4&nbsp;TB&nbsp;PS| storage-optimized | 4&nbsp;TB | 16 | 128&nbsp;GB | 4 | 2 | 1,000
|Standard_L4s| storage-optimized | 650&nbsp;GB | 4 | 32&nbsp;GB | 0 | 2 | 16
|Standard_L8s| storage-optimized | 1.3&nbsp;TB | 8 | 64&nbsp;GB | 0 | 2 | 1,000
|Standard_L16s| storage-optimized | 2.6&nbsp;TB | 16| 128&nbsp;GB | 0 | 2 | 1,000
|Standard_L8s_v2| storage-optimized | 1.7&nbsp;TB | 8 | 64&nbsp;GB | 0 | 2 | 1,000
|Standard_L16s_v2| storage-optimized | 3.5&nbsp;TB | 16| 128&nbsp;GB | 0 | 2 | 1,000
|Standard_E64i1_v3| isolated compute | 1.1&nbsp;TB | 16| 128&nbsp;GB | 0 | 2 | 1,000

* You can view the updated compute SKU list per region by using the Azure Data Explorer [ListSkus API](/dotnet/api/microsoft.azure.management.kusto.clustersoperationsextensions.listskus?view=azure-dotnet). 
* Learn more about the [various SKUs](/azure/virtual-machines/windows/sizes). 

## Next steps

* You can [scale up or scale down](manage-cluster-vertical-scaling.md) the engine cluster at any time by changing the VM SKU, depending on differing needs. 

* You can [scale in or scale out](manage-cluster-horizontal-scaling.md) the size of the engine cluster to alter capacity, depending on changing demands.

* Use [Azure Advisor recommendations](azure-advisor.md) to optimize your compute SKU.
