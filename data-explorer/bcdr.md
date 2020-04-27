---
title: Azure Data Explorer and business continuity disaster recovery
description: This article describes Azure Data Explorer capabilities for recovering from disruptive events.
author: orspod
ms.author: orspodek
ms.reviewer: herauch
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/27/2020
---

# Business continuity and disaster recovery

Business continuity and disaster recovery in Azure Data Explorer enables your business to continue operating in the face of a true disruption. There are some disruptive events that are not automatically handled by Azure Data Explorer, such as:

- User accidentally dropped a table
- An outage of an Azure zone
- An entire Azure region is no longer available because of a natural disaster

This overview describes capabilities that Azure Data Explorer provides for business continuity and disaster recovery. Learn how to recover from events that could cause data loss, or cause your database and application to become unavailable.

## Accidentally dropping a table

Users with table admin permissions or higher are allowed to [drop tables](https://docs.microsoft.com/azure/data-explorer/kusto/management/drop-table-command). If one of those users accidentally drops a table, you can recover it using the [.undo drop table](https://docs.microsoft.com/azure/data-explorer/kusto/management/undo-drop-table-command) command. For this command to be successful, you must first enable the *recoverability* property in the [retention policy](https://docs.microsoft.com/azure/data-explorer/kusto/management/retentionpolicy).

## Outage of an Azure Availability Zone

Availability zones are unique physical locations within the same Azure region.

Azure availability zones can protect an Azure Data Explorer cluster and data from partial region failure.

When you deploy new clusters to different availability zones, the underlying compute and storage components are deployed to different zones in the region. Each zone has independent power, cooling, and networking. During zonal downtime, the cluster will continue to work, but may experience performance degradation until the failure is resolved.

You can also use zonal services, which pin an Azure Data Explorer cluster to the same zone as other connected Azure resources.

> [!Note]
> Deployment to availability zones can be done only during cluster creation and cannot be modified later.

For more details on enabling availability zones on Azure Data Explorer, read - [https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal)

## Outage of an Azure Region

Azure Data Explorer does not support **automatic** protection against the outage of an **entire** Azure region. This disruption could happen during a natural disaster, like an earthquake. If you require a solution for this type of situation, you must create two or more independent clusters in two [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

Once you have created multiple clusters, do the following steps:

1. Replicate all management activities (such as creating new tables or managing user roles) on each cluster.
1. Ingest data to each cluster in parallel.

Azure Data Explorer won't perform parallel maintenance operations (such as upgrades) on clusters that are in Azure paired regions.

### Conclusion

Azure Data Explorer features a built-in high availability solution that is deeply integrated with the Azure platform. This solution uses Azure Blob storage for data protection and Availability Zones for higher availability. In addition, Azure Data Explorer offers certain capabilities to undo accidental dropping of tables. However, the mitigation of a disaster on an entire Azure region is not available as a built-in feature. <!-- Not sure this adds information -->

## Regional outage - HowTo

Azure Data Explorer currently does not support automatic protection against the outage of an entire Azure region. Outages could happen during a natural disaster, like an earthquake. If you require a solution for this situation, you must create  **two or more**  independent clusters.

This HowTo article presents an example how to create an architecture that takes business continuity into account under heavy disruptions.

### Create independent clusters

First, create more than one [cluster](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal) in more than one region.

Make sure that at least two of these clusters are created in [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions). 

:::image type="content" source="ADX-and-BDCR/1.png" alt-text="Create independent clusters":::

The above image shows three clusters in three different regions, which can also be called replicas.

### Duplicate management activities

In order to have the same cluster configuration in every replica, you must replicate the management activities.

1. Create the same databases/[tables](https://docs.microsoft.com/azure/data-explorer/kusto/management/create-table-command)/[mappings](https://docs.microsoft.com/azure/data-explorer/kusto/management/create-ingestion-mapping-command)/[policies](https://docs.microsoft.com/azure/data-explorer/kusto/management/policies) on each replica.
1. Manage the [authentication/authorization](https://docs.microsoft.com/azure/data-explorer/kusto/management/security-roles) on each replica.

:::image type="content" source="ADX-and-BDCR/2.png" alt-text="Duplicate management activities":::

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

:::image type="content" source="ADX-and-BDCR/3.png" alt-text="Ingestment via EventHub":::

> [!Note] 
> Ingestion via EventHub/IoTHub/storage is robust. If a cluster is not available for a period of time, it will later catch up and insert pending messages or blobs. This process relies on [checkpointing](https://docs.microsoft.com/azure/event-hubs/event-hubs-features#checkpointing).

### How does the disaster recovery setup work?
<!-- I think this is meant to be an explanation of what you've now set up -->

If you've completed the previous steps, your data and management are now distributed to multiple regions. If you experience an outage in one region, Azure Data Explorer will be able to catch up in the other replicas.

As shown in the diagram below, your data sources produce events to the failover-configured EventHub, and each Azure Data Explorer replica consumes the events.

Data visualization components like PowerBI, Grafana, or SDK powered WebApps can query one of the replicas.

:::image type="content" source="ADX-and-BDCR/4.png" alt-text="Data sources to data visualization":::

## Cost optimization in disaster recovery

Now you're ready to optimize your replicas for the following:

- Architecture for an active/hot standby
- How to implement a highly available application service
- How to optimize cost in an active/active architecture

### Architecture for an active/hot standby

Replicating and updating the Azure Data Explorer setup will linearly increase the cost with the number of replicas. In order to optimize cost, you can implement an architectural variant to balance time, failover, and cost.

:::image type="content" source="ADX-and-BDCR/5.png" alt-text="Architecture for an active/hot standby":::

In this example, cost optimization has been implemented by introducing passive Azure Data Explorer replicas. These replicas are only turned on in case of a disaster in the primary region (for example, region A).

Only one cluster is ingesting data from the EventHub. The primary cluster in Region A is performing a [continuous export](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-export/continuous-data-export) of all data to a storage account. The secondary replicas have access to the data using [external tables](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/externaltables).

The replicas in Regions B and C do not need to be active 24/7, reducing the cost significantly. However, the performance of these replicas will not be as good as the primary cluster for most of the cases.
<!-- clusters vs replicas- consistency not 100% -->

You can start/stop the secondary replicas using one of the following methods:

- [Flow](https://radennis.github.io/Ravit-Blog/blogs/SaveMoneyUsingFlow.html)
- The &quot;Stop&quot; button

   :::image type="content" source="ADX-and-BDCR/6.png" alt-text="The stop button":::

- Azure CLI: 

  ```kusto
  az kusto cluster stop --name=<clusterName> --resource-group=<rgName> --subscription=<subscriptionId>” ```

### How to implement a highly available application service

This section shows how to create an [Azure App Service](https://azure.microsoft.com/services/app-service/) that supports a connection to a single primary **and** multiple secondary Azure Data Explorer clusters. The following picture illustrates the setup (management activities and data ingestion have been removed for clarity).

:::image type="content" source="ADX-and-BDCR/7.png" alt-text="Create an Azure App Service":::

Having multiple connections between replicas in the same service gives you increased availability. This is useful not only in instances of regional outages.  

You can use this boilerplate code for an app service to github : [https://github.com/Azure/azure-kusto-bcdr-boilerplate](https://github.com/Azure/azure-kusto-bcdr-boilerplate). In order to implement a multi-cluster client, the [AdxBcdrClient](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/master/webapp/ADX/AdxBcdrClient.cs) class has been created. Each query that is executed using this client will be sent [first to the primary cluster](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/26f8c092982cb8a3757761217627c0e94928ee07/webapp/ADX/AdxBcdrClient.cs#L69). If there is a failure, the query will be sent to secondary replicas.

In order to measure the performance, and request distribution to primary/secondary cluster [custom application insights metrics](https://docs.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics) can be used. 

We ran a test using multiple Azure Data Explorer replicas. After a simulated outage of primary and secondary clusters, you can see that the app service BCDR client is behaving as intended.

:::image type="content" source="ADX-and-BDCR/8.png" alt-text="Verify app service BCDR client":::

The Azure Data Explorer clusters have been distributed across West Europe (2xD14v2 primary), South East Asia and East US (2xD11v2). Slower response times can be explained by different SKUs and by doing cross planet queries.

:::image type="content" source="ADX-and-BDCR/9.png" alt-text="Cross planet query response time":::

One last extension to this architecture could be the dynamic or static routing of the requests using [Azure Traffic Manager routing methods](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-routing-methods). Azure Traffic Manager is a DNS-based traffic load balancer that enables you to distribute app service traffic. This traffic is optimized to services across global Azure regions, while providing high availability and responsiveness. 
Alternatively, you can use [Azure Front Door based routing](https://docs.microsoft.com/azure/frontdoor/front-door-routing-methods). 

Compare these two methods [here](https://docs.microsoft.com/azure/frontdoor/front-door-lb-with-azure-app-delivery-suite).

### How to optimize cost in an active/active architecture

Adding replicas to an active/active architecture increases the cost linearly. The cost includes nodes, storage, markup, and increased networking cost for [bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/).

Use the [optimized autoscale](https://docs.microsoft.com/azure/data-explorer/manage-cluster-horizontal-scaling#optimized-autoscale-preview) feature to configure the horizontal scaling for the secondary clusters. They should be dimensioned to be able to handle the load of the ingest. Once the primary cluster is not reachable, the secondary clusters will get more traffic and scale according to the configuration. 

In the previous example, this saved roughly 50% of the cost compared with having the same horizontal and vertical scale on all replicas.

## Next steps
