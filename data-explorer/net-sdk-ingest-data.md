---
title: 'Ingest data with Azure Data Explorer .NET SDK'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer using .NET SDK.
author: orspod
ms.author: orspodek
ms.reviewer: vladikb
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/07/2020

# Customer intent: As a .NET SDK developer, I want to ingest data into Azure Data Explorer so that I can query data to include in my apps.
---

# Ingest data using the Azure Data Explorer .NET SDK 

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. It provides two client libraries for .NET: an [ingest library](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Ingest/) and [a data library](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data/). For more information on .NET SDK, see [about .NET SDK](/azure/data-explorer/kusto/api/netfx/about-the-sdk).
These libraries enable you to ingest (load) data into a cluster and query data from your code. In this article, you first create a table and data mapping in a test cluster. You then queue an ingestion to the cluster and validate the results.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* [A test cluster and database](create-cluster-database-portal.md)
* supported platforms .NETCoreApp 2.0, .NETFramework 4.6.2

## Install the ingest library

```
Install-Package Microsoft.Azure.Kusto.Ingest
```

## Add authentication and construct connection string

### Authentication

To authenticate an application, Azure Data Explorer SDK uses your AAD tenant ID. To find your tenant ID, use the following URL, substituting your domain for *YourDomain*.

```
https://login.windows.net/<YourDomain>/.well-known/openid-configuration/
```

