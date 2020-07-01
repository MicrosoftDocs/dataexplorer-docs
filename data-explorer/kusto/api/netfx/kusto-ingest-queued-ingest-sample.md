---
title: Data ingestion with Kusto.Ingest library - Azure Data Explorer
description: This article describes data ingestion with Azure Data Explorer's Kusto.Ingest library.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/05/2020
---
# Data ingestion with the Kusto.Ingest library

This article presents sample code that uses the Kusto.Ingest client library for data ingestion. 
The code details the recommended mode of ingestion for production-grade pipelines, known as queued ingestion. 
For the Kusto.Ingest library, the corresponding entity is the [IKustoQueuedIngestClient interface](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient).
The client code interacts with the Azure Data Explorer service by posting ingestion notifications to an Azure queue. 
Reference to the queue is obtained from the Data Management entity responsible for ingestion. 

> [!NOTE]
> Interaction with the Data Management service must be authenticated using Azure Active Directory (Azure AD).

The sample code uses Azure AD user authentication, and runs under the identity of the interactive user.

## Dependencies

This sample code requires the following NuGet packages:
* Microsoft.Kusto.Ingest
* Microsoft.IdentityModel.Clients.ActiveDirectory
* WindowsAzure.Storage
* Newtonsoft.Json

## Namespaces used

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using Kusto.Data;
using Kusto.Data.Common;
using Kusto.Data.Net.Client;
using Kusto.Ingest;
```

## Code

The code does the following.
1. Creates a table on the `KustoLab` shared Azure Data Explorer cluster under the `KustoIngestClientDemo` database
2. Provisions a [JSON column mapping object](../../management/create-ingestion-mapping-command.md) on that table
3. Creates an [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) instance for the `Ingest-KustoLab` Data Management service
4. Sets up [KustoQueuedIngestionProperties](kusto-ingest-client-reference.md#class-kustoqueuedingestionproperties) with appropriate ingestion options
5. Creates a MemoryStream filled with some generated data to be ingested
6. Ingests the data using the `KustoQueuedIngestClient.IngestFromStream` method
7. Polls for any [ingestion errors](kusto-ingest-client-status.md#tracking-ingestion-status-kustoqueuedingestclient)

```csharp
static void Main(string[] args)
{
    var db = "KustoIngestClientDemo";
    var table = "Table1";
    var mappingName = "Table1_mapping_1";
    var serviceNameAndRegion = "clusterNameAndRegion"; // For example, "mycluster.westus"
    var authority = "AAD Tenant or name"; // For example, "microsoft.com"

    // Set up table
    var kcsbEngine =
        new KustoConnectionStringBuilder($"https://{serviceNameAndRegion}.kusto.windows.net").WithAadUserPromptAuthentication(authority: $"{authority}");

    using (var kustoAdminClient = KustoClientFactory.CreateCslAdminProvider(kcsbEngine))
    {
        var columns = new List<Tuple<string, string>>()
        {
            new Tuple<string, string>("Column1", "System.Int64"),
            new Tuple<string, string>("Column2", "System.DateTime"),
            new Tuple<string, string>("Column3", "System.String"),
        };

        var command = CslCommandGenerator.GenerateTableCreateCommand(table, columns);
        kustoAdminClient.ExecuteControlCommand(databaseName: db, command: command);

        // Set up mapping
        var columnMappings = new List<ColumnMapping>();
            columnMappings.Add(new ColumnMapping()
            {
                ColumnName = "Column1",
                Properties = new Dictionary<string, string>() {
                    { Data.Common.MappingConsts.Path, "$.Id" },
            } });
            columnMappings.Add(new ColumnMapping()
            {
                ColumnName = "Column2",
                Properties = new Dictionary<string, string>() {
                    { Data.Common.MappingConsts.Path, "$.Timestamp" },
            }
            });
            columnMappings.Add(new ColumnMapping()
            {
                ColumnName = "Column3",
                Properties = new Dictionary<string, string>() {
                    { Data.Common.MappingConsts.Path, "$.Message" },
            }
            });
            var secondCommand = CslCommandGenerator.GenerateTableMappingCreateCommand(
                Data.Ingestion.IngestionMappingKind.Json, table, mappingName, columnMappings);
        kustoAdminClient.ExecuteControlCommand(databaseName: db, command: secondCommand);
    }

    // Create Ingest Client
    var kcsbDM =
        new KustoConnectionStringBuilder($"https://ingest-{serviceNameAndRegion}.kusto.windows.net").WithAadUserPromptAuthentication(authority: $"{authority}");

    using (var ingestClient = KustoIngestFactory.CreateQueuedIngestClient(kcsbDM))
    {
        var ingestProps = new KustoQueuedIngestionProperties(db, table);
        // For the sake of getting both failure and success notifications we set this to IngestionReportLevel.FailuresAndSuccesses
        // Usually the recommended level is IngestionReportLevel.FailuresOnly
        ingestProps.ReportLevel = IngestionReportLevel.FailuresAndSuccesses;
        ingestProps.ReportMethod = IngestionReportMethod.Queue;
        ingestProps.IngestionMapping = new IngestionMapping()
        { 
            IngestionMappingReference = mappingName
        };
        ingestProps.Format = DataSourceFormat.json;

        // Prepare data for ingestion
        using (var memStream = new MemoryStream())
        using (var writer = new StreamWriter(memStream))
        {
            for (int counter = 1; counter <= 10; ++counter)
            {
                writer.WriteLine(
                    "{{ \"Id\":\"{0}\", \"Timestamp\":\"{1}\", \"Message\":\"{2}\" }}",
                    counter, DateTime.UtcNow.AddSeconds(100 * counter),
                    $"This is a dummy message number {counter}");
            }

            writer.Flush();
            memStream.Seek(0, SeekOrigin.Begin);

            // Post ingestion message
            ingestClient.IngestFromStream(memStream, ingestProps, leaveOpen: true);
        }

        // Wait and retrieve all notifications
        //  - Actual duration should be decided based on the effective Ingestion Batching Policy set on the table/database
        Thread.Sleep(<timespan>);
        var errors = ingestClient.GetAndDiscardTopIngestionFailuresAsync().GetAwaiter().GetResult();
        var successes = ingestClient.GetAndDiscardTopIngestionSuccessesAsync().GetAwaiter().GetResult();

        errors.ForEach((f) => { Console.WriteLine($"Ingestion error: {f.Info.Details}"); });
        successes.ForEach((s) => { Console.WriteLine($"Ingested: {s.Info.IngestionSourcePath}"); });
    }
}
```
