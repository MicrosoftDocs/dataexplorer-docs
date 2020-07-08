---
title: Use streaming ingestion to ingest data into Azure Data Explorer
description: In this article you learn how to configure your Azure Data Explorer cluster using Azure Portal and start loading data with streaming ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/30/2019
---

# Streaming ingestion

> [!div class="op_single_selector"]
> * [Portal](ingest-data-streaming.md)
> * [C#](streaming-ingestion-setup-csharp.md)

Use streaming ingestion when you require low latency with an ingestion time of less than 10 seconds for varied volume data. It's used to optimize operational processing of many tables, in one or more databases, where the stream of data into each table is relatively small (few records per second) but overall data ingestion volume is high (thousands of records per second). 

Use bulk ingestion instead of streaming ingestion when the amount of data grows to more than 4 GB per hour per table. Read [Data ingestion overview](ingest-data-overview.md) to learn more about the various methods of ingestion.

## Prerequisites
* If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.
* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [an Azure Data Explorer cluster and database](create-cluster-database-csharp.md)
    > [!NOTE]
    >You can enable streaming ingestion while creating a new Azure Data Explorer cluster.
    >```csharp
    >...
    >var cluster = new Cluster(location, sku, enableStreamingIngest:true);
    >...
    >```

## Enable streaming ingestion on your cluster

> [!WARNING]
> Please review the [limitations](#limitations) prior to enabling steaming ingestion.

Enable streaming ingestion on your Azure Data Explorer cluster using the following code:

```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
    var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
    var credential = new ClientCredential(clientId, clientSecret);
    var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

    var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

    var kustoManagementClient = new KustoManagementClient(credentials)
    {
        SubscriptionId = subscriptionId
    };

    var resourceGroupName = "testrg";
    var clusterName = "mystreamingcluster";
    var clusterUpdateParameters = new ClusterUpdate(enableStreamingIngest: true);

    await kustoManagementClient.Clusters.UpdateAsync(resourceGroupName, clusterName, clusterUpdateParameters);
```

## Create a target table and define streaming ingestion policy

To create a table and define streaming ingestion policy on it execute the following code

```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
    var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
    var databaseName = "StreamingTestDb";
    var tableName = "TestTable";
    var kcsb = new KustoConnectionStringBuilder("https://mystreamingcluster.westcentralus.kusto.windows.net", databaseName);
    kcsb = kcsb.WithAadApplicationKeyAuthentication(clientId, clientSecret, tenantId);

    var tableSchema = new TableSchema(
        tableName,
        new ColumnSchema[]
        {
            new ColumnSchema("TimeStamp", "System.DateTime"),
            new ColumnSchema("Name",      "System.String"),
            new ColumnSchema("Metric",    "System.int"),
            new ColumnSchema("Source",    "System.String"),
        });

    var tableCreateCommand = CslCommandGenerator.GenerateTableCreateCommand(tableSchema);    
    var tablePolicyAlterCommand = CslCommandGenerator.GenerateTableAlterStreamingIngestionPolicyCommand(tableName, isEnabled: true);
    using (var client = KustoClientFactory.CreateCslAdminProvider(kcsb))
    {
        client.ExecuteControlCommand(tableCreateCommand);

        client.ExecuteControlCommand(tablePolicyAlterCommand);
    }
```

## Use streaming ingestion to ingest data to your cluster

There are two supported streaming ingestion types:

* [**Event Hub**](ingest-data-event-hub.md) or [**IoT Hub**](ingest-data-iot-hub.md), which is used as a data source.
* **Custom ingestion** requires you to write an application that uses one of the Azure Data Explorer [client libraries](kusto/api/client-libraries.md). See [streaming ingestion sample](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample) for a sample application.

### Choose the appropriate streaming ingestion type

|   |Event Hub  |Custom Ingestion  |
|---------|---------|---------|
|Data delay between ingestion initiation and the data available for query   |    Longer delay     |   Shorter delay      |
|Development overhead    |   Fast and easy setup, no development overhead    |   High development overhead for application to handle errors and ensure data consistency     |

## Disable streaming ingestion on your cluster

> [!WARNING]
> Disabling streaming ingestion could take a few hours.

In order to disable streaming ingestion on your Azure Data Explorer cluster [streaming ingestion policy](kusto/management/streamingingestionpolicy.md) must be dropped from all relevant tables and databases. The streaming ingestion policy removal triggers streaming ingestion data movement from the initial storage to the permanent storage in the column store (extents or shards). The data movement can last between a few seconds to a few hours, depending on the amount of data in the initial storage, and how the CPU and memory is used by the cluster.

In order to drop streaming ingestion policy from the table execute the following code
```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
    var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
    var databaseName = "StreamingTestDb";
    var tableName = "TestTable";
    var kcsb = new KustoConnectionStringBuilder("https://mystreamingcluster.westcentralus.kusto.windows.net", databaseName);
    kcsb = kcsb.WithAadApplicationKeyAuthentication(clientId, clientSecret, tenantId);

    var tablePolicyDropCommand = CslCommandGenerator.GenerateTableStreamingIngestionPolicyDropCommand(databaseName, tableName);
    using (var client = KustoClientFactory.CreateCslAdminProvider(kcsb))
    {
        client.ExecuteControlCommand(tablePolicyDropCommand);
    }
```

## Limitations

* [Database cursors](kusto/management/databasecursor.md) aren't supported for database if the database itself or any of its tables have [streaming ingestion policy](kusto/management/streamingingestionpolicy.md) defined and enabled.
* [Data mapping](kusto/management/mappings.md) must be [pre-created](kusto/management/create-ingestion-mapping-command.md) for use in streaming ingestion. Individual streaming ingestion requests don't accommodate inline data mappings.
* Streaming ingestion performance and capacity scales with increased VM and cluster sizes. The number of concurrent ingestion requests is limited to six per core. For example, for 16 core SKUs, such as D14 and L16, the maximal supported load is 96 concurrent ingestion requests. For two core SKUs, such as D11, the maximal supported load is 12 concurrent ingestion requests.
* The data size limit for streaming ingestion request is 4 MB.
* Schema updates, such as creation and modification of tables and ingestion mappings, may take up to five minutes for the streaming ingestion service. For more information see [Streaming ingestion and schema changes](kusto/management/data-ingestion/streaming-ingestion-schema-changes.md).
* Enabling streaming ingestion on a cluster, even when data isn't ingested via streaming, uses part of the local SSD disk of the cluster machines for streaming ingestion data and reduces the storage available for hot cache.
* [Extent tags](kusto/management/extents-overview.md#extent-tagging) can't be set on the streaming ingestion data.

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)
