---
title: 'Ingest data with Kusto .NET SDK'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer using .NET SDK.
ms.reviewer: vladikb
ms.topic: how-to
ms.date: 05/08/2023

# Customer intent: As a .NET SDK developer, I want to ingest data into Azure Data Explorer so that I can query data to include in my apps.
---

# Ingest data using the Kusto .NET SDK

> [!div class="op_single_selector"]
> * [.NET](net-sdk-ingest-data.md)
> * [Python](python-ingest-data.md)
> * [Node](node-ingest-data.md)
> * [Go](go-ingest-data.md)
> * [Java](java-ingest-data.md)

There are two client libraries for .NET: an [ingest library](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Ingest/) and [a data library](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data/). For more information on .NET SDK, see [about .NET SDK](./kusto/api/netfx/about-the-sdk.md).
These libraries enable you to ingest (load) data into a cluster and query data from your code. In this article, you first create a table and data mapping in a test cluster. You then queue an ingestion to the cluster and validate the results.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* A cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Install the ingest library

```azurecli
Install-Package Microsoft.Azure.Kusto.Ingest
```

## Add authentication and construct connection string

### Authentication

To authenticate an application, the SDK uses your Microsoft Entra tenant ID. To find your tenant ID, use the following URL, substituting your domain for *YourDomain*.

```http
https://login.microsoftonline.com/<YourDomain>/.well-known/openid-configuration/
```

