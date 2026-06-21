---
title: Create business continuity and disaster recovery solutions with Azure Data Explorer
description: This article describes how to create business continuity and disaster recovery solutions with Azure Data Explorer
ms.reviewer: 
ms.topic: how-to
ms.date: 06/21/2026
---

# Create business continuity and disaster recovery solutions with Azure Data Explorer

This article explains how to prepare for an Azure regional outage by replicating your Azure Data Explorer resources, management, and ingestion in different Azure regions. The article includes an example of data ingestion with Azure Event Hubs. It also discusses cost optimization for different architecture configurations. For a more in-depth look at architecture considerations and recovery solutions, see the [business continuity overview](business-continuity-overview.md).

## Prepare for Azure regional outage to protect your data

Azure Data Explorer doesn't support automatic protection against the outage of an entire Azure region. This disruption can happen during a natural disaster, like an earthquake. If you need a disaster recovery solution, follow these steps to ensure business continuity. In these steps, you replicate your clusters, management activities, and data ingestion in two Azure paired regions.

1. [Create two or more independent clusters](#create-multiple-independent-clusters) in two Azure paired regions.
1. [Replicate all management activities](#replicate-management-activities) such as creating new tables or managing user roles on each cluster.
1. Ingest data into each cluster in parallel.

### Create multiple independent clusters

Create more than one [Azure Data Explorer cluster](create-cluster-and-database.md) in more than one region.
Create at least two of these clusters in [Azure paired regions](/azure/best-practices-availability-paired-regions).

The following diagram shows three replica clusters in three different regions.

:::image type="content" source="media/business-continuity-create-solution/independent-clusters.png" alt-text="Diagram that shows three independent Azure Data Explorer clusters in three Azure regions.":::

### Replicate management activities

Replicate management activities so every replica has the same cluster configuration.

1. Create the same resources on each replica:
    * Databases: Use the [Azure portal](create-cluster-and-database.md#create-a-database) or one of the [SDKs](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/kusto/Azure.ResourceManager.Kusto) to create a new database.
    * [Tables](/kusto/management/create-table-command?view=azure-data-explorer&preserve-view=true)
    * [Mappings](/kusto/management/create-ingestion-mapping-command?view=azure-data-explorer&preserve-view=true)
    * [Policies](/kusto/management/index?view=azure-data-explorer&preserve-view=true)

1. Manage the [authentication and authorization](/kusto/management/security-roles?view=azure-data-explorer&preserve-view=true) on each replica.

    :::image type="content" source="media/business-continuity-create-solution/regional-duplicate-management.png" alt-text="Diagram that shows replicated management activities across regional Azure Data Explorer clusters.":::

## Disaster recovery solution using Event Hubs ingestion

After you complete [Prepare for Azure regional outage to protect your data](#prepare-for-azure-regional-outage-to-protect-your-data), Azure Data Explorer stores your data and management across multiple regions. If there's an outage in one region, Azure Data Explorer can use the other replicas.

### Set up ingestion by using Event Hubs

To ingest data from [Azure Event Hubs](/azure/event-hubs/event-hubs-about) into each region's Azure Data Explorer cluster, first replicate your Azure Event Hubs setup in each region. Then configure each region's Azure Data Explorer replica to [ingest data from its corresponding Event Hubs](create-event-hubs-connection.md).

> [!NOTE]
> Ingestion through Azure Event Hubs, IoT Hub, or Storage is robust. If a cluster isn't available for time, it catches up later and inserts any pending messages or blobs. This process relies on [checkpointing](/azure/event-hubs/event-hubs-features#checkpointing).

:::image type="content" source="media/business-continuity-create-solution/event-hub-management-scheme.png" alt-text="Diagram that shows Event Hubs ingestion configured across regions for resilient data collection.":::

This diagram shows that your data sources produce events to Event Hubs in all regions, and each Azure Data Explorer replica consumes those events. Data visualization components like Power BI, Grafana, or SDK-powered web apps can query one replica.

:::image type="content" source="media/business-continuity-create-solution/data-sources-visualization.png" alt-text="Diagram that shows data sources sending events to regional replicas and client visualization tools querying a replica.":::

## Optimize costs

Now you're ready to optimize your replicas by using some of the following methods:

* [Create an on-demand data recovery configuration](#create-an-on-demand-data-recovery-configuration).
* [Start and stop the replicas](#start-and-stop-the-replicas).
* [Implement a highly available application service](#implement-a-highly-available-application-service).
* [Optimize cost in an active-active configuration](#optimize-cost-in-an-active-active-configuration).

### Create an on-demand data recovery configuration

Replicating and updating the Azure Data Explorer setup linearly increases cost as the number of replicas increases. To optimize cost, implement an architectural variant that balances time, failover, and cost.
An on-demand data recovery configuration optimizes cost by using passive Azure Data Explorer replicas. These replicas are only turned on if there's a disaster in the primary region (for example, region A). The replicas in Regions B and C don't need to be active 24/7, which significantly reduces the cost. But in most cases, these replicas don't perform and the primary cluster. For more information, see [On-demand data recovery configuration](business-continuity-overview.md#on-demand-data-recovery-configuration).

In the following diagram, only one cluster ingests data from Event Hubs. The primary cluster in Region A performs [continuous data export](/kusto/management/data-export/continuous-data-export?view=azure-data-explorer&preserve-view=true) of all data to a storage account. The secondary replicas access the data by using [external tables](/kusto/query/schema-entities/external-tables?view=azure-data-explorer&preserve-view=true).

:::image type="content" source="media/business-continuity-create-solution/active-hot-standby-scheme.png" alt-text="Diagram that shows an on-demand data recovery architecture with one active primary cluster and passive replicas.":::

### Start and stop the replicas

Start and stop the secondary replicas by using one of the following methods:

* [Azure Data Explorer connector to Power Automate (preview)](flow.md)

* The **Stop** button in the **Overview** tab in the Azure portal. For more information, see [Stop and restart the cluster](create-cluster-and-database.md#stop-and-restart-the-cluster).

* Azure CLI:

```azurecli
az kusto cluster stop --name=<clusterName> --resource-group=<rgName> --subscription=<subscriptionId>
```

### Implement a highly available application service

#### Create the Azure App Service BCDR client

This section shows you how to create an [Azure App Service](https://azure.microsoft.com/services/app-service/) that supports a connection to a single primary and multiple secondary Azure Data Explorer clusters. The following image illustrates the Azure App Service setup.

:::image type="content" source="media/business-continuity-create-solution/app-service-setup.png" alt-text="Create an Azure App Service.":::

> [!TIP]
> Having multiple connections between replicas in the same service gives you increased availability. This setup isn't only useful in instances of regional outages.

1. Use this [boilerplate code for an app service](https://github.com/Azure/azure-kusto-bcdr-boilerplate). To implement a multicluster client, use the [AdxBcdrClient](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/master/webapp/ADX/AdxBcdrClient.cs) class. Each query that this client executes is sent [first to the primary cluster](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/26f8c092982cb8a3757761217627c0e94928ee07/webapp/ADX/AdxBcdrClient.cs#L69). If a failure occurs, the query is sent to secondary replicas.

1. Use [custom application insights metrics](/azure/azure-monitor/app/api-custom-events-metrics) to measure performance and request distribution to primary and secondary clusters.

#### Test the Azure App Service BCDR client

The following test uses multiple Azure Data Explorer replicas. After a simulated outage of primary and secondary clusters, the App Service BCDR client behaves as intended.

:::image type="content" source="media/business-continuity-create-solution/simulation-verify-service.png" alt-text="Verify app service BCDR client.":::

The Azure Data Explorer clusters are distributed across West Europe (2xD14v2 primary), South East Asia, and East US (2xD11v2).

:::image type="content" source="media/business-continuity-create-solution/performance-test-query-time.png" alt-text="Cross planet query response time.":::

> [!NOTE]
> Slower response times are due to different SKUs and cross planet queries.

#### Perform dynamic or static routing

Use [Azure Traffic Manager routing methods](/azure/traffic-manager/traffic-manager-routing-methods) for dynamic or static request routing. Azure Traffic Manager is a DNS-based traffic load balancer that you can use to distribute App Service traffic. This traffic is optimized to services across global Azure regions, while providing high availability and responsiveness.

You can also use [Azure Front Door based routing](/azure/frontdoor/front-door-routing-methods). For comparison of these two methods, see [Load-balancing with Azure's application delivery suite](/azure/frontdoor/front-door-lb-with-azure-app-delivery-suite).

### Optimize cost in an active-active configuration

Using an active-active configuration for disaster recovery increases the cost linearly. The cost includes nodes, storage, markup, and increased networking cost for [bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/).

#### Use optimized autoscale to optimize costs

Use the [optimized autoscale](manage-cluster-horizontal-scaling.md#optimized-autoscale-recommended-option) feature to configure horizontal scaling for the secondary clusters. Size secondary clusters to handle the ingestion load. When the primary cluster isn't reachable, secondary clusters get more traffic and scale according to the configuration.

In this example, optimized autoscale saves roughly 50% in cost compared to using the same horizontal and vertical scale on all replicas.

## Related content

* [Business continuity and disaster recovery overview](business-continuity-overview.md)
