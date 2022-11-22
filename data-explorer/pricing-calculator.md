---
title: Azure Data Explorer Pricing Calculator
description: Explore different pricing options based on your specific cluster needs with Azure Data Explorer pricing calculator.
ms.topic: how-to
ms.date: 11/21/2022
---

# Get an estimate for Azure Data Explorer with the pricing calculator

Azure Data Explorer provides a [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=azure-data-explorer) to estimate the cost of your cluster. The estimate is calculated from either an auto-selected set of components or from components you manually select and configure. As you change the configuration, the price estimate changes as well to help you understand the cost implications of your configuration choices.

This article explains each of the components of the calculator and gives tips and resources along the way to help you make better decisions about how to configure your cluster.

## How it works

The calculator estimates a monthly cost for the following components:

* Region and environment
* Estimated data ingestion
* Engine instances
* Data management instances
* Storage and transactions
* Networking
* Azure Data Explorer markup

At the bottom of the form, the total monthly cost estimate updates as you make changes to each of the components.

> [!NOTE]
> Other resources such as Network I/O, Bandwidth, and VNET cost may be charged separately based on your cross-region usage.

## Get started

1. Go to the [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=azure-data-explorer).
1. Scroll down the page until you see a tab titled **Your Estimate**. Check if **Azure Data Explorer** appears in this tab.  
    1. If so, go on to step 3.
    1. If not, scroll back to the top of the page and type “Azure Data Explorer” into the search box. Select the **Azure Data Explorer** widget.
1. Start the configuration.

:::image type="content" source="media/pricing/pricing-calculator.png" alt-text="Image of online Azure Data Explorer pricing calculator.":::

> [!TIP]
> Create multiple estimates for the same or different products by selecting the **+** tab. Once the new tab is open, search for a product using the search box or select one from the products list. Stay organized by giving each estimate a name in place of the **Your Estimate** heading.

## Region and environment

### Region

Select the **Region** for your cluster based on the [Azure regions decision guide](/azure/cloud-adoption-framework/migrate/azure-best-practices/multiple-regions).

Some key considerations when picking a region are VM sizes and families, data residency and protection, disaster recovery, and availability zones.

* Not all VM sizes or VM families are offered in each region. If you’re looking for a SKU that isn’t listed in the selected region, choose a different region.

* If you need to keep the data within a specific geography, select from the regions in the same geography. For more information, see Enabling Data Residency and Data Protection in Microsoft Azure Regions.

* To build a disaster recovery (DR) Azure Data Explorer cluster, deploy the DR cluster in a DR region, or paired region. For more information, see Cross-region replication in Azure: Business continuity and disaster recovery.

* Availability Zones – An Availability Zone (AZ) is a high availability offering that protects your applications and data from data center failures. Choose AZ during cluster creation if it is enabled in your selected region. For fault tolerance within a single region, deploy your cluster to one or many zones. AZ enabled clusters use ZRS storage instead of LRS. For more information see, Data redundancy - Azure Storage | Microsoft Docs.  

### Environment

Select the type of **Environment** for your cluster: production or dev/test.

Dev/test clusters are great for service evaluation, conducting PoCs, and scenario validations because unlike production clusters:

* Dev/test clusters are limited in size and can’t grow beyond a single node.
* Azure Data Explorer markup isn't charged for dev/test clusters.
* There’s no product SLA for dev/test clusters.

## Estimated data ingestion

This component asks for estimates of the amount of data collected per day, hot cache retention, total retention, and data compression. These factors influence the price of the rest of the components of your cluster.

### Data Collected per day (GB/TB)

This field represents the data that you plan to ingest without compression into Azure Data Explorer cluster every day. Calculate this based on the number of files and the average size of a file being ingested. If you're streaming the data using messages, review the average size of a single message and how many messages you're ingesting. The default value of this field is 100 GB.

### Hot cache retention (days)

This field represents ingested data that's cached according to our [cache policy](./kusto/management/cachepolicy.md) on the local SSD of the Engine service. Your query performance requirement determines the amount of compute nodes and local SSD storage needed. Where slower performance is acceptable, use blob storage for data that isn’t queried often to reduce costs.

### Total retention (days)

