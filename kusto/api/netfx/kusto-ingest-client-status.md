---
title:  Kusto.Ingest status reporting
description: This article describes Kusto.Ingest ingestion status reporting in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/30/2019
---
# Kusto.Ingest ingestion status reporting

This article explains how to use [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) features to track the status of an ingestion request.

## Description classes

These description classes contain important details about the source data to be ingested, and should be used in the ingestion operation. 

* SourceDescription
* DataReaderDescription
* StreamDescription
* FileDescription
* BlobDescription

The classes are all derived from the abstract class `SourceDescription`, and they're used to instantiate a unique identifier for each data source. Each identifier will then be used for status tracking and will show up in all reports, traces, and exceptions related to the relevant operation.

### Class SourceDescription

Large datasets will be split into 1GB chunks, and each part will be ingested separately. The same SourceId will then apply to all ingest operations originated from the same dataset.   

```csharp
public abstract class SourceDescription
{
    public Guid? SourceId { get; set; }
}
```

### Class DataReaderDescription

```csharp
public class DataReaderDescription : SourceDescription
{
    public  IDataReader DataReader { get; set; }
}
```

### Class StreamDescription

```csharp
public class StreamDescription : SourceDescription
{
    public Stream Stream { get; set; }
}
```

### Class FileDescription

```csharp
public class FileDescription : SourceDescription
{
    public string FilePath { get; set; }
}
```

### Class BlobDescription

```csharp
public class BlobDescription : SourceDescription
{
    public string BlobUri { get; set; }
    // Setting the Blob size here is important, as this saves the client the trouble of probing the blob for size
    public long? BlobSize { get; set; }
}
```

## Ingestion result representation

### Interface IKustoIngestionResult

This interface captures the result of a single queued ingestion operation and can be retrieved by `SourceId`.

```csharp
public interface IKustoIngestionResult
{
    // Retrieves the detailed ingestion status of the ingestion source with the given sourceId.
    IngestionStatus GetIngestionStatusBySourceId(Guid sourceId);

    // Retrieves the detailed ingestion status of all data ingestion operations into Kusto associated with this IKustoIngestionResult instance.
    IEnumerable<IngestionStatus> GetIngestionStatusCollection();
}
```

### Class IngestionStatus

IngestionStatus contains a complete status of a single ingestion operation.

```csharp
public class IngestionStatus
{
    // The ingestion status returns from the service. Status remains 'Pending' during the ingestion process and
    // is updated by the service once the ingestion completes. When <see cref="IngestionReportMethod"/> is set to 'Queue' the ingestion status
    // will always be 'Queued' and the caller needs to query the report queues for ingestion status, as configured. To query statuses that were
    // reported to queue, see: <see href="https://learn.microsoft.com/azure/kusto/api/netfx/kusto-ingest-client-status#ingestion-status-in-azure-queue"/>.
    // When <see cref="IngestionReportMethod"/> is set to 'Table', call <see cref="IKustoIngestionResult.GetIngestionStatusBySourceId"/> or
    // <see cref="IKustoIngestionResult.GetIngestionStatusCollection"/> to retrieve the most recent ingestion status.
    public Status Status { get; set; }
    // A unique identifier representing the ingested source. Can be supplied during the ingestion execution.
    public Guid IngestionSourceId { get; set; }
    // The URI of the blob, potentially including the secret needed to access the blob.
    // This can be a filesystem URI (on-premises deployments only), or an Azure Blob Storage URI (including a SAS key or a semicolon followed by the account key)
    public string IngestionSourcePath { get; set; }
    // The name of the database holding the target table.
    public string Database { get; set; }
    // The name of the target table into which the data will be ingested.
    public string Table { get; set; }
    // The last updated time of the ingestion status.
    public DateTime UpdatedOn { get; set; }
    // The ingestion's operation Id.
    public Guid OperationId { get; set; }
    // The ingestion operation activity Id.
    public Guid ActivityId { get; set; }
    // In case of a failure - indicates the failure's error code.
    public IngestionErrorCode ErrorCode { get; set; }
    // In case of a failure - indicates the failure's status.
    public FailureStatus FailureStatus { get; set; }
    // In case of a failure - indicates the failure's details.
    public string Details { get; set; }
    // In case of a failure - indicates whether or not the failures originate from an Update Policy.
    public bool OriginatesFromUpdatePolicy { get; set; }
}
```

### Status enumeration

|Value              |Meaning                                                                                     |Temporary/Permanent
|-------------------|-----------------------------------------------------------------------------------------------------|---------|
|Pending            |The value may change during the course of ingestion, based on the outcome of the ingestion operation |Temporary|
|Succeeded          |The data has been successfully ingested                                                              |Permanent| 
|Failed             |Ingestion failed                                                                                     |Permanent|
|Queued             |The data has been queued for ingestion                                                               |Permanent|
|Skipped            |No data was supplied and the ingest operation was skipped                                            |Permanent|
|PartiallySucceeded |Part of the data was successfully ingested, while some failed                                        |Permanent|