For example, if your domain is *contoso.com*, the URL is: [https://login.microsoftonline.com/contoso.com/.well-known/openid-configuration/](https://login.microsoftonline.com/contoso.com/.well-known/openid-configuration/). Click this URL to see the results; the first line is as follows. 

```console
"authorization_endpoint":"https://login.microsoftonline.com/6babcaad-604b-40ac-a9d7-9fd97c0b779f/oauth2/authorize"
```

The tenant ID in this case is `6babcaad-604b-40ac-a9d7-9fd97c0b779f`.

This example uses an interactive Microsoft Entra user authentication to access the cluster. You can also use Microsoft Entra application authentication with certificate or application secret. Make sure to set the correct values for `tenantId` and `clusterUri` before running this code. 

The SDK provides a convenient way to set up the authentication method as part of the connection string. For complete documentation on connection strings, see [connection strings](kusto/api/connection-strings/kusto.md).

> [!NOTE]
> The current version of the SDK doesn't support interactive user authentication on .NET Core. If required, use Microsoft Entra username/password or application authentication instead.

### Construct the connection string

Now you can construct the connection string. You'll create the destination table and mapping in a later step.

```csharp
var kustoUri = "https://<ClusterName>.<Region>.kusto.windows.net/";
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri).WithAadUserPromptAuthentication(tenantId);
```

## Set source file information

Set the path for the source file. This example uses a sample file hosted on Azure Blob Storage. The **StormEvents** sample dataset contains weather-related data from the [National Centers for Environmental Information](https://www.ncei.noaa.gov/).

```csharp
var blobPath = "https://kustosamples.blob.core.windows.net/samplefiles/StormEvents.csv";
```

## Create a table on your test cluster

Create a table named `StormEvents` that matches the schema of the data in the `StormEvents.csv` file.

> [!TIP]
> The following code snippets create an instance of a client for almost every call. This is done to make each snippet individually runnable. In production, the client instances are reentrant, and should be kept as long as needed. A single client instance per URI is sufficient, even when working with multiple databases (database can be specified on a command level).

```csharp
var databaseName = "<DatabaseName>";
var tableName = "StormEvents";
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var command = CslCommandGenerator.GenerateTableCreateCommand(
        tableName,
        new[]
        {
            Tuple.Create("StartTime", "System.DateTime"),
            Tuple.Create("EndTime", "System.DateTime"),
            Tuple.Create("EpisodeId", "System.Int32"),
            Tuple.Create("EventId", "System.Int32"),
            Tuple.Create("State", "System.String"),
            Tuple.Create("EventType", "System.String"),
            Tuple.Create("InjuriesDirect", "System.Int32"),
            Tuple.Create("InjuriesIndirect", "System.Int32"),
            Tuple.Create("DeathsDirect", "System.Int32"),
            Tuple.Create("DeathsIndirect", "System.Int32"),
            Tuple.Create("DamageProperty", "System.Int32"),
            Tuple.Create("DamageCrops", "System.Int32"),
            Tuple.Create("Source", "System.String"),
            Tuple.Create("BeginLocation", "System.String"),
            Tuple.Create("EndLocation", "System.String"),
            Tuple.Create("BeginLat", "System.Double"),
            Tuple.Create("BeginLon", "System.Double"),
            Tuple.Create("EndLat", "System.Double"),
            Tuple.Create("EndLon", "System.Double"),
            Tuple.Create("EpisodeNarrative", "System.String"),
            Tuple.Create("EventNarrative", "System.String"),
            Tuple.Create("StormSummary", "System.Object"),
        }
    );
    await kustoClient.ExecuteControlCommandAsync(databaseName, command);
}
```

## Define ingestion mapping

Map the incoming CSV data to the column names used when creating the table.
Provision a [CSV column mapping object](kusto/management/create-ingestion-mapping-command.md) on that table.

```csharp
var tableMappingName = "StormEvents_CSV_Mapping";
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var command = CslCommandGenerator.GenerateTableMappingCreateCommand(
        IngestionMappingKind.Csv,
        tableName,
        tableMappingName,
        new ColumnMapping[]
        {
            new() { ColumnName = "StartTime", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "0" } } },
            new() { ColumnName = "EndTime", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "1" } } },
            new() { ColumnName = "EpisodeId", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "2" } } },
            new() { ColumnName = "EventId", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "3" } } },
            new() { ColumnName = "State", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "4" } } },
            new() { ColumnName = "EventType", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "5" } } },
            new() { ColumnName = "InjuriesDirect", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "6" } } },
            new() { ColumnName = "InjuriesIndirect", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "7" } } },
            new() { ColumnName = "DeathsDirect", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "8" } } },
            new() { ColumnName = "DeathsIndirect", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "9" } } },
            new() { ColumnName = "DamageProperty", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "10" } } },
            new() { ColumnName = "DamageCrops", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "11" } } },
            new() { ColumnName = "Source", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "12" } } },
            new() { ColumnName = "BeginLocation", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "13" } } },
            new() { ColumnName = "EndLocation", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "14" } } },
            new() { ColumnName = "BeginLat", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "15" } } },
            new() { ColumnName = "BeginLon", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "16" } } },
            new() { ColumnName = "EndLat", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "17" } } },
            new() { ColumnName = "EndLon", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "18" } } },
            new() { ColumnName = "EpisodeNarrative", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "19" } } },
            new() { ColumnName = "EventNarrative", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "20" } } },
            new() { ColumnName = "StormSummary", Properties = new Dictionary<string, string> { { MappingConsts.Ordinal, "21" } } }
        }
    );
    
    await kustoClient.ExecuteControlCommandAsync(databaseName, command);
}
```

## Define batching policy for your table

Batching incoming data optimizes data shard size, which is controlled by the [ingestion batching policy](kusto/management/batchingpolicy.md). Modify the policy with the [ingestion batching policy management command](./kusto/management/show-table-ingestion-batching-policy.md). Use this policy to reduce latency of slowly arriving data.

```csharp
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var command = CslCommandGenerator.GenerateTableAlterIngestionBatchingPolicyCommand(
        databaseName,
        tableName,
        new IngestionBatchingPolicy(
            maximumBatchingTimeSpan: TimeSpan.FromSeconds(10),
            maximumNumberOfItems: 100,
            maximumRawDataSizeMB: 1024
        )
    );
    kustoClient.ExecuteControlCommand(command);
}
```

We recommend defining a `Raw Data Size` value for ingested data and incrementally decreasing the size towards 250 MB, while checking if performance improves.

You can use the `Flush Immediately` property to skip batching, although this isn't recommended for large-scale ingestion as it can cause poor performance. 

## Queue a message for ingestion

Queue a message to pull data from blob storage and ingest the data. A connection is established to the ingestion cluster, and another client is created to work with that endpoint. 

> [!TIP]
> The following code snippets create an instance of a client for almost every call. This is done to make each snippet individually runnable. In production, the client instances are reentrant, and should be kept as long as needed. A single client instance per URI is sufficient, even when working with multiple databases (database can be specified on a command level).

```csharp
var ingestUri = "https://ingest-<clusterName>.<region>.kusto.windows.net";
var ingestConnectionStringBuilder = new KustoConnectionStringBuilder(ingestUri).WithAadUserPromptAuthentication(tenantId);
using var ingestClient = KustoIngestFactory.CreateQueuedIngestClient(ingestConnectionStringBuilder);
var properties = new KustoQueuedIngestionProperties(databaseName, tableName)
{
    Format = DataSourceFormat.csv,
    IngestionMapping = new IngestionMapping
    {
        IngestionMappingReference = tableMappingName,
        IngestionMappingKind = IngestionMappingKind.Csv
    },
    IgnoreFirstRecord = true
};
await ingestClient.IngestFromStorageAsync(blobPath, properties);
```

## Validate data was ingested into the table

Wait five to ten minutes for the queued ingestion to schedule the ingestion and load the data into your cluster. Then run the following code to get the count of records in the `StormEvents` table.

```csharp
using var cslQueryProvider = KustoClientFactory.CreateCslQueryProvider(kustoConnectionStringBuilder);
var query = $"{tableName} | count";
var results = cslQueryProvider.ExecuteQuery<long>(databaseName, query);
Console.WriteLine(results.Single());
```

## Run troubleshooting queries

Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com) and connect to your cluster. Run the following command in your database to see if there were any ingestion failures in the last four hours. Replace the database name before running.

```kusto
.show ingestion failures
| where FailedOn > ago(4h) and Database == "<DatabaseName>"
```

Run the following command to view the status of all ingestion operations in the last four hours. Replace the database name before running.

```kusto
.show operations
| where StartedOn > ago(4h) and Database == "<DatabaseName>" and Operation == "DataIngestPull"
| summarize arg_max(LastUpdatedOn, *) by OperationId
```

## Clean up resources

If you plan to follow our other articles, keep the resources you created. If not, run the following command in your database to clean up the `StormEvents` table.

```kusto
.drop table StormEvents
```

## Next steps

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
