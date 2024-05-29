---
title:  Kusto.Ingest errors & exceptions
description: This article describes Kusto.Ingest - Errors and Exceptions in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/11/2021
---
# Kusto.Ingest errors and exceptions

Any error during the ingestion handling on the client side is indicated by a C# exception.

## Failures

### KustoDirectIngestClient exceptions

While attempting to ingest from multiple sources, errors might occur during the ingestion process. 
If an ingestion fails for one of the sources, it's logged and the client continues to ingest the remaining sources. 
After going over all sources for ingestion, an `IngestClientAggregateException` is thrown, containing the `IList<IngestClientException> IngestionErrors` member.

`IngestClientException` and its derived classes contain a field `IngestionSource` and an `Error` field. The two fields together create a mapping, from the source that failed ingestion, to the error that occurred while attempting the ingestion. The information can be used in the `IngestionErrors` list to investigate which sources failed ingestion and why. The `IngestClientAggregateException` exception also contains a boolean property `GlobalError`, that indicates whether an error occurred for all sources.

### Failures ingesting from files or blobs

If an ingestion failure occurs while attempting to ingest from a blob or file, the ingestion sources won't be deleted, even if the `deleteSourceOnSuccess` flag is set to `true`. The sources are preserved for further analysis. Once the origin of the error is understood, and if the error didn't originate from the ingestion source itself, then the user of the client may attempt to reingest it.

### Failures ingesting from IDataReader

While ingesting from DataReader, the data to ingest is saved to a temporary folder whose default location is `<Temp Path>\Ingestions_<current date and time>`. This default folder is always deleted after a successful ingestion.

In the `IngestFromDataReader` and `IngestFromDataReaderAsync` methods, the `retainCsvOnFailure` flag, whose default value is `false`, determines whether the files should be kept after a failed ingestion. If this flag is set to `false`, data that fails the ingestion won't be persisted, making it hard to understand what went wrong.

## KustoQueuedIngestClient exceptions

`KustoQueuedIngestClient` ingests data by uploading messages to an Azure queue. If an error occurs before or during the queueing process, an `IngestClientAggregateException` is thrown at the end of the process. The thrown exception includes a collection of `IngestClientException`, that contains the source of each failure, and hadn't been posted to the queue. The error that occurred while attempting to post the message is also thrown.

### Posting to queue failures with a file or blob as a source

If an error occurs while using the `KustoQueuedIngestClient`'s `IngestFromFile/IngestFromBlob` methods, the sources aren't deleted, even if the `deleteSourceOnSuccess` flag is set to `true`. Instead, the sources are preserved for further analysis. 

Once the origin of the error is understood, and if the error didn't originate from the ingestion source itself, the user of the client may attempt to requeue the data by using the relevant `IngestFromFile/IngestFromBlob` methods with the failed source. 

### Posting to queue failures with IDataReader as a source

While using a DataReader source, the data to post to the queue is saved to a temporary folder whose default location is `<Temp Path>\Ingestions_<current date and time>`. This folder is always deleted after the data has been successfully posted to the queue.
In the `IngestFromDataReader` and `IngestFromDataReaderAsync` methods, the `retainCsvOnFailure` flag, whose default value is `false`, determines whether the files should be kept after a failed ingestion. If this flag is set to `false`, data that fails the ingestion won't be persisted, making it hard to understand what went wrong.

### Common Failures

|Error                         |Reason           |Mitigation                                   |
|------------------------------|-----------------|---------------------------------------------|
|Database \<database name> name doesn't exist| The database doesn't exist|Check the database name at `kustoIngestionProperties`/Create the database |
|Entity 'table name that doesn't exist' of kind 'Table' wasn't found.|The table doesn't exist and there's no CSV mapping.| Add CSV mapping / create the required table |
|Blob \<blob path> excluded for reason: JSON pattern must be ingested with jsonMapping parameter| JSON ingestion when no JSON mapping is provided.|Provide a JSON mapping |
|Failed to download blob: 'The remote server returned an error: (404) Not Found.'| The blob doesn't exist.|Verify that the blob exists. If it exists, retry and contact the Kusto team |
|JSON column mapping isn't valid: Two or more mapping elements point to the same column.| JSON mapping has 2 columns with different paths|Fix JSON mapping |
|EngineError - [UtilsException] `IngestionDownloader.Download`: One or more files failed to download (search KustoLogs for ActivityID:\<GUID1>, RootActivityId:\<GUID2>)| One or more files failed to download. |Retry |
|Failed to parse: Stream with ID '\<stream name>' has a malformed CSV format, failing per ValidationOptions policy |Malformed CSV file (such as, not having the same number of columns on every line). Fails only when validation policy is set to `ValidationOptions.ValidateCsvInputConstantColumns`. |Check your CSV files. This message applies only to CSV/TSV files |
|`IngestClientAggregateException` with error message 'Missing mandatory parameters for valid Shared Access Signature' |The SAS being used is of the service, and not of the storage account |Use the SAS of the storage account |

