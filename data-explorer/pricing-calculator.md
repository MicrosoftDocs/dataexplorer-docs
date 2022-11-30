---
title: Azure Data Explorer Pricing Calculator
description: Explore different pricing options based on your specific cluster needs with Azure Data Explorer pricing calculator.
ms.topic: how-to
ms.date: 11/21/2022
---

# Azure Data Explorer pricing calculator

Azure Data Explorer provides a [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=azure-data-explorer) to estimate the cost of your cluster. The estimate is based on specifications such as estimated data ingestion and engine workload. As you make changes to the configuration, the price estimate also changes so you can understand the cost implications of your configuration choices.

This article explains each of the components of the calculator and gives tips along the way to help you make better decisions about how to configure your cluster.

## How it works

You set the region, environment, and estimated data ingestion of your cluster. Then, the calculator estimates a monthly cost based on auto-selected or manually selected specifications in each of the following components:

* Engine instances
* Data management instances
* Storage and transactions
* Networking
* Azure Data Explorer markup

At the bottom of the form, the individual component estimates are added together to create a total monthly estimate. The component estimates and total update as you make configuration changes.

> [!NOTE]
> Other resources such as Network I/O, Bandwidth, and VNET cost may be charged separately based on your cross-region usage.

## Get started

1. Go to the [pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=azure-data-explorer).
1. Scroll down the page until you see a tab titled **Your Estimate**.
1. Verify that **Azure Data Explorer** appears in the tab. If it doesn't, do the following:
    1. Scroll back to the top of the page.
    1. In the search box, type “Azure Data Explorer”.
    1. Select the **Azure Data Explorer** widget.
1. Start the configuration.

The sections of this article correspond to the components in the calculator and highlight what you need to know.

:::image type="content" source="media/pricing/pricing-calculator.png" alt-text="Screenshot of the online Azure Data Explorer pricing calculator.":::

> [!TIP]
> Create multiple estimates for the same or different products by selecting the **+** tab. Once the new tab is open, search for a product using the search box or select one from the products list. Stay organized by giving each estimate a name in place of the **Your Estimate** heading.

## Region

Before you choose a region for your cluster, consider your use case. There are Azure regions all over the world, and they don't all provide exactly the same services or capacity.

