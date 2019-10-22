---
title: Kusto.Ingest Reference - Ingestion Status Reporting - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.Ingest Reference - Ingestion Status Reporting in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2019
---
# Kusto.Ingest Reference - Ingestion Status Reporting
This article explains how to utilize [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) capabilities for tracking the status of an ingestion request.

## SourceDescription, DataReaderDescription, StreamDescription, FileDescription, and BlobDescription
These various description classes encapsulate important details regarding the source data to be ingested, and may and even should be provided to ingestion operation.
All these classes are derived from the abstract class `SourceDescription` and are used to instantiate a unique identifier for each data source.
The provided identifier is intended for subsequent operation status tracking and will show up in all reports, traces and exceptions related to the appropriate operation.

### Class SourceDescription
>When ingesting a large dataset (e.g., a DataReader over 1GB) - the data will be split into 1GB chunks and ingested separately.<BR>In this case, the same SourceId will apply to all ingest operations originated from the same dataset.   

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

## Ingestion Result Representation

### Interface IKustoIngestionResult
This interface captures the result of a single queued ingestion operation and allows its retrieval by `SourceId`.
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
IngestionStatus encapsulates a complete status of a single ingestion operation.
```csharp
public class IngestionStatus
{
    // The ingestion status returns from the service. Status remains 'Pending' during the ingestion process and
    // is updated by the service once the ingestion completes. When <see cref="IngestionReportMethod"/> is set to 'Queue' the ingestion status
    // will always be 'Queued' and the caller needs to query the report queues for ingestion status, as configured. To query statuses that were
    // reported to queue, see: <see href="https://docs.microsoft.com/en-us/azure/kusto/api/netfx/kusto-ingest-client-status#ingestion-status-in-azure-queue"/>.
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
|Value |Meaning |
|------------|------------|
|Pending |Temporary. Might change during the course of ingestion based on the outcome of the ingestion operation |
|Succeeded |Permanent. he data has been successfully ingested |
|Failed |Permanent. Ingestion failed |
|Queued |Permanent. The data has been queued for ingestion |
|Skipped |Permanent. No data was supplied and the ingest operation was skipped |
|PartiallySucceeded |Permanent. Part of the data has been successfully ingested while some failed |

## Tracking Ingestion Status (KustoQueuedIngestClient)
[IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) is a 'fire-and-forget' client - the ingestion operation on the client side ends by posting a message to an Azure Queue, after which the client job is done. For the client user convenience, KustoQueuedIngestClient provides a mechanism for tracking the individual ingestion status. This is not intended for mass usage on high-throughput ingestion pipelines, but rather for 'precision' ingestion when the rate is relatively low and the tracking requirements are very strict.

> [!WARNING]
> Turning on positive notifications for every ingestion request for large volume data streams should be avoided, as this puts extreme load on the underlying xStore resources, > which might lead to increased ingestion latency and even complete cluster non-responsiveness.


The following properties (set on [KustoQueuedIngestionProperties](kusto-ingest-client-reference.md#class-kustoqueuedingestionproperties)) control the level and transport for ingestion success or failure notifications:

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

To be able to track the status of your ingestion, make sure you provide the following to the [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient) you perform the ingest operation with:
1.	Set `IngestionReportLevel`property to the desired level of report - either FailuresOnly (which is the default value) or FailuresAndSuccesses.
When set to None, nothing will be reported at the end of the ingestion.
2.	Specify the desired `IngestionReportMethod` - Queue, Table or both.

A usage example can be found on the [Kusto.Ingest Examples](kusto-ingest-client-examples.md) page.

### Ingestion Status in Azure Table
The `IKustoIngestionResult` interface that is returned from each ingest operation contains functions that can be used to query the status of the ingestion.
Pay special attention to the `Status` property of the returned `IngestionStatus` objects:
* `Pending` indicates that the source has been queued for ingestion and is yet to be updated; use the function again to query the status of the source
* `Succeeded` indicates the source has been ingested successfully
* `Failed` indicates the source failed to be ingested

>Note, that getting a `Queued` status indicates that the `IngestionReportMethod` was left at its default value of 'Queue'. This is a permanent status and re-invoking the GetIngestionStatusBySourceId or GetIngestionStatusCollection functions will always result in the same 'Queued' status.<BR>To be able to check the status of an ingestion in an Azure Table, please verify prior to ingesting that the `IngestionReportMethod` property of the [KustoQueuedIngestionProperties](kusto-ingest-client-reference.md#class-kustoqueuedingestionproperties) is set to `Table` (or `QueueAndTable` if you also want the ingestion status to be reported to a queue).

### Ingestion Status in Azure Queue
The `IKustoIngestionResult` methods are only relevant for checking a status in an Azure Table. To query statuses that were reported to an Azure Queue, use the following methods of [IKustoQueuedIngestClient](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient):

|Method |Purpose |
|------------|------------|
|PeekTopIngestionFailures |Async method that returns information regarding the earliest ingestion failures that have not been discarded, according to the requested messages limit |
|GetAndDiscardTopIngestionFailures |Async method that returns and discards the earliest ingestion failures that have not been discarded, according to the requested messages limit |
|GetAndDiscardTopIngestionSuccesses |Async method that returns and discards the earliest ingestion successes that have not been discarded, according to the requested messages limit (only relevant if the `IngestionReportLevel` is set to `FailuresAndSuccesses` |


### Ingestion Failures Retrieved From Azure Queue
The ingestion failures are represented by `IngestionFailure` object that contains useful information regarding the failure:

|Property |Meaning |
|------------|------------|
|Database & Table |The intended database and table names |
|IngestionSourcePath |The path of the ingested blob. Will contains the original file name in case of file's ingestion. Will be random in case of DataReader's ingestion |
|FailureStatus |`Permanent` (no retry will be executed), `Transient` (retry will be executed), or `Exhausted` (several retries were also failed) |
|OperationId & RootActivityId |Operation ID and RootActivity ID of the ingestion (useful for further troubleshooting) |
|FailedOn |UTC time of the failure. Will be greater than the time when the ingestion method was called, as the data is being aggregated before executing the ingestion |
|Details |Other details concerning the failure (if any exist) |
|ErrorCode |`IngestionErrorCode` enumeration, representing the ingestion error code, in case the failure exist|