---
title: Create business continuity and disaster recovery solutions with Azure Data Explorer
description: This article describes how to create business continuity and disaster recovery solutions with Azure Data Explorer
ms.reviewer: herauch
ms.topic: conceptual
ms.date: 01/03/2022
---

# Create business continuity and disaster recovery solutions with Azure Data Explorer

This article details how you can prepare for an Azure regional outage by replicating your Azure Data Explorer resources, management, and ingestion in different Azure regions. An example of data ingestion with Azure Event Hubs is given. Cost optimization is also discussed for different architecture configurations. For a more in-depth look at architecture considerations and recovery solutions, see the [business continuity overview](business-continuity-overview.md).

## Prepare for Azure regional outage to protect your data

Azure Data Explorer doesn't support automatic protection against the outage of an entire Azure region. This disruption can happen during a natural disaster, like an earthquake. If you require a solution for a disaster recovery situation, do the following steps to ensure business continuity. In these steps, you'll replicate your clusters, management, and data ingestion in two Azure paired regions.

1. [Create two or more independent clusters](#create-multiple-independent-clusters) in two Azure paired regions.
1. [Replicate all management activities](#replicate-management-activities) such as creating new tables or managing user roles on each cluster.
1. Ingest data into each cluster in parallel.

### Create multiple independent clusters

Create more than one [Azure Data Explorer cluster](create-cluster-and-database.md) in more than one region.
Make sure that at least two of these clusters are created in [Azure paired regions](/azure/best-practices-availability-paired-regions).

The following image shows replicas, three clusters in three different regions. 

:::image type="content" source="media/business-continuity-create-solution/independent-clusters.png" alt-text="Create independent clusters.":::

### Replicate management activities

Replicate the management activities to have the same cluster configuration in every replica.

1. Create on each replica the same: 
    * Databases: You can use the [Azure portal](create-cluster-and-database.md#create-a-database) or one of our [SDKs](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/kusto/Microsoft.Azure.Management.Kusto) to create a new database.
    * [Tables](kusto/management/create-table-command.md)
    * [Mappings](kusto/management/create-ingestion-mapping-command.md)
    * [Policies](./kusto/management/index.md)

1. Manage the [authentication and authorization](kusto/management/security-roles.md) on each replica.

    :::image type="content" source="media/business-continuity-create-solution/regional-duplicate-management.png" alt-text="Duplicate management activities.":::    

## Disaster recovery solution using event hub ingestion

Once you've completed [Prepare for Azure regional outage to protect your data](#prepare-for-azure-regional-outage-to-protect-your-data), your data and management are distributed to multiple regions. If there's an outage in one region, Azure Data Explorer will be able to use the other replicas.

### Set up ingestion using an event hub

To ingest data from [Azure Event Hubs](/azure/event-hubs/event-hubs-about) into each region's Azure Data Explorer cluster, first replicate your Azure Event Hubs setup in each region. Then configure each region's Azure Data Explorer replica to [ingest data from its corresponding Event Hubs](ingest-data-event-hub.md).

> [!NOTE] 
> Ingestion via Azure Event Hubs/IoT Hub/Storage is robust. If a cluster isn't available for a period of time, it will catch up at a later time and insert any pending messages or blobs. This process relies on [checkpointing](/azure/event-hubs/event-hubs-features#checkpointing).

:::image type="content" source="media/business-continuity-create-solution/event-hub-management-scheme.png" alt-text="Ingest via Azure Event Hubs.":::

As shown in the diagram below, your data sources produce events to event hubs in all regions, and each Azure Data Explorer replica consumes the events. Data visualization components like Power BI, Grafana, or SDK powered WebApps can query one of the replicas.

:::image type="content" source="media/business-continuity-create-solution/data-sources-visualization.png" alt-text="Data sources to data visualization.":::

## Optimize costs

Now you're ready to optimize your replicas using some of the following methods:

* [Create an on-demand data recovery configuration](#create-an-on-demand-data-recovery-configuration)
* [Start and stop the replicas](#start-and-stop-the-replicas)
* [Implement a highly available application service](#implement-a-highly-available-application-service)
* [Optimize cost in an active-active configuration](#optimize-cost-in-an-active-active-configuration)

### Create an on-demand data recovery configuration

Replicating and updating the Azure Data Explorer setup will linearly increase the cost with the number of replicas. To optimize cost, you can implement an architectural variant to balance time, failover, and cost.
In an on-demand data recovery configuration, cost optimization has been implemented by introducing passive Azure Data Explorer replicas. These replicas are only turned on if there's a disaster in the primary region (for example, region A). The replicas in Regions B and C don't need to be active 24/7, reducing the cost significantly. However, in most cases, the performance of these replicas won't be as good as the primary cluster. For more information, see [On-demand data recovery configuration](business-continuity-overview.md#on-demand-data-recovery-configuration).

In the image below, only one cluster is ingesting data from the event hub. The primary cluster in Region A performs [continuous data export](kusto/management/data-export/continuous-data-export.md) of all data to a storage account. The secondary replicas have access to the data using [external tables](kusto/query/schema-entities/externaltables.md).

:::image type="content" source="media/business-continuity-create-solution/active-hot-standby-scheme.png" alt-text="architecture for an on-demand data recovery configuration.":::

### Start and stop the replicas 

You can start and stop the secondary replicas using one of the following methods:

* [Azure Data Explorer connector to Power Automate (Preview)](flow.md)

* The **Stop** button in the **Overview** tab in the Azure portal. For more information, see [Stop and restart the cluster](create-cluster-and-database.md#stop-and-restart-the-cluster).

* Azure CLI: 

```azurecli
az kusto cluster stop --name=<clusterName> --resource-group=<rgName> --subscription=<subscriptionId>” 
```

### Implement a highly available application service

#### Create the Azure App Service BCDR client

This section shows you how to create an [Azure App Service](https://azure.microsoft.com/services/app-service/) that supports a connection to a single primary and multiple secondary Azure Data Explorer clusters. The following image illustrates the Azure App Service setup.

:::image type="content" source="media/business-continuity-create-solution/app-service-setup.png" alt-text="Create an Azure App Service.":::

> [!TIP]
> Having multiple connections between replicas in the same service gives you increased availability. This setup isn't only useful in instances of regional outages.  

1. Use this [boilerplate code for an app service](https://github.com/Azure/azure-kusto-bcdr-boilerplate). To implement a multi-cluster client, the [AdxBcdrClient](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/master/webapp/ADX/AdxBcdrClient.cs) class has been created. Each query that is executed using this client will be sent [first to the primary cluster](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/26f8c092982cb8a3757761217627c0e94928ee07/webapp/ADX/AdxBcdrClient.cs#L69). If there's a failure, the query will be sent to secondary replicas.

1. Use [custom application insights metrics](/azure/azure-monitor/app/api-custom-events-metrics) to measure performance, and request distribution to primary and secondary clusters. 

#### Test the Azure App Service BCDR client

We ran a test using multiple Azure Data Explorer replicas. After a simulated outage of primary and secondary clusters, you can see that the app service BCDR client is behaving as intended.

:::image type="content" source="media/business-continuity-create-solution/simulation-verify-service.png" alt-text="Verify app service BCDR client.":::

The Azure Data Explorer clusters are distributed across West Europe (2xD14v2 primary), South East Asia, and East US (2xD11v2). 

:::image type="content" source="media/business-continuity-create-solution/performance-test-query-time.png" alt-text="Cross planet query response time.":::

> [!NOTE]
> Slower response times are due to different SKUs and cross planet queries.

#### Perform dynamic or static routing

Use [Azure Traffic Manager routing methods](/azure/traffic-manager/traffic-manager-routing-methods) for dynamic or static routing of the requests.  Azure Traffic Manager is a DNS-based traffic load balancer that enables you to distribute app service traffic. This traffic is optimized to services across global Azure regions, while providing high availability and responsiveness. 

You can also use [Azure Front Door based routing](/azure/frontdoor/front-door-routing-methods). For comparison of these two methods, see [Load-balancing with Azure’s application delivery suite](/azure/frontdoor/front-door-lb-with-azure-app-delivery-suite).

### Optimize cost in an active-active configuration

Using an active-active configuration for disaster recovery increases the cost linearly. The cost includes nodes, storage, markup, and increased networking cost for [bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/).

#### Use optimized autoscale to optimize costs

Use the [optimized autoscale](manage-cluster-horizontal-scaling.md#optimized-autoscale-recommended-option) feature to configure horizontal scaling for the secondary clusters. They should be dimensioned so they can handle the ingestion load. Once the primary cluster isn't reachable, the secondary clusters will get more traffic and scale according to the configuration. 

Using optimized autoscale in this example saved roughly 50% of the cost in comparison to having the same horizontal and vertical scale on all replicas.

## Next steps

Get started with the [business continuity and disaster recovery overview](business-continuity-overview.md).
