---
title: Azure Data Explorer and business continuity disaster recovery - HowTo
description: This article describes how to recover from disruptive events.
author: orspod
ms.author: orspodek
ms.reviewer: herauch
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/28/2020
---

# Business continuity and disaster recovery- HowTo

This HowTo article presents an example how to create several different architectures that take business continuity into account under heavy disruptions. You'll also choose the specific architecture that best balances your needs. For a more in-depth look at architecture considerations and recovery solutions, see the business continuity [overview](bcdr-overview.md).

## Regional outage

Azure Data Explorer does not support **automatic** protection against the outage of an **entire** Azure region. This disruption could happen during a natural disaster, like an earthquake. If you require a solution for this type of situation, you must create two or more independent clusters in two [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

Once you have created multiple clusters, do the following steps:

1. Replicate all management activities (such as creating new tables or managing user roles) on each cluster.
1. Ingest data to each cluster in parallel.

### Create independent clusters

First, create more than one [cluster](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal) in more than one region.

Make sure that at least two of these clusters are created in [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions). 

:::image type="content" source="media/bcdr/independent-clusters.png" alt-text="Create independent clusters":::

The above image shows three clusters in three different regions, which can also be called replicas.

### Duplicate management activities

Replicate the management activities in order to have the same cluster configuration in every replica.

1. Create the same databases/[tables](https://docs.microsoft.com/azure/data-explorer/kusto/management/create-table-command)/[mappings](https://docs.microsoft.com/azure/data-explorer/kusto/management/create-ingestion-mapping-command)/[policies](https://docs.microsoft.com/azure/data-explorer/kusto/management/policies) on each replica.
1. Manage the [authentication/authorization](https://docs.microsoft.com/azure/data-explorer/kusto/management/security-roles) on each replica.

:::image type="content" source="media/bcdr/regional-duplicate-management.png" alt-text="Duplicate management activities":::

There are several ways to manage your databases. You could use the [portal to create a new database](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal#create-a-database) or even one of our [SDKs](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/kusto/Microsoft.Azure.Management.Kusto).

### Align data ingestion

In addition to management activities, you need to configure data ingestion consistently on every cluster.

Hardening ingestion methods leveraging using advanced business continuity options:
<!-- I have no idea what that means -->

|Ingestion method  |Disaster recovery feature  |
|---------|---------|
|[IotHub](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr#cross-region-dr)  |[Microsoft-initiated failover and manual failover](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr#cross-region-dr) |
|[EventHub](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventhub) | Metadata disaster recovery using [primary and secondary disaster recovery namespaces](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr)     |
|[Ingest from storage using Event Grid subscription](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventgrid)  |  Implement a [geo-disaster recovery](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr) for the blob-created messages that are sent to EventHub and the [disaster recovery and account failover strategy](https://docs.microsoft.com/azure/storage/common/storage-disaster-recovery-guidance)       |

#### Example

The following example uses ingestion via EventHub. A [failover flow](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr#setup-and-failover-flow) has been set up, and Azure Data Explorer ingests <!-- data? --> from the Alias. 

Make sure to [ingest from the EventHub](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventhub) using a unique consumer group per cluster replica. Otherwise, you'll end up distributing the traffic instead of replicating it.

:::image type="content" source="media/bcdr/eventhub-management-scheme.png" alt-text="Ingestment via EventHub":::

> [!Note] 
> Ingestion via EventHub/IoTHub/storage is robust. If a cluster is not available for a period of time, it will later catch up and insert pending messages or blobs. This process relies on [checkpointing](https://docs.microsoft.com/azure/event-hubs/event-hubs-features#checkpointing).

### How does the disaster recovery setup work?
<!-- I think this is meant to be an explanation of what you've now set up -->

Once you've completed the previous steps, your data and management are distributed to multiple regions. If there is an outage in one region, Azure Data Explorer will be able to catch up in the other replicas.

As shown in the diagram below, your data sources produce events to the failover-configured EventHub, and each Azure Data Explorer replica consumes the events.

Data visualization components like PowerBI, Grafana, or SDK powered WebApps can query one of the replicas.

:::image type="content" source="media/bcdr/data-sources-visualization.png" alt-text="Data sources to data visualization":::

## Cost optimization in disaster recovery

Now you're ready to optimize your replicas using the following examples:

* Architecture for an active/hot standby
* How to implement a highly available application service
* How to optimize cost in an active/active architecture

### Architecture for an active/hot standby

Replicating and updating the Azure Data Explorer setup will linearly increase the cost with the number of replicas. In order to optimize cost, you can implement an architectural variant to balance time, failover, and cost.

:::image type="content" source="media/bcdr/active-hot-standby-scheme.png" alt-text="Architecture for an active/hot standby":::

In this example, cost optimization has been implemented by introducing passive Azure Data Explorer replicas. These replicas are only turned on in case of a disaster in the primary region (for example, region A).

Only one cluster is ingesting data from the EventHub. The primary cluster in Region A is performing a [continuous export](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-export/continuous-data-export) of all data to a storage account. The secondary replicas have access to the data using [external tables](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/externaltables).

The replicas in Regions B and C do not need to be active 24/7, reducing the cost significantly. However, the performance of these replicas will not be as good as the primary cluster for most of the cases.
<!-- clusters vs replicas- consistency not 100% -->

You can start/stop the secondary replicas using one of the following methods:

* [Flow](https://radennis.github.io/Ravit-Blog/blogs/SaveMoneyUsingFlow.html)
* The &quot;Stop&quot; button

   :::image type="content" source="media/bcdr/stop-button.png" alt-text="The stop button":::

* Azure CLI: 

  ```kusto
  az kusto cluster stop --name=<clusterName> --resource-group=<rgName> --subscription=<subscriptionId>” ```

### How to implement a highly available application service

This section shows how to create an [Azure App Service](https://azure.microsoft.com/services/app-service/) that supports a connection to a single primary **and** multiple secondary Azure Data Explorer clusters. The following picture illustrates the setup (management activities and data ingestion have been removed for clarity).

:::image type="content" source="media/bcdr/app-service-setup.png" alt-text="Create an Azure App Service":::

Having multiple connections between replicas in the same service gives you increased availability. This setup is useful not only in instances of regional outages.  

You can use this boilerplate code for an app service to github : [https://github.com/Azure/azure-kusto-bcdr-boilerplate](https://github.com/Azure/azure-kusto-bcdr-boilerplate). In order to implement a multi-cluster client, the [AdxBcdrClient](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/master/webapp/ADX/AdxBcdrClient.cs) class has been created. Each query that is executed using this client will be sent [first to the primary cluster](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/26f8c092982cb8a3757761217627c0e94928ee07/webapp/ADX/AdxBcdrClient.cs#L69). If there is a failure, the query will be sent to secondary replicas.

In order to measure the performance, and request distribution to primary/secondary cluster [custom application insights metrics](https://docs.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics) can be used. 

We ran a test using multiple Azure Data Explorer replicas. After a simulated outage of primary and secondary clusters, you can see that the app service BCDR client is behaving as intended.

:::image type="content" source="media/bcdr/simulation-verify-service.png" alt-text="Verify app service BCDR client":::

The Azure Data Explorer clusters have been distributed across West Europe (2xD14v2 primary), South East Asia, and East US (2xD11v2). Slower response times can be explained by different SKUs and by doing cross planet queries.

:::image type="content" source="media/bcdr/performance-test-query-time.png" alt-text="Cross planet query response time":::

One last extension to this architecture could be the dynamic or static routing of the requests using [Azure Traffic Manager routing methods](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-routing-methods). Azure Traffic Manager is a DNS-based traffic load balancer that enables you to distribute app service traffic. This traffic is optimized to services across global Azure regions, while providing high availability and responsiveness. 

You can also use [Azure Front Door based routing](https://docs.microsoft.com/azure/frontdoor/front-door-routing-methods). 

Compare these two methods [here](https://docs.microsoft.com/azure/frontdoor/front-door-lb-with-azure-app-delivery-suite).

### How to optimize cost in an active/active architecture

Adding replicas to an active/active architecture increases the cost linearly. The cost includes nodes, storage, markup, and increased networking cost for [bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/).

Use the [optimized autoscale](https://docs.microsoft.com/azure/data-explorer/manage-cluster-horizontal-scaling#optimized-autoscale-preview) feature to configure the horizontal scaling for the secondary clusters. They should be dimensioned to be able to handle the load of the ingest. Once the primary cluster is not reachable, the secondary clusters will get more traffic and scale according to the configuration. 

This example saved roughly 50% of the cost in comparison to having the same horizontal and vertical scale on all replicas.

## Next steps

