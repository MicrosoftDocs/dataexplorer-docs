---
title:  Kusto.Ingest code examples
description: This article describes Kusto.Ingest ingestion code examples in Azure Data Explorer.
ms.reviewer: ohbitton
ms.topic: reference
ms.date: 05/08/2023
---
# Kusto.Ingest ingestion code examples

This collection of short code snippets demonstrates various techniques of ingesting data into a Kusto table.

> [!NOTE]
> These examples look as if the ingest client is destroyed immediately following the ingestion. Do not take this literally.
> Ingest clients are reentrant and thread-safe, and should not be created in large numbers. The recommended cardinality of ingest client instances is one per hosting process, per target Kusto cluster.

## Async ingestion from a single Azure blob

Use KustoQueuedIngestClient, with optional RetryPolicy, for async ingestion from a single Azure blob.

```csharp
var ingestUri = "https://ingest-<clusterName>.<region>.kusto.windows.net";
var appId = "<appId>";
var appKey = "<appKey>";
var appTenant = "<appTenant>";
//Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderDM = new KustoConnectionStringBuilder(ingestUri)
    .WithAadApplicationKeyAuthentication(
        applicationClientId: appId,
        applicationKey: appKey,
        authority: appTenant
    );
// Create an ingest client
// Note, that creating a separate instance per ingestion operation is an anti-pattern.
// IngestClient classes are thread-safe and intended for reuse
using var client = KustoIngestFactory.CreateQueuedIngestClient(
    kustoConnectionStringBuilderDM,
    // Create your custom retry policy, which will affect how the ingest client handles retrying on transient failures
    new QueueOptions { MaxRetries = 0 }
);
var blobUriWithSasKey = "<blobUriWithSasKey>";
// Ingest from blobs according to the required properties
var kustoIngestionProperties = new KustoIngestionProperties("<databaseName>", "<tableName>");
var sourceOptions = new StorageSourceOptions { DeleteSourceOnSuccess = true };
await client.IngestFromStorageAsync(blobUriWithSasKey, kustoIngestionProperties, sourceOptions);
```

## Ingest from local file

Use KustoDirectIngestClient to ingest from a local file.

> [!NOTE]
> We recommend this method for limited volume and low frequency ingestion.

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
var appId = "<appId>";
var appKey = "<appKey>";
var appTenant = "<appTenant>";
// Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderEngine = new KustoConnectionStringBuilder(kustoUri)
    .WithAadApplicationKeyAuthentication(
        applicationClientId: appId,
        applicationKey: appKey,
        authority: appTenant
    );
// Create a disposable client that will execute the ingestion
using var client = KustoIngestFactory.CreateDirectIngestClient(kustoConnectionStringBuilderEngine);
//Ingest from blobs according to the required properties
var kustoIngestionProperties = new KustoIngestionProperties("<databaseName>", "<tableName>");
await client.IngestFromStorageAsync("<filePath>", kustoIngestionProperties);
```

## Ingest from local files and validate ingestion

Use KustoQueuedIngestClient to ingest from local files and then validate the ingestion.

```csharp
var ingestUri = "https://ingest-<clusterName>.<region>.kusto.windows.net";
var appId = "<appId>";
var appKey = "<appKey>";
var appTenant = "<appTenant>";
//Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderDM = new KustoConnectionStringBuilder(ingestUri)
    .WithAadApplicationKeyAuthentication(
        applicationClientId: appId,
        applicationKey: appKey,
        authority: appTenant
    );
// Create a disposable client that will execute the ingestion
using var client = KustoIngestFactory.CreateQueuedIngestClient(kustoConnectionStringBuilderDM);
// Ingest from blobs according to the required properties
var kustoIngestionProperties = new KustoIngestionProperties("<databaseName>", "<tableName>");
await client.IngestFromStorageAsync("ValidTestFile.csv", kustoIngestionProperties);
await client.IngestFromStorageAsync("InvalidTestFile.csv", kustoIngestionProperties);
// Waiting for the aggregation
Thread.Sleep(TimeSpan.FromMinutes(8));
// Retrieve and validate failures
var ingestionFailures = await client.PeekTopIngestionFailuresAsync();
Ensure.IsTrue(ingestionFailures.Any(), "Failures expected");
// Retrieve, delete and validate failures
ingestionFailures = await client.GetAndDiscardTopIngestionFailuresAsync();
Ensure.IsTrue(ingestionFailures.Any(), "Failures expected");
```

### Ingest from local files and report status to a queue

Use KustoQueuedIngestClient to ingest from local files and then report the status to a queue.

```csharp
var ingestUri = "https://ingest-<clusterName>.<region>.kusto.windows.net";
var appId = "<appId>";
var appKey = "<appKey>";
var appTenant = "<appTenant>";
//Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderDM = new KustoConnectionStringBuilder(ingestUri)
    .WithAadApplicationKeyAuthentication(
        applicationClientId: appId,
        applicationKey: appKey,
        authority: appTenant
    );
