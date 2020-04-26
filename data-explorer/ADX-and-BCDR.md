---
title: Azure Data Explorer and business continuity disaster recovery
description: This article describes Azure Data Explorer capabilities for recovering from disruptive events.
services: XXX
author: orspod
ms.author: XXX
ms.service: data-explorer
ms.topic: XXX
ms.date: 04/26/2020
---

# Overview

Business continuity and disaster recovery in Azure Data Explorer refers to the mechanisms and procedures that enable your business to continue operating in the face of a true disruption. There are some disruptive events that cannot be handled by Azure Data Explorer automatically such as:

- User accidentally dropped a table
- An outage of an Azure zone
- An entire Azure region is no longer available due to a natural disaster

This overview describes the capabilities that Azure Data Explorer provides for business continuity and disaster recovery. Learn about options, recommendations, and tutorials for recovering from disruptive events that could cause data loss or cause your database and application to become unavailable.

## Accidentally dropping a table

Users with table admin permissions or higher are allowed to [drop tables](https://docs.microsoft.com/azure/data-explorer/kusto/management/drop-table-command). If one of those users accidentally drops the table, you can recover it using the [.undo drop table](https://docs.microsoft.com/azure/data-explorer/kusto/management/undo-drop-table-command) command. For this to be successful, you must first enable the *recoverability* property in the [retention policy](https://docs.microsoft.com/azure/data-explorer/kusto/management/retentionpolicy) (data will be recoverable 14 days after its deletion).

## Outage of an Azure Availability Zone

Availability zones are unique physical locations within the same Azure region.

Azure availability zones can protect an Azure Data Explorer cluster and data from partial region failure.

Deploying a new cluster to different availability zones means the underlying compute and storage components are deployed to different zones in the region, each with independent power, cooling and networking. In a case of zonal downtime, the cluster will continue to work, but may experience performance degradation until the failure is resolved.

In addition, you can use zonal services, which pin an Azure Data Explorer cluster to the same zone as its connected Azure resources.

> [!Note]
> Deployment to various or specific availability zones can be done only during cluster creation and cannot be modified later.

For more details on enabling availability zones on Azure Data Explorer please read - [https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal)

## Outage of an Azure Region

Azure Data Explorer currently does not support automatic protection against the outage of an **entire** Azure region. This could happen during a natural disaster like an earthquake. If you require a solution for this situation you must create  **two or more**  independent clusters, and make sure that the clusters are created in  **two**  [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

Once you have created multiple clusters, do the following steps:

1. Replicate all management activities (such as creating new tables or managing user roles) on each cluster.
1. Ingest data to each cluster in parallel.

Azure Data Explorer will make sure that maintenance operations (such as upgrades) are never conducted in parallel on the clusters which are in Azure paired regions.

### Conclusion

Azure Data Explorer features a built-in high availability solution, that is deeply integrated with the Azure platform. It is dependent on Azure Blob storage for data protection and on Availability Zones for higher availability. In addition, ADX leverages certain capabilities to undo accidental dropping of tables. However, the mitigation of a disaster on an entire Azure region is not available as a built-in feature. <!-- Not sure this adds information -->

## Regional outage - HowTo

Azure Data Explorer currently does not support automatic protection against the outage of an entire Azure region. This could happen during a natural disaster, like an earthquake. If you require a solution for this situation you must create  **two or more**  independent clusters.

This HowTo article presents an example how an create an architecture that takes business continuity into account under those heavy conditions.

### Create independent clusters

First, create more than one [cluster](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal) in more than one region in order to protect against regional outages.

 Make sure that at least two of these clusters are created in [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions). 

:::image type="content" source="ADX-and-BDCR/1.png" alt-text="Create independent clusters":::

The above image shows three clusters in three different regions, which can also be called replicas.

### Duplicate management activities

In order to have the same cluster configuration in every replica, you must replicate the management activities.

1. Create the same databases/[tables](https://docs.microsoft.com/azure/data-explorer/kusto/management/create-table-command)/[mappings](https://docs.microsoft.com/azure/data-explorer/kusto/management/create-ingestion-mapping-command)/[policies](https://docs.microsoft.com/azure/data-explorer/kusto/management/policies) on each replica
1. Manage the [authentication / authorization](https://docs.microsoft.com/azure/data-explorer/kusto/management/security-roles) on each replica

:::image type="content" source="ADX-and-BDCR/2.png" alt-text="Duplicate management activities":::

There are several ways to manage an ADX. You could use the [portal to create a new database](https://docs.microsoft.com/azure/data-explorer/create-cluster-database-portal#create-a-database) or even one of our [SDKs](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/kusto/Microsoft.Azure.Management.Kusto).

### Setup data ingest

In addition to management activities, you need to make sure that you configure data ingestion consistently on every cluster.

Hardening ingestion methods leveraging using advanced business continuity options:
<!-- I have no idea what that means -->

- Ingest from [IotHub](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr#cross-region-dr) - The recovery options available to customers in such a situation are [Microsoft-initiated failover and manual failover](https://docs.microsoft.com/azure/iot-hub/iot-hub-ha-dr#cross-region-dr).
- Ingest from [EventHub](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventhub) - The disaster recovery feature implements metadata disaster recovery and relies on [primary and secondary disaster recovery namespaces](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr).
- [Ingest from storage using Event Grid subscription](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventgrid): The ingestion from storage works using Event Grid to create messages and send them to an EventHub. [Similar measures must be implemented](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr) for the blob-created messages which are sent to EventHub. The storage itself can be hardened by implementing the appropriate [disaster recovery and account failover strategy](https://docs.microsoft.com/azure/storage/common/storage-disaster-recovery-guidance).

In the following example you are using an ingestion via EventHub. A [failover flow](https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr#setup-and-failover-flow) has been setup and Azure Data Explorer consumes from the Alias. You need to make sure to [consume from the EventHub](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-ingestion/eventhub) using a unique consumer group per ADX replica. Otherwise you would distribute the traffic instead of replicating it.

:::image type="content" source="ADX-and-BDCR/3.png" alt-text="Ingestment via EventHub":::

The ingestion via EventHub/IoTHub/storage is very robust. In case a cluster is not available for some time it will catch up on the to be inserted messages or blobs. The underlying technology makes use of [checkpointing](https://docs.microsoft.com/azure/event-hubs/event-hubs-features#checkpointing).

### What you get until now

With the current state of the business continuity hardening you distributed your data and management to multiple regions and in case of a temporal outage the underlying technology of Azure Data Explorer will be able to catch up in the individual replicas.

As shown in the diagram your data sources are producing events to the failover configured EventHub and all Azure Data Explorer replicas are consuming from it.

:::image type="content" source="ADX-and-BDCR/4.png" alt-text="Data sources to data visualization":::

On the other side the data visualization components like PowerBI, Grafana or SDK powered WebApps are querying one of the replicas.

The remaining part of this article sheds a light on the following optimizations

- Architecture for an active / hot standby
- How to implement a highly available application service
- How to optimize cost in an active / active architecture

### Architecture for an active / hot standby

Having the exact Azure Data Explorer setup on all replicas including a 24/7 uptime on all of them is linearly increasing the cost by number of replicas. In order to optimize the cost this section explains a variant of the architecture shown which makes a compromise between time to failover and cost.

:::image type="content" source="ADX-and-BDCR/5.png" alt-text="Architecture for an active/hot standby":::

The cost optimization has been implemented by introducing passive Azure Data Explorer instances which are only turned on in case of a disaster in the primary region (i.e. region A). Some examples on how to start / stop Azure Data Explorer cluster:

- [Flow](https://radennis.github.io/Ravit-Blog/blogs/SaveMoneyUsingFlow.html)
- The &quot;Stop&quot; button

   :::image type="content" source="ADX-and-BDCR/6.png" alt-text="The stop button":::

- Azure CLI: 

  ```kusto
  az kusto cluster stop --name=<clusterName> --resource-group=<rgName> --subscription=<subscriptionId>” ```

As you can see in the drawing only one cluster is consuming from the EventHub. The primary cluster in Region A is performing a [continuous export](https://docs.microsoft.com/azure/data-explorer/kusto/management/data-export/continuous-data-export) of all data to a storage account. The secondary replicas are getting access to the data using [external tables](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/externaltables).

Now the secondary clusters in Region B and C do not need to be turned on 24/7 which reduces the cost significantly. The drawback of this solution is that the performance on the secondary clusters will not be as good as in the primary cluster for most of the cases.

### How to implement a highly available application service

This section should demonstrate how to create an [Azure App Service](https://azure.microsoft.com/services/app-service/) which supports a connection to a single primary and multiple secondary Azure Data Explorer cluster. The following picture is illustrating the setup (intentionally removed the management activities and the data ingest).

:::image type="content" source="ADX-and-BDCR/7.png" alt-text="Create an Azure App SErvice":::

Having multiple connections to replicas in the same app service increases the availability of the overall solution (not only regional outages can cause an interruption of the service). Recently we pushed some boilerplate code for an app service to github : [https://github.com/Azure/azure-kusto-bcdr-boilerplate](https://github.com/Azure/azure-kusto-bcdr-boilerplate). In order to implement a multi-ADX client the [AdxBcdrClient](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/master/webapp/ADX/AdxBcdrClient.cs) class has been created. Each query that is executed using this client will be send [first to the primary ADX](https://github.com/Azure/azure-kusto-bcdr-boilerplate/blob/26f8c092982cb8a3757761217627c0e94928ee07/webapp/ADX/AdxBcdrClient.cs#L69) and in case it fails to the secondaries.

In order to measure the performance and request distribution to primary/secondary cluster [custom application insights metrics](https://docs.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics) have been used. Some of the results which have been captured during the test:

The following picture shows that during the test multiple Azure Data Explorer cluster have been used. The reason for this is a simulated outage of primary and secondary clusters to verify that the app service BCDR client is behaving as intended.

:::image type="content" source="ADX-and-BDCR/8.png" alt-text="Verify app service BCDR client":::

The Azure Data Explorer cluster have been distributed across West Europe (2xD14v2 primary), South East Asia and East US (2xD11v2). The slower response time can be explained by the different SKUs and by doing cross planet queries.

:::image type="content" source="ADX-and-BDCR/9.png" alt-text="Cross planet query response time":::

One last extension to this architecure could be the dynamic or static routing of the requests using [Azure Traffic Manager routing methods](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-routing-methods). Azure Traffic Manager is a DNS-based traffic load balancer that enables you to distribute the app service traffic optimally to services across global Azure regions, while providing high availability and responsiveness. Alternatively one could use [Azure Front Door based routing](https://docs.microsoft.com/azure/frontdoor/front-door-routing-methods) as well. An excellent comparison between both can be found [here](https://docs.microsoft.com/azure/frontdoor/front-door-lb-with-azure-app-delivery-suite).

### How to optimize cost in an active / active architecture

Adding replicas to an active / active architecture increases the cost linearly. Besides the cost for compute-nodes, storage and markup one needs to take increased networking cost for [bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/) into consideration.

Using the [optimized autoscale](https://docs.microsoft.com/azure/data-explorer/manage-cluster-horizontal-scaling#optimized-autoscale-preview) feature one can configure that the horizontal scaling for the secondary clusters. They should be dimensioned to be able to handle the load of the ingest. Once the primary cluster is not reachable, they will get more traffic and scale out according to the configuration. In my previous example this saved roughly 50% of the cost compared to having the same horizontal and vertical scale on all replicas.

### Conclusion

Even if Azure Data Explorer is not offering an out-of-the-box business continuity and disaster recovery solution this article outlined different strategies to mitigate the risk. Depending on the investment the user is able to minimize the impact of a regional outage.
