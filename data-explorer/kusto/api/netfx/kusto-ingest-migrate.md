---
title: Kusto Ingest - Migrate V1 to V2
description: Guide to migrating Kusto ingestion from Ingest V1 to Ingest V2. Covers client builders, sources, uploaders, ingestion properties, and status tracking with examples.
ms.topic: concept-article
ms.date: 08/19/2025
ms.reviewer: yogilad
---

# Migrating from Ingest V1 to Ingest V2

This guide explains the key differences and improvements when migrating from the Ingest V1 API to the Ingest V2 API, with code examples and best practices.

## Creating the Ingest Client

### V1: Factory Methods

In Ingest V1, clients are created using static factory methods, built from a connection string.

**Example (V1):**

```csharp
var kcsb = new KustoConnectionStringBuilder(clusterUrl).WithAadUserPromptAuthentication();
var client = KustoIngestFactory.CreateQueuedIngestClient(kcsb);
```

### V2: Builder Pattern

In Ingest V2, clients are created using builder classes.  
This pattern allows for more flexible and readable configuration, supports method chaining, and makes it easier to add new options in the future.

Connection strings are no longer used to create clients.  
Instead, you provide a `Uri` for the cluster and an authentication provider.

An authentication provider can be any of `Azure.Identity.TokenCredential` or any of Kusto's `IKustoTokenCredentialsProvider`.

**Example (V2):**

```csharp
using Kusto.Cloud.Platform.Msal;
using Kusto.Ingest.V2;

var auth = new AadUserPromptCredentialsProvider("myclient");
var client = QueuedIngestClientBuilder.Create(new Uri(clusterUrl))
    .WithAuthentication(auth)
    .Build();
```

**Other V2 Clients (similar to V1):**

- `StreamingIngestClientBuilder`
- `ManagedStreamingIngestClientBuilder`

> [!NOTE]
> In both V1 and V2, you can now pass the cluster URL to a client without the "ingest-" prefix. The constructor converts the URL to the correct format automatically.

## Managed Streaming Ingestion

Managed Streaming Ingest client is similar to the one in V1 - it tries to stream the data first, and if it fails after a few retries, it falls back to queued ingestion.

The main differences are:

- By default, V2 streams. If streaming fails three times with transient errors, it falls back to queued ingestion.
- The `ManagedStreamingPolicy` was expanded to allow more control. It's now an interface - `IManagedStreamingPolicy`, and provides methods for a more fine-grained control over the managed streaming process.

## Sources

### V1: Multiple Methods for Different Sources

V1 exposes different methods for each source type, such as `IngestFromStorage`, `IngestFromStreamAsync`, etc.  
Format and compression are provided in `ingestionProperties`.

**Example (V1):**

```csharp
var ingestionProperties = new KustoIngestionProperties(database, table) { Format = DataSourceFormat.csv };
client.IngestFromStorageAsync(filePath, ingestionProperties);
client.IngestFromStreamAsync(stream, ingestionProperties);
```

### V2: Unified Source Abstractions

V2 introduces source classes that encapsulate all relevant information, including format and compression.  
There's one method to ingest a single source: the `IngestAsync` method. The client and source types determine the ingestion behavior.

**Source Types:**

- `FileSource` (local files)
- `StreamSource` (.NET streams)
- `BlobSource` (cloud storage)
- `DataReaderSource` (.NET data readers)


The "database" and "table" properties are now parameters of the `IngestAsync` method, rather than properties of the ingestion properties.  This means that for most cases, you don't need to create `IngestProperties`.

**Example (V2):**

```csharp
var source = new FileSource(filePath, DataSourceFormat.csv);
await client.IngestAsync(source, database, table);
```

> [!WARNING]  
> Since each call to IngestAsync now operates against the service, try to limit the amount of calls you make, or wait between them, to avoid throttling.

## Uploaders

In V1, uploading local data to the cloud for ingestion was an internal process handled by the SDK.  
It had several limitations:
- It was done without any knowledge of the client.
- It always used Kusto's internal storage
  - It had hidden costs for the user.
  - Couldn't be monitored or scaled by the user.
  - Private networks caused issues.
- It always used the same strategy to upload the data.

In V2, uploaders are introduced to provide more flexibility and control over the upload process.

The `IUploader` interface defines the contract for uploaders, and the SDK provides several implementations:

- `UserContainersUploader` - **preferred** - Uploads data to a list of user-defined Azure Blob Storage containers.
- `ManagedUploader` - Uploads data to Kusto's internal storage, similar to V1.

You can also implement your own uploader by implementing the `IUploader` interface.