### Ingestion error codes

To help handle ingestion failures programmatically, failure information is enriched with a numeric error code (`IngestionErrorCode enumeration`).

For a full list of ingestion error codes, see [Ingestion Error codes](../../../error-codes.md).

## Detailed exceptions reference

### CloudQueuesNotFoundException

Raised when no queues were returned from the Data Management cluster

Base Class: [Exception](/dotnet/api/system.exception)

|Field Name |Type     |Meaning
|-----------|---------|------------------------------|
|Error      | `string` | The error that occurred while attempting to retrieve queues from the DM

Relevant only when using the [Kusto Queued Ingest Client](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient).
During the ingestion process, several attempts are made to retrieve the Azure Queues linked to the DM. When these attempts fail, the exception containing the reason for failure, is raised in the 'Error' field. Possibly an inner exception in the 'InnerException' field is also raised.

### CloudBlobContainersNotFoundException

Raised when no blob containers were returned from the Data Management cluster

Base Class: [Exception](/dotnet/api/system.exception)

|Field Name   |Type     |Meaning|
|-------------|---------|------------------------------|
|KustoEndpoint| `string` | The endpoint of the relevant DM

Relevant only when using the [Kusto Queued Ingest Client](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient).  
When ingesting sources that aren't already in an Azure container, such as files, DataReader, or Stream, then the data uploads to a temporary blob for ingestion.
The exception is raised when there are no containers found to upload the data to.

### DuplicateIngestionPropertyException

Raised when an ingestion property is configured more than once

Base Class: [Exception](/dotnet/api/system.exception)

|Field Name   |Type     |Meaning|
|-------------|---------|------------------------------------|
|PropertyName | `string` | The name of the duplicate property

### PostMessageToQueueFailedException

Raised when posting a message to the queue fails

Base Class: [Exception](/dotnet/api/system.exception)

|Field Name   |Type     |Meaning|
|-------------|---------|---------------------------------|
|QueueUri     | `string` | The URI of the queue
|Error        | `string` | The error message that was generated while attempting to post to the queue

Relevant only when using the [Kusto Queued Ingest Client](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient).  
The queued ingest client ingests data by uploading a message to the relevant Azure queue. If there's a post failure, the exception is raised. It will contain the queue URI, the reason for the failure in the 'Error' field, and possibly an inner exception in the 'InnerException' field.

### DataFormatNotSpecifiedException

Raised when a data format is required but not specified in `IngestionProperties`

Base Class: IngestClientException

When ingesting from a Stream, a data format must be specified in the [IngestionProperties](kusto-ingest-client-reference.md#class-kustoingestionproperties), to properly ingest the data. This exception is raised when the `IngestionProperties.Format` isn't
specified.

### InvalidUriIngestClientException

Raised when an invalid blob URI is submitted as an ingestion source

Base Class: IngestClientException

### CompressFileIngestClientException

Raised when the ingest client fails to compress the file provided for ingestion

Base Class: IngestClientException

Files are compressed before their ingestion. The exception is raised when an attempt to compress the file fails.

### UploadFileToTempBlobIngestClientException

Raised when the ingest client fails to upload the source provided for ingestion to a temporary blob

Base Class: IngestClientException

### SizeLimitExceededIngestClientException

Raised when an ingestion source is too large

Base Class: IngestClientException

|Field Name   |Type     |Meaning|
|-------------|---------|-----------------------|
|Size         | `long` | The size of the ingestion source
|MaxSize      | `long` | The maximal size allowed for ingestion

If an ingestion source exceeds the maximal size of 4GB, then the exception is thrown. The size validation can be overridden by the `IgnoreSizeLimit` flag in the [IngestionProperties class](kusto-ingest-client-reference.md#class-kustoingestionproperties). However, we don't recommend ingesting single sources larger than 1 GB. For more information, see [Kusto Ingest best practices](kusto-ingest-best-practices.md).

### UploadFileToTempBlobIngestClientException

Raised when the ingest client fails to upload the file provided for ingestion to a temporary blob

Base Class: IngestClientException

### DirectIngestClientException

Raised when a general error occurs while doing a direct ingestion

Base Class: IngestClientException

### QueuedIngestClientException

Raised when an error occurs while doing a queued ingestion

Base Class: IngestClientException

### IngestClientAggregateException

Raised when one or more errors occur during an ingestion

Base Class: [AggregateException](/dotnet/api/system.aggregateexception)

|Field Name      |Type                             |Meaning|
|----------------|---------------------------------|-----------------------|
|IngestionErrors | IList\<IngestClientException>    | The errors that occur while attempting to ingest, and the sources related to them
|IsGlobalError   | `bool` | Indicates whether the exception occurred for all sources
