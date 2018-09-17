---
title: Kusto.Ingest Reference - Ingestion Code Examples - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.Ingest Reference - Ingestion Code Examples in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto.Ingest Reference - Ingestion Code Examples
This is a collection of short code snippets demonstrating various techniques of ingesting data into a Kusto table

>Reminder: these samples look as if the ingest client is destroyed immediately following the ingestion. Please do not take this literally.<BR>Ingest clients are reentrant, thread-safe and should not be created in large numbers. The recommended cardinality of ingest client instances is one per hosting process per target Kusto cluster.

### Useful References
* [Kusto.Ingest Client Reference](kusto-ingest-client-reference.md)
* [Kusto.Ingest Operation Status](kusto-ingest-client-errors.md)
* [Kusto.Ingest Exceptions](kusto-ingest-client-errors.md)
* [Kusto connection strings](../connection-strings/kusto.md)
* [Kusto Authorization Model](../../management/security-roles.md)


### Ingest from Azure Blob(s) using KustoQueuedIngestClient with (optional) RetryPolicy:
```csharp
// Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderDM = new KustoConnectionStringBuilder(@"https://ingest-ServiceName.kusto.windows.net")
{
    FederatedSecurity = true,
    InitialCatalog = "NetDefaultDB",
    ApplicationKey = "…",
    ApplicationClientId = "…"
};

// Create an ingest client
// Note, that creating a separate instance per ingestion operation is an anti-pattern. IngestClient classes are thread-safe and intended for reuse
IKustoIngestClient client = KustoIngestFactory.CreateQueuedIngestClient(kustoConnectionStringBuilderDM);

// Ingest from blobs according to the required properties
string kustoDatabase = "database";
string kustoTable = "table";
var kustoIngestionProperties = new KustoIngestionProperties(databaseName: kustoDatabase, tableName: kustoTable);
List<string> blobs = new List<string>
{
    @"Blob-1-with-SAS",
    @"Blob-2-with-SAS",
};

// Create your custom implementation of IRetryPolicy, which will affect how the ingest client handles retrying on transient failures
IRetryPolicy retryPolicy = new <class that implements IRetryPolicy>;
// This line sets the retry policy on the ingest client that will be enforced on every ingest call from here on
client.QueueRetryPolicy = retryPolicy;

client.IngestFromMultipleBlobs(blobUris: blobs, deleteSourcesOnSuccess: true, ingestionProperties: kustoIngestionProperties);

client.Dispose();
```

### Async Ingestion From a Single Azure Blob using KustoQueuedIngestClient:
```csharp
// Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderDM = new KustoConnectionStringBuilder(@"https://ingest-ServiceName.kusto.windows.net")
{
    FederatedSecurity = true,
    InitialCatalog = "NetDefaultDB",
    ApplicationKey = "…",
    ApplicationClientId = "…"
};

// Create an ingest client
// Note, that creating a separate instance per ingestion operation is an anti-pattern.
// IngestClient classes are thread-safe and intended for reuse
IKustoIngestClient client = KustoIngestFactory.CreateQueuedIngestClient(kustoConnectionStringBuilderDM);

// Ingest from blobs according to the required properties
string kustoDatabase = "database";
string kustoTable = "table";
var kustoIngestionProperties = new KustoIngestionProperties(databaseName: kustoDatabase, tableName: kustoTable);

await client.IngestFromSingleBlobAsync(blobUri: @"BLOB-URI-WITH-SAS-KEY", deleteSourceOnSuccess: true, ingestionProperties: kustoIngestionProperties, rawDataSize: 123);

client.Dispose();
```

### Ingest From Local File(s) using KustoDirectIngestClient (only for test purposes):
```csharp
// Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderEngine = new KustoConnectionStringBuilder(@"https://ServiceName.kusto.windows.net")
{
    FederatedSecurity = true,
    InitialCatalog = "NetDefaultDB",
    ApplicationKey = "…",
    ApplicationClientId = "…"
};

// Create a disposable client that will execute the ingestion
using (IKustoIngestClient client = KustoIngestFactory.CreateDirectIngestClient(kustoConnectionStringBuilderEngine))
{
    //Ingest from blobs according to the required properties
    string kustoDatabase = "database";
    string kustoTable = "table";
    var kustoIngestionProperties = new KustoIngestionProperties(databaseName: kustoDatabase, tableName: kustoTable);

    List<string> files = new List<string>
    {
        @"C:\Temp\data1.csv",
        @"C:\Temp\data2.csv",
    };

    client.IngestFromMultipleFiles(filePaths: files, deleteSourcesOnSuccess: false, ingestionProperties: kustoIngestionProperties);
}
```

### Ingest From Local File(s) using KustoQueuedIngestClient and Ingestion Validation 
```csharp
// Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderDM = new KustoConnectionStringBuilder(@"https://ingest-ServiceName.kusto.windows.net")
{
    FederatedSecurity = true,
    InitialCatalog = "NetDefaultDB",
    ApplicationKey = "…",
    ApplicationClientId = "…"
};

// Create a disposable client that will execute the ingestion
IKustoQueuedIngestClient client = KustoIngestFactory.CreateQueuedIngestClient(kustoConnectionStringBuilderDM);

// Ingest from files according to the required properties
string kustoDatabase = "database";
string kustoTable = "table";
var kustoIngestionProperties = new KustoIngestionProperties(databaseName: kustoDatabase, tableName: kustoTable);

client.IngestFromMultipleFiles(new string[] { "ValidTestFile.csv", "InvalidTestFile.csv" }, false, kustoIngestionProperties);

// Waiting for the aggregation
Thread.Sleep(TimeSpan.FromMinutes(8));

// Retrieve and validate failures
var ingestionFailures = client.PeekTopIngestionFailures().GetAwaiter().GetResult();
Ensure.IsTrue((ingestionFailures.Count() > 0), "Failures expected");
// Retrieve, delete and validate failures
ingestionFailures = client.GetAndDiscardTopIngestionFailures().GetAwaiter().GetResult();
Ensure.IsTrue((ingestionFailures.Count() > 0), "Failures expected");

// Dispose of the client
client.Dispose();
```