## Tracking Ingestion Status (KustoQueuedIngestClient)

[IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) is a 'fire-and-forget' client. The ingestion operation on the client side ends by posting a message to an Azure queue. After the posting, the client job is done. For the client user's convenience, KustoQueuedIngestClient provides a mechanism for tracking the individual ingestion status. This mechanism isn't intended for mass usage on high-throughput ingestion pipelines. This mechanism is for precision ingestion when the rate is relatively low and the tracking requirements are strict.

> [!WARNING]
> Turning on positive notifications for every ingestion request for large volume data streams should be avoided, since this places an extreme load on the underlying xStore resources, which might lead to increased ingestion latency and even complete cluster non-responsiveness.

The following properties (set on [KustoQueuedIngestionProperties](kusto-ingest-client-reference.md#class-kustoqueuedingestionproperties)) control the level and transport for ingestion success or failure notifications.

### IngestionReportLevel enumeration

```csharp
public enum IngestionReportLevel
{
    FailuresOnly = 0,
    None,
    FailuresAndSuccesses
}
```

### IngestionReportMethod enumeration

```csharp
public enum IngestionReportMethod
{
    Queue = 0,
    Table,
    QueueAndTable
}
```

To track the status of your ingestion, provide the following to the [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) that you do the ingest operation with:
1.	Set `IngestionReportLevel`property to the required level of report. Either `FailuresOnly` (which is the default value) or `FailuresAndSuccesses`.
When set to `None`, nothing will be reported at the end of the ingestion.
1.	Specify the `IngestionReportMethod` - `Queue`, `Table`, or `QueueAndTable`.

A usage example can be found on the [Kusto.Ingest Examples](kusto-ingest-client-examples.md) page.

### Ingestion status in the Azure table

The `IKustoIngestionResult` interface that is returned from each ingest operation contains functions that can be used to query the status of the ingestion.
Pay special attention to the `Status` property of the returned `IngestionStatus` objects:
* `Pending` indicates that the source has been queued for ingestion and is yet to be updated. Use the function again to query the status of the source
* `Succeeded` indicates that the source has been ingested successfully
* `Failed` indicates that the source failed to be ingested

> [!NOTE]
> Getting a `Queued` status indicates that the `IngestionReportMethod` was left at its default value of 'Queue'. This is a permanent status and re-invoking the `GetIngestionStatusBySourceId` or `GetIngestionStatusCollection` functions, will always result in the same 'Queued' status.
> To check the status of an ingestion in an Azure table, prior to ingesting, verify that the `IngestionReportMethod` property of the [KustoQueuedIngestionProperties](kusto-ingest-client-reference.md#class-kustoqueuedingestionproperties) is set to `Table`. If you also want the ingestion status to be reported to a queue, set the status to `QueueAndTable`.

### Ingestion status in Azure queue

The `IKustoIngestionResult` methods are only relevant for checking a status in an Azure table. To query statuses that were reported to an Azure queue, use the following [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) methods.

|Method                                  |Purpose     |
|----------------------------------------|------------|
|PeekTopIngestionFailures                |Async method that returns information about the earliest ingestion failures that haven't already been discarded because of the limit for requested messages |
|GetAndDiscardTopIngestionFailures       |Async method that returns and discards the earliest ingestion failures that haven't already been discarded because of the limit for requested messages |
|GetAndDiscardTopIngestionSuccesses      |Async method that returns and discards the earliest ingestion successes that haven't already been discarded because of the limit for requested messages. This method is only relevant if the `IngestionReportLevel` is set to `FailuresAndSuccesses` |

### Ingestion failures retrieved from the Azure queue

The ingestion failures are represented by the `IngestionFailure` object that contains useful information about the failure.

|Property                      |Meaning     |
|------------------------------|------------|
|Database & Table              |The intended database and table names |
|IngestionSourcePath           |The path of the ingested blob. Will contain the original file name if file is ingested. Will be random if DataReader is ingested |
|FailureStatus                 |`Permanent` (no retry will be executed), `Transient` (retry will be executed), or `Exhausted` (several retries also failed) |
|OperationId & RootActivityId  |Operation ID and RootActivity ID of the ingestion (useful for further troubleshooting) |
|FailedOn                      |UTC time of the failure. Will be greater than the time when the ingestion method was called, since the data is aggregated before running the ingestion |
|Details                       |Other details concerning the failure (if any exist) |
|ErrorCode                     |`IngestionErrorCode` enumeration, represents the ingestion error code, if there was a failure |
