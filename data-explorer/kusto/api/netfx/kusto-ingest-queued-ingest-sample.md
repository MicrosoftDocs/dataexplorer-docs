---
title: HowTo Data Ingestion with Kusto.Ingest Library - Azure Data Explorer | Microsoft Docs
description: This article describes HowTo Data Ingestion with Kusto.Ingest Library in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/13/2019

---
# HowTo Data Ingestion with Kusto.Ingest Library
This article presents sample code that makes use of Kusto.Ingest client library.

## Overview
The following code sample demonstrates Queued (going via Kusto Data Management service) data ingestion to Kusto with the use of Kusto.Ingest library.

> This article deals with the recommended mode of ingestion for production-grade pipelines, which is also referred to as **Queued Ingestion** (in terms of the Kusto.Ingest library, the corresponding entity is the [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) interface). In this mode the client code interacts with the Kusto service by posting ingestion notification messages to an Azure queue, reference to which is obtained from the Kusto Data Management (a.k.a. Ingestion) service. Interaction with the Data Management service must be authenticated with **AAD**.

#### Authentication
This code sample uses AAD user authentication and runs under the identity of the interactive user.

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
The code presented below performs the following:
1. Creates a table on `KustoLab` shared Kusto cluster under `KustoIngestClientDemo` database
2. Provisions a [JSON column mapping object](../../management/tables.md#create-ingestion-mapping) on that table
3. Creates an [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) instance for the `Ingest-KustoLab` Data Management service
4. Sets up [KustoQueuedIngestionProperties](kusto-ingest-client-reference.md#class-kustoqueuedingestionproperties) with appropriate ingestion options
5. Creates a MemoryStream filled with some generated data to be ingested
6. Ingests the data using `KustoQueuedIngestClient.IngestFromStream` method
7. Polls for any [ingestion errors](kusto-ingest-client-status.md#tracking-ingestion-status-kustoqueuedingestclient)

```csharp
static void Main(string[] args)
{
    var clusterName = "KustoLab";
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
        var columnMappings = new List<JsonColumnMapping>();
        columnMappings.Add(new JsonColumnMapping()
            { ColumnName = "Column1", JsonPath = "$.Id" });
        columnMappings.Add(new JsonColumnMapping()
            { ColumnName = "Column2", JsonPath = "$.Timestamp" });
        columnMappings.Add(new JsonColumnMapping()
            { ColumnName = "Column3", JsonPath = "$.Message" });

        command = CslCommandGenerator.GenerateTableJsonMappingCreateCommand(
                                            table, mappingName, columnMappings);
        kustoAdminClient.ExecuteControlCommand(databaseName: db, command: command);
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
        ingestProps.JSONMappingReference = mappingName;
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
        var errors = ingestClient.GetAndDiscardTopIngestionFailures().GetAwaiter().GetResult();
        var successes = ingestClient.GetAndDiscardTopIngestionSuccesses().GetAwaiter().GetResult();

        errors.ForEach((f) => { Console.WriteLine($"Ingestion error: {f.Info.Details}"); });
        successes.ForEach((s) => { Console.WriteLine($"Ingested: {s.Info.IngestionSourcePath}"); });
    }
}
```