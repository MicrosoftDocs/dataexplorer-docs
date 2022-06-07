---
title: Select correct compute SKU for your Azure Data Explorer cluster
description: This article describes how to select the optimal compute SKU size for Azure Data Explorer cluster.
ms.reviewer: anshulsharmas
ms.topic: how-to
ms.date: 06/06/2022
---

# Selecting a SKU for your Azure Data Explorer cluster

When you create a new cluster or optimize a cluster for a changing workload, Azure Data Explorer offers multiple virtual machine (VM) SKUs to choose from. These compute SKUs have been carefully chosen to give you the most optimal cost for any workload.

The size and VM SKU of the data-management cluster are fully managed by the Azure Data Explorer service. They're determined by such factors as the engine's VM size and the ingestion workload.

You can change the compute SKU for the engine cluster at any time by [scaling up the cluster](manage-cluster-vertical-scaling.md) . It's best to start with the smallest SKU size that fits the initial scenario. Keep in mind that scaling up the cluster results in a downtime of up to 30 minutes while the cluster is re-created with the new SKU. You can also use the [Azure Advisor](azure-advisor.md) recommendations to optimize your compute SKU.

You can use the [Pricing calculator](https://aka.ms/adx.cost) to estimate the pricing of your Azure Data Explorer cluster, based on your workloads and data volume.

> [!TIP]
> By purchasing a reservation, you can pre-pay for the Azure Data Explorer, the virtual machines used in the cluster and storage resources costs for a period of one or three years. These reserved instances (RI) are bought separately and can save a significant amount of money and secure the best rates for your Azure Data Explorer cluster. For more information, see [Prepay for Azure Data Explorer markup units with Azure Data Explorer reserved capacity](pricing-reserved-capacity.md).

## Select a cluster type

Azure Data Explorer offers two types of clusters:

* **Production (with SLA)**&mdash;Production clusters contain two or more nodes for engine and data-management clusters and are operated under the Azure Data Explorer SLA.
* **Dev/Test (no SLA)**&mdash;Dev/Test clusters have a single node for the engine and data-management cluster. This cluster type is the lowest cost configuration because of its low instance count and no engine markup charge. There's no SLA for this cluster configuration because it lacks redundancy.

### Development vs production

Development clusters are great for service evaluation, setting up ingestion pipelines, conducting PoC or scenario validation. Key differences between the development cluster vs production clusters are:

* Development clusters are limited in size and can't grow beyond just a single node
* Azure Data Explorer markup isn't charged for development clusters
* Limited product SLA for development clusters

### Compute SKU types

Azure Data Explorer cluster supports various SKUs for different types of workloads. Each SKU offers a distinct SSD and CPU ratio to help customers correctly size their deployment and build cost optimal solutions for their enterprise analytical workload.

**Compute optimized**

* Provides a high core to cache ratio and the lowest cost per core.
* Local SSD for low latency I/O.

**Storage optimized**

* Provides larger storage ranging from 1 TB to 4 TB per engine node and the lowest cost per GB.
* Suited for workloads that require storage for large volumes of data.
* Certain SKUs use premium storage (PS) attached to the engine node instead of local SSDs for hot data storage. Accessing PS is slower than local SSDs. SKUs with PS are more expensive and have lower performance.

## Select and optimize your compute SKU

### Select your compute SKU during cluster creation

When you create an Azure Data Explorer cluster, select the optimal VM SKU for the planned workload.
The following attributes can also help you make SKU selection:

| Attribute | Details  |
|---------|---------|
|Cost per GB cache per core | High cost with compute optimized SKUs. Low cost with storage optimized SKUs |
| Reserved Instances (RI) pricing | RI discount varies by region and by SKU |

> [!NOTE]
> For Azure Data Explorer cluster, compute cost is the most significant part of cluster cost as compared to storage and networking.

### Optimize your cluster compute SKU

To optimize your cluster compute SKU, configure vertical scaling and check Azure Advisor recommendations.

With various compute SKU options to choose from, you can optimize costs for the performance and hot-cache requirements for your scenario.
Choose a compute optimized SKU for optimal performance for high query volumes.
Choose a storage optimized SKU for the best performance when querying large volumes data that need to be cached.  

It's preferable to use a few nodes of a larger VMs that have larger RAM, than many smaller SKU nodes. More RAM is needed for some query types that put higher demands on RAM, such as queries that use joins. So when scaling the cluster, we recommend scaling up to a larger SKU when using small VMs, and scaling out by adding more nodes as needed.

> [!NOTE]
> Scale up (changing SKU operation) requires a window of up to 30 minutes of downtime, while scale out does not have this impact the cluster availability.

### SKU Availability

SKU availability differs based on selected:

* **Region**&mdash;Not all SKUs are available in all regions or availability zones, refer the respective compute sku page for regional availability.
* **Subscription**&mdash;certain SKUs might only be available for a particular customer segment. If a SKU isn't available for your subscription in a location or zone that meets your business needs, submit a [SKU request](/azure/general/region-access-request-process) to Azure Support.

### Compute SKU options

The following sku series are available for Azure Data Explorer cluster VMs. The sku families within the compute/storage optimized bucket are ranked in order of recommendation.

| Category | SKU Series | Available vCPU config | SKU type | Supports premium storage |
|--|--|--|--|--|
| Compute optimized | [Eadsv5](/azure/virtual-machines/easv5-eadsv5-series) | 2,4,8,16 | AMD | No |
| Compute optimized | [Edv5](/azure/virtual-machines/edv5-edsv5-series), [Edv4](/azure/virtual-machines/edv4-edsv4-series) | 2,4,8,16 | Intel | No |
| Compute optimized | [Eav4](/azure/virtual-machines/eav4-easv4-series) | 2,4,8,16 | AMD | No |
| Compute optimized | [Dv2](/azure/virtual-machines/dv2-dsv2-series) | 2,4,8,16 | Intel | No |
| Storage optimized | [Lasv3](/azure/virtual-machines/lasv3-series) | 8, 16 | AMD | No |
| Storage optimized | [Lsv3](/azure/virtual-machines/lsv3-series) | 8,16 | Intel | No |
| Storage optimized | [Easv5](/azure/virtual-machines/easv5-eadsv5-series), [Easv4](/azure/virtual-machines/eav4-easv4-series) | 8,16 | AMD | Yes |
| Storage optimized | [Esv5](/azure/virtual-machines/ev5-esv5-series), [Esv4](/azure/virtual-machines/ev4-esv4-series) | 8,16 | Intel | Yes |
| Storage optimized | [DSv2](/azure/virtual-machines/dv2-dsv2-series) | 8,16 | AMD | Yes |
| Dev (No SLA) | All SKU series with 2 cores | 2 | AMD/Intel | No |

* With ADX compute and storage isolation, customers can start with most cost optimal SKU and move to another SKU after maturing the usage pattern without any data loss.
* You can view the updated compute SKU list per region by using the Azure Data Explorer [ListSkus API](/dotnet/api/microsoft.azure.management.kusto.clustersoperationsextensions.listskus).

### Cache size

From the disk size as shown in the Azure compute specification, ADX reserves a certain size for cluster operation. The exact available cache size for each SKU is available in the [SKU selection section in the portal](https://ms.portal.azure.com/#create/Microsoft.AzureKusto).