> [!NOTE]
> Uploaders are only relevant for queued ingestion, done from `QueuedIngestClient` or `ManagedStreamingIngestClient`.  
> Streaming ingestion sends the data directly in the HTTP request, so it doesn't use uploaders.

By default, the clients create a `ManagedUploader` instance, but you can specify a different uploader using the `WithUploader` method in the builder.

**Example (V2):**

```csharp
var client = QueuedIngestClientBuilder.Create(new Uri(clusterUrl))
    .WithAuthentication(auth)
    .Build();

// Equivalent to:
var uploader = ManagedUploaderBuilder.Create()
    .WithAuthentication(auth)
    .Build();
var client = QueuedIngestClientBuilder.Create(new Uri(clusterUrl))
    .WithUploader(uploader)
    .Build();

// Preferred:
var uploader = UserContainersUploaderBuilder.Create()
    .AddContainer("<address>")
    .AddContainer("<address2>", tokenCredential)
    .Build();
```

You can use the uploader to convert local sources to `BlobSource`:

```csharp
var source = new FileSource(filePath, DataSourceFormat.csv);
BlobSource blobSource = await uploader.UploadAsync(source);
```

Or even multiple sources:

```csharp
BlobSource source1 = new FileSource(filePath1, DataSourceFormat.csv);
BlobSource source2 = new StreamSource(stream, DataSourceFormat.json);
(IEnumerable<BlobSource> successes, IEnumerable<IngestResult> failures) = await uploader.UploadAsync(new[] { source1, source2 });
```

## Ingestion Properties

As mentioned before, in V2, these properties are no longer part of the ingestion properties class:

- `database` and `table` are now parameters of the `IngestAsync` method.
- `format` and `compression` are now part of the source classes.

The new class is named `IngestProperties`, and it contains properties that are relevant to the ingestion process, some examples:

- `EnableTracking` - Whether to enable tracking for the ingestion.
- `MappingReference` - The name of the mapping to use for the ingestion.
- `SkipBatching` - Whether to skip batching and ingest the data immediately (equivalent to `FlushImmediately` in V1).
                   Not recommended for most use cases.

**Example (V2):**

```csharp
var source = new FileSource(filePath, DataSourceFormat.csv);
var properties = new IngestProperties
{
    EnableTracking = true,
    MappingReference = "MyMapping"
};
await client.IngestAsync(source, database, table, properties);
```

## Status Tracking

In V1, status tracking was done using the `ReportLevel` and `ReportMethod` properties in the ingestion properties.

Tracking was reimplemented in V2 and is now simpler.

### Queued Ingestion

When data is queued for ingestion (via a `QueuedIngestClient` or `ManagedStreamingIngestClient`), the ingestion is asynchronous, and the result isn't immediate.  
The method returns an `IngestionOperation` object:

```csharp
var source = new FileSource(filePath, DataSourceFormat.csv);
var operation = await client.IngestAsync(source, database, table);
Assert.IsTrue(operation.IngestionMethod == IngestionMethod.Queued);
```

If `IngestAsync` returns successfully, the data was queued for ingestion, but it can still fail later in the ingestion pipeline.  
If you need to track the status of the ingestion, enable tracking by setting `EnableTracking` to true in the `IngestProperties`:

```csharp
var properties = new IngestProperties { EnableTracking = true };
var operation = await client.IngestAsync(source, database, table, properties);
```

Then, `operation` becomes a handle to the ingestion operation, and you can use it to track the status of the ingestion using the client:

```csharp
var summary = await client.GetOperationSummaryAsync(operation);
// `summary.Status` can be `Succeeded`, `Failed`, `InProgress`, or `Cancelled`.
```

You may query the status again until it's no longer `InProgress`.

To get more details about the ingestion, use the `GetIngestionDetailsAsync` method:

```csharp
var details = await client.GetIngestionDetailsAsync(operation);
var blob = details.IngestResults.Single();
blob.Status // Succeeded, Failed, etc.
blob.Details // Additional details about the ingestion
blob.Exception // If the ingestion failed, this will contain the exception details
```

> **Warning:**  
> Each call to `GetOperationSummaryAsync` or `GetIngestionDetailsAsync` will make an HTTP request to the Kusto service.  
> Too frequent calls may lead to throttling or performance issues.  
> Consider waiting a few seconds between calls, or using a backoff strategy.

### Streaming Ingestion

For streaming ingestion, the result of the ingestion is immediate.  
If the method returns successfully, the data was ingested successfully.  
Still, the interface of the methods are the same, and `GetOperationSummaryAsync` and `GetOperationDetailsAsync` return the expected results.