For example, if you need [availability zone support](/azure/reliability/availability-zones-service-support#azure-regions-with-availability-zone-support) or [disaster recovery](/azure/reliability/cross-region-replication-azure), you'll need to choose a region that supports these services. Or if you need to keep the data within a specific geography due to [data residency and protection](https://azure.microsoft.com/resources/achieving-compliant-data-residency-and-security-with-azure/) concerns, you'll need to select regions within the relevant geography. For more information, see [Azure regions decision guide](/azure/cloud-adoption-framework/migrate/azure-best-practices/multiple-regions).

In the calculator, select the desired **Region** for your cluster.

## Environment

There are two options for your cluster environment: **production** or **dev/test**.

Dev/test clusters are the lowest cost option, which makes them great for service evaluation, conducting PoCs, and scenario validations. They're limited in size and can't grow beyond a single node. There's no Azure Data Explorer markup charge or product SLA for these clusters.

Production clusters contain two or more nodes for engine and data management and operate under the Azure Data Explorer SLA.

In the calculator, select the type of **Environment** for your cluster.

## Estimated data ingestion

The information provided in the **Estimated Data Ingestion** section of the calculator influences the price of all the components of your cluster.

In the calculator, enter estimates for the following fields:

* **Data Collected per day (GB/TB)**: Data that you plan to ingest without compression into Azure Data Explorer cluster every day. Calculate this estimate based on the number of files and the average size of a file being ingested. If you're streaming the data using messages, review the average size of a single message and how many messages you're ingesting.

* **Hot cache retention (days)**: Ingested data that's cached according to our [cache policy](./kusto/management/cachepolicy.md) on the local SSD of the Engine service. Your query performance requirement determines the amount of compute nodes and local SSD storage needed.

* **Total retention (days)**: Period for which your data is available for query. This retention is a combination of hot data and cold cache that keeps the data in the blob, indexed and compressed. Choose the data retention window based on compliance or other regulatory requirements. Apply the [hot window capability](../data-explorer/hot-windows.md) to warm the data based on the time window for faster queries.  

* **Estimated data compression**: Ratio between the uncompressed data size and compressed size. Data compression varies based on the cardinality of the values and its structure. For example, logs data ingested in structured columns has higher compression compared to dynamic columns or GUID. All ingested data is compressed by default.

At this point, your cluster cost estimate will reflect your data requirements.

> [!IMPORTANT]
> If you want to individually configure the remaining components, turn off **AUTO-SELECT ENGINE INSTANCES**.
>
> :::image type="content" source="media/pricing/auto-select-engine-instances.png" alt-text="Image of auto select engine instances toggle.":::

### Engine instances

Engine instances are responsible for indexing, caching data on local SSDs, premium storage as managed disks, and serving queries. The engine service requires a minimum of two compute instances.

In this component, when you change the **Workload** type, the auto-selected **Instance** adjusts accordingly. There's a [wide variety of SKUs](./manage-cluster-choose-sku.md) to match the workload for your use case. The **Premium Managed Disk** component is pre-configured based on the SKU selected.

Choose between the following **Workload** options:

* **All**: Automatically selects the optimal SKU based on the input you provide
* **Compute Optimized SKUs**:
  * Provides high cores to hot cache ratio
  * Suited for high query rates
  * Local SSD for low latency I/O
* **Storage optimized SKUs**:
  * Provides larger storage options of 1 TB to 4 TB per Engine node
  * Suited for workloads that require caching large data sizes
  * In some SKUs, premium managed disk storage is attached to the engine node instead of Local SSD for hot data storage

> [!NOTE]
> Not all **VM Series** are offered in each region. If you are looking for a SKU that is not listed in the selected region, choose a different region.

### Data management instances

The data management (DM) service is responsible for data ingestion from managed data pipelines like Azure Blob storage, Event Hubs, IoT Hub, and other services like Azure Data Factory, Azure Stream Analytics, and Kafka. The service requires a minimum of two compute instances that are automatically configured and managed based on the engine instance size.  

In this component, provide the number of hours, days, or months you’d like to run the instance.

### Storage and transactions

The storage component is the persistent layer where all the data is stored compressed and is billed as Standard LRS or as Standard ZRS. The storage isn't configurable. It's calculated based on the amount of data collected, the total retention days, and the estimated data compression.

### Networking

This component is configured using the [bandwidth service](https://azure.microsoft.com/pricing/details/bandwidth/).  

To get a bandwidth service estimate:  

1. Scroll to the top of the page
1. In the search box, type in “bandwidth”
1. Select the Bandwidth product widget
1. Scroll down to the Bandwidth component of the estimate
1. Select a data transfer type
1. Select a source region
1. Select a destination region
1. Enter the estimated amount of outbound data in GB

> [!NOTE]
> Select the same region where logs are generated to avoid cross region cost and reduce latency. There’s no data transfer cost between Azure services deployed in the same region.

### Azure Data Explorer markup

The Azure Data Explorer markup is charged for the premium support option provided with your data ingestion and engine clusters. It's billed based on the number of engine vCPUs in the cluster and isn't charged for dev clusters. Your costs change based on the number of hours, days, or months configured in the engine instances component. For more information, see [Azure Data Explorer pricing - FAQ](https://azure.microsoft.com/pricing/details/data-explorer/#faq).

### Support

Choose a support plan:

* **Developer**: Select this option when configuring Azure Data Explorer in a non-production environment or for trial and evaluation. For more information, see the [Azure Support: Developer](https://azure.microsoft.com/support/plans/developer/) page.

* **Standard**: Select this option when configuring Azure Data Explorer when you need minimal business critical dependence. For more information, see the [Azure Support: Standard](https://azure.microsoft.com/support/plans/standard/) page.

* **Professional Direct**: Select this option when you need substantial business critical utilization of Azure Data Explorer. For more information, see the [Azure Support: Professional Direct](https://azure.microsoft.com/support/plans/prodirect/) page.

## What to do with your estimate

* Export the estimate to Excel
* Save the estimate for future reference
* Share the estimate – sign-in is required

## Next Steps

* [Create a free Azure Data Explorer cluster](./start-for-free-web-ui.md)
* [Start-for-free cluster](./start-for-free.md)