This field represents the period for which your data is available for query. This is a combination of hot data and cold cache which keeps the data in the blob, indexed and compressed. Choose the data retention window based on compliance or other regulatory requirements. Leverage the [hot window capability](../data-explorer/hot-windows.md) to warm the data based on the time window for faster queries.  

### Estimated data compression

This field represents all ingested data is compressed by default. Data compression varies based on the cardinality of the values and its structure. For example, logs data ingested in structured columns has higher compression compared to dynamic columns or GUID. To see your ratio, use the “.show tables details” command and divide the original size by the extent size. Use the [Azure Data Explorer free cluster](https://dataexplorer.azure.com/freecluster) to try this out.

> [!IMPORTANT]
> If you want to granularly configure the remaining components, turn off Auto-select Engine Instances.

## Engine instances

Engine instances are responsible for indexing, caching data on local SSDs, premium storage as managed disks, and serving queries. The Engine service requires a minimum of two compute instances. Choose from a [wide variety of SKUs](./manage-cluster-choose-sku.md) to match the workload for your use case. If you change the workload type, the auto-selected instance type will adjust accordingly. The Premium Managed Disk component is preconfigured based on the SKU selected.

To configure engine instances, choose between the following workload options:

* **All** – automatically selects the optimal SKU based on the input you provide
* **Compute Optimized SKUs** -
  * Provides high cores to hot cache ratio
  * Suited for high query rates
  * Local SSD for low latency I/O
* **Storage optimized SKUs** -
  * Provides larger storage options ranging from 1TB to 4 TB per Engine node
  * Suited for workloads that require catching large data sizes
  * Premium storage (managed disk) is attached to the engine node instead of Local SSD for hot data storage in some SKUs
* **Isolate Compute SKUs** -
  * Suited for running workloads that require server instance-level isolation
  * See [Isolation in the Azure Public Cloud](/azure/security/fundamentals/isolation-choices)

## Data management instances

The data management (DM) service is responsible for data ingestion from managed data pipelines such as Azure Blob storage, Event Hub, IoT Hub, and from other services like Azure Data Factory, Azure Stream Analytics, and Kafka. The service requires a minimum of two compute instances which are automatically configured and managed based on the engine instance size.  

To configure the DM instances, set the number of hours/days/months you’d like to run the instance.

## Storage and transactions

The storage component is the persistent layer where all the data is stored compressed and is billed as Standard LRS or as Standard ZRS. The storage isn't configurable. It is calculated based on the amount of data collected, the total retention days, and the estimated data compression.

## Networking

This component is configured using the [bandwidth service](https://azure.microsoft.com/pricing/details/bandwidth/).  

To add and set up a bandwidth service estimate:  

* Scroll to the top of the page, in the search products box, type in “bandwidth.”
* Select the Bandwidth product.
* Scroll down to the Bandwidth component of the estimate.
* Select a data transfer type.
* Select a source region.
* Select a destination region.
* Enter the estimated amount of outbound data (in GB).

> [!NOTE]
> Select the same region where logs are generated to avoid cross region cost and reduce latency. There’s no data transfer cost between Azure services deployed in the same region.

## Azure Data Explorer markup

This is a premium support option for your data ingestion and engine clusters. It is billed based on the number of engine vCPUs in the cluster and is not charged for dev clusters. Your costs change based on the number of hours/days/months configured in the engine instances component. For more information, see [Azure Data Explorer pricing - FAQ](https://azure.microsoft.com/pricing/details/data-explorer/#faq).

## Support

Choose a support plan:

* **Developer** - select this option when configuring Azure Data Explorer in a non-production environment or for trial and evaluation. For more information, see the [Azure Support: Developer](https://azure.microsoft.com/support/plans/developer/) page.

* **Standard** - select this option when configuring Azure Data Explorer when you need minimal business critical dependence. For more information, see the [Azure Support: Standard](https://azure.microsoft.com/support/plans/standard/) page.

* **Professional Direct** - select this option when you need substantial business critical utilization of Azure Data Explorer. For more information, see the [Azure Support: Professional Direct](https://azure.microsoft.com/support/plans/prodirect/) page.

## What to do with your estimate

* Export the estimate to Excel
* Save the estimate for future reference
* Share the estimate – login required

## Next Steps

* [Create a free Azure Data Explorer cluster](./start-for-free-web-ui.md)
* [Start-for-free cluster](./start-for-free.md)