### Managed Streaming Ingestion

Managed streaming ingestion can resolve to either queued or streaming ingestion.  
Either way, if tracking is enabled, you may use the same methods to track the status of the ingestion operation.

### Serializing Ingestion Operations

After running an operation with tracking enabled, you may not want to track it immediately.

In V2, you can serialize and deserialize ingestion operations using the `ToJsonString` and `FromJsonString` methods.  

This allows you to store the operation in a database or file, and later retrieve it to continue monitoring the ingestion status.  
You need to use a client that matches the address and type of the client that created the operation, and has tracking enabled.

```csharp
var serialized = operation.ToJsonString();
var deserializedOperation = IngestionOperation.FromJsonString(serialized, client);
var summary = await client.GetOperationSummaryAsync(deserializedOperation);
```

## Advanced Topics

### Multi-Ingestion

`QueuedIngestClient` in V2 implements the `IMultiIngest` interface, which allows you to ingest multiple sources in a single call.

Currently, only a list of `BlobSource` is supported.  
This means you might need to use an uploader to convert your local files or streams to `BlobSource` before using this method.

**Example (V2):**

```csharp
var uploader = new ManagedUploaderBuilder()
    .WithAuthentication(auth)
    .Build();
var client = QueuedIngestClientBuilder.Create(new Uri(clusterUrl))
    .WithUploader(uploader)
    .WithAuthentication(auth)
    .Build();
var source1 = new FileSource(filePath1, DataSourceFormat.csv);
var source2 = new FileSource(filePath2, DataSourceFormat.csv);
var (successes, failures) = uploader.UploadManyAsync(new[] { source1, source2 });

foreach (var blob in failures)
{
    Console.WriteLine($"Failed to upload {blob.SourceId}: {blob.Exception?.Message}");
}

var operation = await client.IngestAsync(successes, database, table,
    new IngestProperties { EnableTracking = true });
```

When tracking the operation, the status contains the number of successes and failures:

```csharp
var summary = await client.GetOperationSummaryAsync(operation);
Assert.IsTrue(summary.Successes > 0);
Assert.IsTrue(summary.Failures > 0);
summary.Status // Succeeded, Failed, Cancelled and can also be InProgress in multi-ingestion
```

And you can get the details of each source:

```csharp
var details = await client.GetIngestionDetailsAsync(operation);
foreach (var blob in details.IngestResults)
{
    if (blob.Status == IngestStatus.Succeeded)
    {
        Console.WriteLine($"Blob {blob.BlobName} was ingested successfully.");
    }
    else if (blob.Status == IngestStatus.Failed)
    {
        Console.WriteLine($"Blob {blob.BlobName} failed to ingest: {blob.Exception?.Message}");
    }
}
```

### DataReaderSource

In V2, you can use `DataReaderSource` to ingest data from a .NET `IDataReader` implementation.  
Unlike other sources, DataReaders can be partially ingested, meaning they can ingest some of the data or be ingested in batches.

When using `IngestAsync` with a `DataReaderSource`, its internal `MaxBytesPerFragment` and `MaxRecordsPerFragment` properties are used to determine how much data to ingest.

Any data beyond that will remain in the reader for the next ingestion call.  
You can know if the reader has more data to ingest by checking the `HasDataRemaining` property of the `DataReaderSource`.

**Example (V2):**

```csharp
var dataReader = GetMyDataReader();
var source = new DataReaderSource(dataReader, maxBytesPerFragment: 1024);
await client.IngestAsync(source, database, table); // Will ingest up to 1024 bytes of data
if (source.HasDataRemaining)
{
    // There is more data to ingest; you can call IngestAsync again
}
```

If you want to ingest multiple batches of data readers, you can use an uploader:

```csharp
var uploader = new ManagedUploaderBuilder()
    .WithAuthentication(auth)
    .Build();
(IEnumerable<BlobSource> successes, IEnumerable<IngestResult> failures) = await uploader.UploadManyAsync(
    dataReaderSource,
    maxFragmentsToCreate: 10, // defaults to the maximum number of blobs you can ingest in a single operation
    props);

// dataReaderSource.HasDataRemaining can still be true if `maxFragmentsToCreate` was reached before all data was ingested.
if (dataReaderSource.HasDataRemaining)
{
    Console.WriteLine("There is more data to ingest.");
}

await client.IngestAsync(successes, database, table, props);
```

Related content:

* [Create an app to get data using queued ingestion](../get-started/app-queued-ingestion.md)
* [Stream data for ingestion](../get-started/app-managed-streaming-ingest.md)