// Create a disposable client that will execute the ingestion
using var client = KustoIngestFactory.CreateQueuedIngestClient(kustoConnectionStringBuilderDM);
// Ingest from a file according to the required properties
var kustoIngestionProperties = new KustoQueuedIngestionProperties("<databaseName>", "<tableName>")
{
    // Setting the report level to FailuresAndSuccesses will cause both successful and failed ingestions to be reported
    // (Rather than the default "FailuresOnly" level - which is demonstrated in the
    // 'Ingest From Local File(s) using KustoQueuedIngestClient and Ingestion Validation' section)
    ReportLevel = IngestionReportLevel.FailuresAndSuccesses,
    // Choose the report method of choice. 'Queue' is the default method.
    // For the sake of the example, we will choose it anyway. 
    ReportMethod = IngestionReportMethod.Queue
};
await client.IngestFromStorageAsync("ValidTestFile.csv", kustoIngestionProperties);
await client.IngestFromStorageAsync("InvalidTestFile.csv", kustoIngestionProperties);
// Waiting for the aggregation
Thread.Sleep(TimeSpan.FromMinutes(8));
// Retrieve and validate failures
var ingestionFailures = await client.PeekTopIngestionFailuresAsync();
Ensure.IsTrue(ingestionFailures.Any(), "The failed ingestion should have been reported to the failed ingestions queue");
// Retrieve, delete and validate failures
ingestionFailures = await client.GetAndDiscardTopIngestionFailuresAsync();
Ensure.IsTrue(ingestionFailures.Any(), "The failed ingestion should have been reported to the failed ingestions queue");
// Verify the success has also been reported to the queue
var ingestionSuccesses = await client.GetAndDiscardTopIngestionSuccessesAsync();
Ensure.ConditionIsMet(ingestionSuccesses.Any(), "The successful ingestion should have been reported to the successful ingestions queue");
```

### Ingest from local files and report status to a table

Use KustoQueuedIngestClient to ingest from local files and report status to a table.

```csharp
var ingestUri = "https://ingest-<clusterName>.<region>.kusto.windows.net";
var appId = "<appId>";
var appKey = "<appKey>";
var appTenant = "<appTenant>";
//Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderDM = new KustoConnectionStringBuilder(ingestUri)
    .WithAadApplicationKeyAuthentication(
        applicationClientId: appId,
        applicationKey: appKey,
        authority: appTenant
    );
// Create a disposable client that will execute the ingestion
using var client = KustoIngestFactory.CreateQueuedIngestClient(kustoConnectionStringBuilderDM);
// Ingest from a file according to the required properties
var kustoIngestionProperties = new KustoQueuedIngestionProperties("<databaseName>", "<tableName>")
{
    // Setting the report level to FailuresAndSuccesses will cause both successful and failed ingestions to be reported
    // (Rather than the default "FailuresOnly" level)
    ReportLevel = IngestionReportLevel.FailuresAndSuccesses,
    // Choose the report method of choice
    ReportMethod = IngestionReportMethod.Table
};
var filePath = "<filePath>";
var fileIdentifier = Guid.NewGuid();
var sourceOptions = new StorageSourceOptions { SourceId = fileIdentifier };
// Execute the ingest operation and save the result.
var clientResult = await client.IngestFromStorageAsync(filePath, kustoIngestionProperties, sourceOptions);
// Use the fileIdentifier you supplied to get the status of your ingestion 
var ingestionStatus = clientResult.Result.GetIngestionStatusBySourceId(fileIdentifier);
while (ingestionStatus.Status == Status.Pending)
{
    // Wait a minute...
    Thread.Sleep(TimeSpan.FromMinutes(1));
    // Try again
    ingestionStatus = clientResult.Result.GetIngestionStatusBySourceId(fileIdentifier);
}
// Verify the results of the ingestion
Ensure.ConditionIsMet(ingestionStatus.Status == Status.Succeeded, "The file should have been ingested successfully");
```

## Next steps

* [Kusto.Ingest client reference](kusto-ingest-client-reference.md)
* [Kusto.Ingest operation status](kusto-ingest-client-errors.md)
* [Kusto.Ingest exceptions](kusto-ingest-client-errors.md)
* [Kusto connection strings](../connection-strings/kusto.md)
* [Kusto authorization model](../../management/security-roles.md)
