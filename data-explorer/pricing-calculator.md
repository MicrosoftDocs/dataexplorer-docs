---
title: Azure Data Explorer Pricing Calculator
description: Explore different pricing options based on your specific cluster needs with Azure Data Explorer pricing calculator.
ms.topic: how-to
ms.date: 11/21/2022
---

# Estimate the cost of your Azure Data Explorer cluster with the pricing calculator

Azure Data Explorer provides a [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=azure-data-explorer) to estimate the cost of your cluster. The estimate is calculated from an auto-selected set of components or from components you manually select and configure. As you make changes to the configuration, the price estimate also changes so you can understand the cost implications of your configuration choices.

This article explains each of the components of the calculator and gives tips and resources along the way to help you make better decisions about how to configure your cluster.

## How it works

The calculator estimates a monthly cost for the following components based on the region, environment, and estimated data ingestion of your cluster:

* Engine instances
* Data management instances
* Storage and transactions
* Networking
* Azure Data Explorer markup

At the bottom of the form, these individual component estimates are added together to create a total monthly estimate. The component estimates and total estimate update as you make configuration changes.  

The coming sections of this article correspond to the components in the calculator and will highlight what you need to know as you go.

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

## Region

Before you choose a region for your cluster, consider your requirements. There are Azure regions all over the world, and they don't all provide exactly the same services or capacity.

For example, if you need [availability zone support](/azure/reliability/availability-zones-service-support#azure-regions-with-availability-zone-support) or [disaster recovery](/azure/reliability/cross-region-replication-azure) then you'll need to choose a region that supports these services. Or if you need to keep the data within a specific geography due to [data residency and protection](https://azure.microsoft.com/resources/achieving-compliant-data-residency-and-security-with-azure/) concerns, you'll need to select regions within the relevant geography. Check out the [Azure regions decision guide](/azure/cloud-adoption-framework/migrate/azure-best-practices/multiple-regions) for more specifics.

Once you've decided which region is right for you, select the desired **Region** in the calculator.

## Environment

There are two options for your cluster environment: **production** or **dev/test**.

Dev/test clusters are the lowest cost option, which makes them great for service evaluation, conducting PoCs, and scenario validations. They're limited in size and can't grow beyond a single node. There's no Azure Data Explorer markup charge and also no product SLA for these clusters.

Production clusters contain two or more nodes for engine and data management and operate under the Azure Data Explorer SLA.

In the calculator, select the type of **Environment** for your cluster.

## Estimated data ingestion

The information provided in the **Estimated Data Ingestion** section of the calculator influences the price of all the components of your cluster. This component asks for estimates of the amount of data collected per day, hot cache retention, total retention, and data compression.

* **Data Collected per day (GB/TB)**: Data that you plan to ingest without compression into Azure Data Explorer cluster every day. Calculate this estimate based on the number of files and the average size of a file being ingested. If you're streaming the data using messages, review the average size of a single message and how many messages you're ingesting.

* **Hot cache retention (days)**: Ingested data that's cached according to our [cache policy](./kusto/management/cachepolicy.md) on the local SSD of the Engine service. Your query performance requirement determines the amount of compute nodes and local SSD storage needed. Where slower performance is acceptable, use blob storage for data that isn’t queried often to reduce costs.

* **Total retention (days)**: Period for which your data is available for query. This retention is a combination of hot data and cold cache that keeps the data in the blob, indexed and compressed. Choose the data retention window based on compliance or other regulatory requirements. Apply the [hot window capability](../data-explorer/hot-windows.md) to warm the data based on the time window for faster queries.  

* **Estimated data compression**: All ingested data is compressed by default. Data compression varies based on the cardinality of the values and its structure. For example, logs data ingested in structured columns has higher compression compared to dynamic columns or GUID. To see your ratio, use the “.show tables details” command and divide the original size by the extent size.

> [!IMPORTANT]
> If you want to granularly configure the remaining components, turn off Auto-select Engine Instances.

## Engine instances

Engine instances are responsible for indexing, caching data on local SSDs, premium storage as managed disks, and serving queries. The Engine service requires a minimum of two compute instances.

In this component, when you change the **Workload** type, the auto-selected **Instance** adjusts accordingly. There's a [wide variety of SKUs](./manage-cluster-choose-sku.md) to match the workload for your use case. The **Premium Managed Disk** component is pre-configured based on the SKU selected.

Choose between the following **Workload** options:

* **All** – automatically selects the optimal SKU based on the input you provide
* **Compute Optimized SKUs** -
  * Provides high cores to hot cache ratio
  * Suited for high query rates
  * Local SSD for low latency I/O
* **Storage optimized SKUs** -
  * Provides larger storage options of 1 TB to 4 TB per Engine node
  * Suited for workloads that require caching large data sizes
  * In some SKUs, premium managed disk storage is attached to the engine node instead of Local SSD for hot data storage
* **Isolate Compute SKUs** -
  * Suited for running workloads that require server instance-level isolation
  * See [Isolation in the Azure Public Cloud](/azure/security/fundamentals/isolation-choices)

## Data management instances

The data management (DM) service is responsible for data ingestion from managed data pipelines like Azure Blob storage, Event Hubs, IoT Hub, and other services like Azure Data Factory, Azure Stream Analytics, and Kafka. The service requires a minimum of two compute instances that are automatically configured and managed based on the engine instance size.  

In this component, provide the number of hours/days/months you’d like to run the instance.

## Storage and transactions

The storage component is the persistent layer where all the data is stored compressed and is billed as Standard LRS or as Standard ZRS. The storage isn't configurable. It's calculated based on the amount of data collected, the total retention days, and the estimated data compression.

## Networking

This component is configured using the [bandwidth service](https://azure.microsoft.com/pricing/details/bandwidth/).  

To get a bandwidth service estimate:  

1. Scroll to the top of the page
1. Type in “bandwidth” in the search box
1. Select the Bandwidth product widget
1. Scroll down to the Bandwidth component of the estimate
1. Select a data transfer type
1. Select a source region
1. Select a destination region
1. Enter the estimated amount of outbound data in GB

> [!NOTE]
> Select the same region where logs are generated to avoid cross region cost and reduce latency. There’s no data transfer cost between Azure services deployed in the same region.

## Azure Data Explorer markup

The Azure Data Explorer markup is charged for the premium support option provided with your data ingestion and engine clusters. It's billed based on the number of engine vCPUs in the cluster and isn't charged for dev clusters. Your costs change based on the number of hours/days/months configured in the engine instances component. For more information, see [Azure Data Explorer pricing - FAQ](https://azure.microsoft.com/pricing/details/data-explorer/#faq).

## Support

Choose a support plan:

* **Developer**: select this option when configuring Azure Data Explorer in a non-production environment or for trial and evaluation. For more information, see the [Azure Support: Developer](https://azure.microsoft.com/support/plans/developer/) page.

* **Standard**: select this option when configuring Azure Data Explorer when you need minimal business critical dependence. For more information, see the [Azure Support: Standard](https://azure.microsoft.com/support/plans/standard/) page.

* **Professional Direct**: select this option when you need substantial business critical utilization of Azure Data Explorer. For more information, see the [Azure Support: Professional Direct](https://azure.microsoft.com/support/plans/prodirect/) page.

## What to do with your estimate

* Export the estimate to Excel
* Save the estimate for future reference
* Share the estimate – sign in required

## Next Steps

* [Create a free Azure Data Explorer cluster](./start-for-free-web-ui.md)
* [Start-for-free cluster](./start-for-free.md)
