---
title: Cluster Management -  Kusto Clusters - Azure Kusto | Microsoft Docs
description: This article describes Cluster Management -  Kusto Clusters in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Cluster Management: Kusto Clusters

## create cluster

```kusto
.create cluster [ClusterName] [ifNotExists] with(
    Location='<Azure Geo-Location>',
    Pipeline='<Geneva | LogAnalytics | Aria | Independent>',
    AccountName='<Account Name>',
    PcCode='<The Azure PC-Code>',
    [EngineVmSize='<Engine service virtual machine size>',]
    [DmVmSize='<Data Management service virtual machine size>',]
    [EngineInstancesCount='<Engine service number of instances>',]
    [DmInstancesCount='<Data Management service number of instances>',]
    [LogAnalyticsId='<LogAnalytics ID>',]
    [GenevaEnvironment='<Geneva Environment Name>',]
    [SourceStorageAccountSettings='<JSON representation of source storage accounts settings>',]
    [AddRequestorAsClusterAdmin='<true | false>',]
    [Environment='<Production | Development | Lab>',]
    [NumberOfDatabaseStorageAccounts='<Number of default database storage accounts>',]
    [BlobStorageAccountAmount='<Number of intermediate blob storage accounts the Data Management service should use>',]
    [QueueStorageAccountAmount='<Number of intermediate queue storage accounts the Data Management service should use>']
)
```

Requires [AccountAdmin permissions](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

Creates a new cluster of engine and data management services according to the provided parameters:
* ClusterName: The name of the engine service (alphanumeric characters, 3-22 characters long). The name of the data management service is a concatenation of the prefix "ingest-" and the cluster name provided. 
* Location: The Azure geo-location in which the service and its resources should be created (see https://azure.microsoft.com/en-us/regions/).
* Pipeline: The name of the Pipeline the service is related to (Geneva | Vortex | LogAnalytics | Independent | Aria | ApplicationInsights).
* AccountName: The name of the Kusto Account to which the service belongs to.
* PcCode: The Azure PC-code used for cross-charging.
* [optional] ifNotExists: if specified, then attempting to create a cluster when there's already an existing cluster with the same name becomes a void operation that succeeds. Otherwise a failure is returned in such cases.
* [optional] EngineVmSize: The virtual machine size to use for the Engine service's instances.
* [optional] DmVmSize: The virtual machine size to use for the Data Management service's instances.
    * See: https://azure.microsoft.com/en-us/documentation/articles/cloud-services-sizes-specs/).
* [optional] EngineInstancesCount: The number of instances for the Engine service.
* [optional] DmInstancesCount: The number of instances for the Data Management service.
* [required, in case of Geneva pipeline] LogAnalyticsId: The Geneva LogAnalytics ID.
* [required, in case of Geneva pipeline] GenevaEnvironment: The Geneva environment name. Supported values are: Smoke, Test, Stage, DiagnosticsProd, RunnersProd, 
BillingProd, FirstPartyProd, ExternalProd, CaFairFax, CaMooncake, WpsTest, WpsProd.
* [required, in case of Aria pipeline] SourceStorageAccountSettings: Collection of source storage account settings (in JSON format) used by data management service.
  * Every setting consists of connection string and queue name.
* [optional] AddRequestorAsClusterAdmin: Whether or not to add the requestor as cluster admin. Defaults to 'false'.
* [optional] Environment: The level of environment in which the service belongs to (Production | Development | Lab). Defaults to Production.
* [optional] NumberOfDatabaseStorageAccounts: The number of database storage accounts to be used by the engine service. Defaults to 1.
* [optional] BlobStorageAccountAmount: The number of intermediate storage accounts to be used by the data management service for blob storage during ingestion operations. Default to 2.
* [optional, in case of Geneva pipeline] QueueStorageAccountAmount: The number of intermediate storage accounts to be used by the data management service for queue storage during ingestion operations. Defaults to 2.

**Examples**

* Create a cluster that ingests data from Geneva:
```kusto
.create cluster CoolService with(
    PcCode='P123456',
    Location='West US',
    AccountName='Office',
    Pipeline='Geneva',
    LogAnalyticsId='myId',
    GenevaEnvironment='DiagnosticsProd'
)   
```

* Create a cluster with native ingestion:
```kusto
.create cluster CoolService with(
    Location='West US',
    AccountName='Series Insights',
    Pipeline='Independent',
    PcCode='P123456'
)   
```

**Return output**

|OperationId 
|--
|3827def6-0773-4f2a-859e-c02cf395deaf

Running the command is done asynchronously - the result is an operation ID (GUID), which one can run .show operations <operation ID> with, to view the command's status.

.show operations 3827def6-0773-4f2a-859e-c02cf395deaf

|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|3827def6-0773-4f2a-859e-c02cf395deaf |ClusterCreate | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |InProgress |Started deployment of service: 'Engine-CoolService'