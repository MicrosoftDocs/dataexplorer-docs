---
title: Select correct compute SKU for your Azure Data Explorer cluster
description: This article describes how to select the optimal compute SKU size for Azure Data Explorer cluster.
ms.reviewer: anshulsharmas
ms.topic: how-to
ms.date: 06/06/2022
---

# Select a SKU for your Azure Data Explorer cluster

When you create a new cluster or optimize a cluster for a changing workload, Azure Data Explorer offers multiple virtual machine (VM) SKUs to choose from. These compute SKUs have been carefully chosen to give you the most optimal cost for any workload.

The size and VM SKU of the data management cluster are fully managed by the Azure Data Explorer service. They're determined by factors such as the engine's VM size and the ingestion workload.

You can change the compute SKU for the cluster at any time by [scaling up the cluster](manage-cluster-vertical-scaling.md). It's best to start with the smallest SKU size that fits the initial scenario. Scaling up the cluster results in up to 30 minutes of downtime while it's re-created with the new SKU. You can also use the [Azure Advisor](azure-advisor.md) recommendations to optimize your compute SKU.

You can use the [Pricing calculator](https://aka.ms/adx.cost) to estimate the pricing of your Azure Data Explorer cluster, based on your workloads and data volume.

> [!TIP]
> By purchasing a reservation, you can pre-pay for the cluster, the virtual machines used in the cluster, and storage resources costs for a period of one or three years. These reserved instances (RI) are bought separately and can save a significant amount of money securing the best rates for your Azure Data Explorer cluster. For more information, see [Prepay for Azure Data Explorer markup units with Azure Data Explorer reserved capacity](pricing-reserved-capacity.md).

## Select a cluster type

Azure Data Explorer offers two types of clusters:

* **Production (with SLA)**: Production clusters contain two or more nodes for engine and data management clusters and are operated under the Azure Data Explorer SLA.
* **Dev/Test (no SLA)**: Dev/Test clusters have a single node for the engine and data management cluster. This cluster type is the lowest cost configuration because of its low instance count and no engine markup charge. There's no redundancy or SLA for this cluster configuration.

### Development vs. production

Development clusters are great for service evaluation, setting up an ingestion pipeline, conducting a proof of concept (PoC) or a scenario validation. Key differences between development clusters versus production clusters include:

* Development clusters are limited in size and can't grow beyond a single node
* Azure Data Explorer markup isn't charged for development clusters
* No SLA for development clusters

### Compute SKU types

Azure Data Explorer clusters support various SKUs for different types of workloads. Each SKU offers a distinct SSD storage and CPU ratio to help you correctly size your deployment and build cost-optimal solutions for your enterprise analytical workload.

**Compute optimized**

* Provides a high core to cache ratio and the lowest cost per core.
* Local SSD for low latency I/O.

**Storage optimized**

* Provides larger storage ranging from 1 terabyte (TB) to 4 TB per engine node and the lowest cost per gigabyte (GB).
* Suited for workloads that require storage for large volumes of data.
* Certain SKUs use premium storage (PS) attached to the engine node instead of local SSDs. Accessing PS is slower than local SSDs, so SKUs with PS are more expensive and are less performant than SKUs with local SSD attached.

## Select and optimize your compute SKU

### Select your compute SKU during cluster creation

When you create an Azure Data Explorer cluster, select the optimal VM SKU for the planned workload.
Use the following attributes to help you choose the correct SKU for your environment:

| Attribute | Details |
|--|--|
|Cost per GB| High cost with compute optimized. Low cost with storage optimized SKUs. |
|Cost per core| Low cost with compute optimized. High cost with storage optimized SKUs. |
| RI pricing | RI discount varies by region and by SKU. |

> [!NOTE]
> Compute cost is the most significant part of a cluster's cost.

### Optimize your cluster compute SKU

To optimize your cluster compute SKU, configure vertical scaling and check Azure Advisor recommendations.

With various compute SKU options to choose from, you can optimize costs for the performance and hot-cache requirements for your scenario.
Choose a compute optimized SKU for optimal performance when there are high query volumes.
Choose a storage optimized SKU for the best performance when querying large volumes of data that need to be cached.  

It's preferable to use a few nodes of larger VMs that use more RAM, than many smaller VMs. More RAM is needed for some query types that put higher demands on RAM, such as queries that use joins. So when scaling the cluster, we recommend scaling up to a larger SKU, and scaling out by adding more nodes as needed.

> [!NOTE]
> Changing or scaling up the cluster's SKU may cause a one to three minute service disruption. Query performance may be affected during the SKU migration, and the extent of impact may vary depending on usage patterns.

### SKU Availability

SKU availability differs based on the following factors:

* **Region**: Not all SKUs are available in all regions or availability zones. For more information, see each [SKU page](#sku-options) for regional availability.
* **Subscription**: Some SKUs may only be available for specific subscription types. If a SKU isn't available for your subscription in a location or zone that meets your business needs, submit a [SKU request](/troubleshoot/azure/general/region-access-request-process) to Azure support.

### SKU options

The following SKU series are available for Azure Data Explorer cluster VMs. The SKU families within the compute and storage optimized categories are ranked in order of recommendation.

**Storage Optimized**

| SKU Series | Available vCPU config | SKU type | Supports premium storage |
|--|--|--|--|
| [Lasv3](/azure/virtual-machines/lasv3-series) | 8, 16 , 32| AMD | No |
| [Lsv3](/azure/virtual-machines/lsv3-series) | 8, 16 , 32| Intel | No |
|  [Easv4](/azure/virtual-machines/eav4-easv4-series), [Easv5](/azure/virtual-machines/easv5-eadsv5-series), ECasv5| 8, 16 | AMD | Yes |
| [Esv4](/azure/virtual-machines/ev4-esv4-series), [Esv5](/azure/virtual-machines/ev5-esv5-series) | 8, 16 | Intel | Yes |
| [DSv2](/azure/virtual-machines/dv2-dsv2-series) | 8, 16 | Intel | Yes |

**Compute optimized**

| SKU Series | Available vCPU config | SKU type | Supports premium storage |
|--|--|--|--|
| [Eadsv5](/azure/virtual-machines/easv5-eadsv5-series), [ECadsv5](/azure/virtual-machines/ecasv5-ecadsv5-series)| 2, 4, 8, 16 | AMD | No |
| [Edv4](/azure/virtual-machines/edv4-edsv4-series), [Edv5](/azure/virtual-machines/edv5-edsv5-series) | 2, 4, 8, 16 | Intel | No |
| [Eav4](/azure/virtual-machines/eav4-easv4-series) | 2, 4, 8, 16 | AMD | No |
| [Dv2](/azure/virtual-machines/dv2-dsv2-series) | 2, 4, 8, 16 | Intel | No |

> [!NOTE]
> All compute optimized SKUs with 2 cores can be configured as dev clusters.
> 
> It is recommended to use L32asv3 / L32sv3 only in uses cases with either very large L16asv3/L16sv3 clusters reaching the 1000 cluster node limit, or clusters with extremely high concurrent request rates.
> ECasv5 and ECadsv5 are confidential computing SKUs. For more details, read about [Confidential Computing VMs](/azure/confidential-computing/confidential-vm-overview). For storage optimized ECasv5 SKUs, in case you [Use your own customer-managed key](/azure/data-explorer/customer-managed-keys-portal) (CMK), CMK encryption is performed on both storage accounts and premium storage disks.

* With Azure Data Explorer compute and storage isolation, you can start with the most optimal cost SKU and move to another SKU after maturing the usage pattern or data loss.
* You can view the updated compute SKU list per region by using the Azure Data Explorer [ListSkus API](/dotnet/api/microsoft.azure.management.kusto.clustersoperationsextensions.listskus).

### Cache size

Azure Data Explorer reserves a portion of the disk size shown in each of the Azure compute [SKU](#sku-options) specifications to be used for cluster operations. The exact cache size for each SKU is available in the [SKU selection section in the portal](https://ms.portal.azure.com/#create/Microsoft.AzureKusto).

## Related content

* Learn how to use the [pricing calculator](pricing-calculator.md)