For example, if your domain is *contoso.com*, the URL is: [https://login.windows.net/contoso.com/.well-known/openid-configuration/](https://login.windows.net/contoso.com/.well-known/openid-configuration/). Click this URL to see the results; the first line is as follows. 

```
"authorization_endpoint":"https://login.windows.net/6babcaad-604b-40ac-a9d7-9fd97c0b779f/oauth2/authorize"
```

The tenant ID in this case is `6babcaad-604b-40ac-a9d7-9fd97c0b779f`.

This example uses an interactive AAD user authentication to access the cluster. You can also use AAD application authentication with certificate or application secret. Make sure to set the correct values for `tenantId` and `clusterUri` before running this code. 

Azure Data Explorer SDK provides a convenient way to set up the authentication method as part of the connection string. For complete documentation on Azure Data Explorer connection strings, see [connection strings](kusto/api/connection-strings/kusto.md).

> [!NOTE]
> The current version of the SDK doesn't support interactive uer authentication on .NET Core. If required, use AAD username/password or application authentication instead.

### Construct the connection string

Now you can construct the Azure Data Explorer connection string. You will create the destination table and mapping in a later step.

```csharp
var tenantId = "<TenantId>";
var kustoUri = "https://<ClusterName>.<Region>.kusto.windows.net/";

var kustoConnectionStringBuilder = new KustoConnectionStringBuilder(kustoUri).WithAadUserPromptAuthentication(tenantId);
```

## Set source file information

Set the path for the source file. This example uses a sample file hosted on Azure Blob Storage. The **StormEvents** sample data set contains weather-related data from the [National Centers for Environmental Information](https://www.ncdc.noaa.gov/stormevents/).

```csharp
var blobPath = "https://kustosamplefiles.blob.core.windows.net/samplefiles/StormEvents.csv?st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D";
```

## Create a table on your test cluster

Create a table named `StormEvents` that matches the schema of the data in the `StormEvents.csv` file.

> [!TIP]
> The following code snippets create an instance of a client for almost every call. This is done to make each snippet individually runnable. In production, the client instances are reentrant, and should be kept as long as needed. A single client instance per URI is sufficient, even when working with multiple databases (database can be specified on a command level).

```csharp
var databaseName = "<DatabaseName>";
var table = "StormEvents";
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var command =
        CslCommandGenerator.GenerateTableCreateCommand(
            table,
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
            });

    kustoClient.ExecuteControlCommand(databaseName, command);
}
```

## Define ingestion mapping

Map the incoming CSV data to the column names used when creating the table.
Provision a [CSV column mapping object](kusto/management/create-ingestion-mapping-command.md) on that table.

```csharp
var tableMapping = "StormEvents_CSV_Mapping";
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var command =
        CslCommandGenerator.GenerateTableMappingCreateCommand(
            Data.Ingestion.IngestionMappingKind.Csv,
            table,
            tableMapping,
            new[] {
                new ColumnMapping() { ColumnName = "StartTime", Properties = new Dictionary<string, string>() { { MappingConsts.Ordinal, "0" } } },
                new ColumnMapping() { ColumnName = "EndTime", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "1" } } },
                new ColumnMapping() { ColumnName = "EpisodeId", Properties = new Dictionary<string, string>() { { MappingConsts.Ordinal, "2" } } },
                new ColumnMapping() { ColumnName = "EventId", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "3" } } },
                new ColumnMapping() { ColumnName = "State", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "4" } } },
                new ColumnMapping() { ColumnName = "EventType", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "5" } } },
                new ColumnMapping() { ColumnName = "InjuriesDirect", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "6" } } },
                new ColumnMapping() { ColumnName = "InjuriesIndirect", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "7" } } },
                new ColumnMapping() { ColumnName = "DeathsDirect", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "8" } } },
                new ColumnMapping() { ColumnName = "DeathsIndirect", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "9" } } },
                new ColumnMapping() { ColumnName = "DamageProperty", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "10" } } },
                new ColumnMapping() { ColumnName = "DamageCrops", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "11" } } },
                new ColumnMapping() { ColumnName = "Source", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "12" } } },
                new ColumnMapping() { ColumnName = "BeginLocation", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "13" } } },
                new ColumnMapping() { ColumnName = "EndLocation", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "14" } } },
                new ColumnMapping() { ColumnName = "BeginLat", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "15" } } },
                new ColumnMapping() { ColumnName = "BeginLon", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "16" } } },
                new ColumnMapping() { ColumnName = "EndLat", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "17" } } },
                new ColumnMapping() { ColumnName = "EndLon", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "18" } } },
                new ColumnMapping() { ColumnName = "EpisodeNarrative", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "19" } } },
                new ColumnMapping() { ColumnName = "EventNarrative", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "20" } } },
                new ColumnMapping() { ColumnName = "StormSummary", Properties =  new Dictionary<string, string>() { { MappingConsts.Ordinal, "21" } } }
        });

    kustoClient.ExecuteControlCommand(databaseName, command);
}
```

## Define batching policy for your table

Azure Data Explorer ingestion performs batching of the incoming data to optimize for data shard size. This process is controlled by the [ingestion batching policy](/kusto/management/batchingpolicy) and can be modified by a [control command](/kusto/management/batching-policy). Use this policy to reduce latency of slowly arriving data.

```kusto
using (var kustoClient = KustoClientFactory.CreateCslAdminProvider(kustoConnectionStringBuilder))
{
    var command =
        CslCommandGenerator.GenerateTableAlterIngestionBatchingPolicyCommand(
        databaseName,
        table,
        new IngestionBatchingPolicy(maximumBatchingTimeSpan: TimeSpan.FromSeconds(10.0), maximumNumberOfItems: 100, maximumRawDataSizeMB: 1024));

    kustoClient.ExecuteControlCommand(command);
}
```

## Queue a message for ingestion

Queue a message to pull data from blob storage and ingest that data into Azure Data Explorer. A connection is established to the data ingestion endpoint of the Azure Data Explorer cluster, and another client is created to work with that endpoint. 

> [!TIP]
> The following code snippets create an instance of a client for almost every call. This is done to make each snippet individually runnable. In production, the client instances are reentrant, and should be kept as long as needed. A single client instance per URI is sufficient, even when working with multiple databases (database can be specified on a command level).

```csharp
var ingestUri = "https://ingest-<ClusterName>.<Region>.kusto.windows.net";
var ingestConnectionStringBuilder = new KustoConnectionStringBuilder(ingestUri).WithAadUserPromptAuthentication(tenantId);

using (var ingestClient = KustoIngestFactory.CreateQueuedIngestClient(ingestConnectionStringBuilder))
{
    var properties =
        new KustoQueuedIngestionProperties(database, table)
        {
            Format = DataSourceFormat.csv,
            IngestionMapping = new IngestionMapping()
            { 
                IngestionMappingReference = tableMapping,
                IngestionMappingKind = IngestionMappingKind.Csv
            },
            IgnoreFirstRecord = true
        };

    ingestClient.IngestFromStorageAsync(blobPath, ingestionProperties: properties);
}
```

## Validate data was ingested into the table

Wait five to ten minutes for the queued ingestion to schedule the ingestion and load the data into Azure Data Explorer. Then run the following code to get the count of records in the `StormEvents` table.

```csharp
using (var cslQueryProvider = KustoClientFactory.CreateCslQueryProvider(kustoConnectionStringBuilder))
{
    var query = $"{table} | count";

    var results = cslQueryProvider.ExecuteQuery<long>(databaseName, query);
    Console.WriteLine(results.Single());
}
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

* [Write queries](write-queries.md)