### Ingest From a Local File using KustoQueuedIngestClient and report status to a queue

```csharp
// Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderDM = new KustoConnectionStringBuilder(@"https://ingest-ServiceName.kusto.windows.net")
{
    FederatedSecurity = true,
    InitialCatalog = "NetDefaultDB",
    ApplicationKey = "…",
    ApplicationClientId = "…"
};

// Create a disposable client that will execute the ingestion
IKustoQueuedIngestClient client = KustoIngestFactory.CreateQueuedIngestClient(kustoConnectionStringBuilderDM);

// Ingest from a file according to the required properties
string kustoDatabase = "databaseName";
string kustoTable = "tableName";
var kustoIngestionProperties = new KustoQueuedIngestionProperties(databaseName: kustoDatabase,
    tableName: kustoTable)
{
    // Setting the report level to FailuresAndSuccesses will cause both successful and failed ingestions to be reported
    // (Rather than the default "FailuresOnly" level - which is demonstrated in the
    // 'Ingest From Local File(s) using KustoQueuedIngestClient and Ingestion Validation' section)
    ReportLevel = IngestionReportLevel.FailuresAndSuccesses,
    // Choose the report method of choice. 'Queue' is the default method.
    // For the sake of the example, we will choose it anyway. 
    ReportMethod = IngestionReportMethod.Queue
};

client.IngestFromMultipleFiles(new string[] { "ValidTestFile.csv", "InvalidTestFile.csv" }, false, kustoIngestionProperties);

// Waiting for the aggregation
Thread.Sleep(TimeSpan.FromMinutes(8));

// Retrieve and validate failures
var ingestionFailures = client.PeekTopIngestionFailures().GetAwaiter().GetResult();
Ensure.IsTrue((ingestionFailures.Count() > 0), "The failed ingestion should have been reported to the failed ingestions queue");
// Retrieve, delete and validate failures
ingestionFailures = client.GetAndDiscardTopIngestionFailures().GetAwaiter().GetResult();
Ensure.IsTrue((ingestionFailures.Count() > 0), "The failed ingestion should have been reported to the failed ingestions queue");

// Verify the success has also been reported to the queue
var ingestionSuccesses = client.GetAndDiscardTopIngestionSuccesses().GetAwaiter().GetResult();
Ensure.ConditionIsMet((ingestionSuccesses.Count() > 0),
    "The successful ingestion should have been reported to the successful ingestions queue");

// Dispose of the client
client.Dispose();
```

### Ingest From a Local File using KustoQueuedIngestClient and report status to a table

```csharp
// Create Kusto connection string with App Authentication
var kustoConnectionStringBuilderDM = new KustoConnectionStringBuilder(@"https://ingest-ServiceName.kusto.windows.net")
{
    FederatedSecurity = true,
    InitialCatalog = "NetDefaultDB",
    ApplicationKey = "…",
    ApplicationClientId = "…"
};

// Create a disposable client that will execute the ingestion
IKustoQueuedIngestClient client = KustoIngestFactory.CreateQueuedIngestClient(kustoConnectionStringBuilderDM);

// Ingest from a file according to the required properties
string kustoDatabase = "databaseName";
string kustoTable = "tableName";
var kustoIngestionProperties = new KustoQueuedIngestionProperties(databaseName: kustoDatabase,
    tableName: kustoTable)
{
    // Setting the report level to FailuresAndSuccesses will cause both successful and failed ingestions to be reported
    // (Rather than the default "FailuresOnly" level)
    ReportLevel = IngestionReportLevel.FailuresAndSuccesses,
    // Choose the report method of choice
    ReportMethod = IngestionReportMethod.Table
};

var filePath = @"pathToValidFile";
var fileIdentifier = Guid.NewGuid();
var fileDescription = new FileDescription() {FilePath = filePath, SourceId = fileIdentifier};

// Execute the ingest operation and save the result.
var clientResult = client.IngestFromSingleFile(fileDescription: fileDescription,
    deleteSourceOnSuccess: false, ingestionProperties: kustoIngestionProperties);

// Use the fileIdentifier you supplied to get the status of your ingestion 
var ingestionStatus = clientResult.GetIngestionStatusBySourceId(fileIdentifier);
while (ingestionStatus.Status == Status.Pending)
{
    // Wait a minute...
    Thread.Sleep(TimeSpan.FromMinutes(1));
    // Try again
    ingestionStatus = clientResult.GetIngestionStatusBySourceId(fileIdentifier);
}

// Verify the results of the ingestion
Ensure.ConditionIsMet(ingestionStatus.Status == Status.Succeeded,
    "The file should have been ingested successfully");

// Dispose of the client
client.Dispose();
```