---
title: Kusto.Ingest Reference - Errors and Exceptions - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.Ingest Reference - Errors and Exceptions in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/30/2019
---
# Kusto.Ingest Reference - Errors and Exceptions
Any error during the ingestion handling on the client side is exposed to the user code via a C# exception.

## Failures Overview

### KustoDirectIngestClient Exceptions
While attempting to ingest from multiple sources, errors might occur during the ingestion of some of those sources, while others may be ingested successfully. 
If an ingestion fails for a particular source, it is logged and the client continues to ingest the remaining sources for the ingestion. 
After going over all sources for ingestion, an `IngestClientAggregateException` is thrown, containing a member `IList<IngestClientException> IngestionErrors`.
`IngestClientException` and its derived classes contain a field `IngestionSource` and an `Error` field that together form a mapping from the source that failed to be ingested to the error that occurred while attempting to ingest it. One can use the information in the IngestionErrors list to investigate which sources failed to be ingested and why. `IngestClientAggregateException` exception also contains a boolean property `GlobalError`, that indicates whether an error occurred for all sources.

### Failures Ingesting From Files or Blobs 
If an ingestion failure occurred while attempting to ingest from blob\file, the ingestion sources are not deleted, even if the `deleteSourceOnSuccess` flag is set to `true`.
The sources are preserved for further analysis. Once understanding the origin of the error and given that the error did not originate from the ingestion source itself, 
the user of the client may attempt to re-ingest it.

### Failures Ingesting From IDataReader
While ingesting from DataReader, the data to ingest is saved to a temporary folder whose default location is `<Temp Path>\Ingestions_<current date and time>`. 
This folder is always deleted after a successful ingestion.<BR>
In the `IngestFromDataReader` and `IngestFromDataReaderAsync` methods, the `retainCsvOnFailure` flag, whose default value is `false`, determines whether the files should be kept after a failed ingestion. If this flag is set to `false`, data that fails the ingestion would not be persisted, making it hard to understand what went wrong.

## KustoQueuedIngestClient Exceptions
KustoQueuedIngestClient ingests data by uploading messages to an Azure queue. If any error occurs before and during the queueing process, an `IngestClientAggregateException`
is thrown at the end of the execution with a collection of `IngestClientException` that contains the source that was not posted to the queue (for every failure) and the error that occurred 
while attempting to post the message.

### Posting to Queue Failures With File or Blob as a Source
If an error occurred while using KustoQueuedIngestClient's IngestFromFile/IngestFromBlob methods, the sources are not deleted, even if the `deleteSourceOnSuccess` flag is set to `true`, but are rather preserved for further analysis. Once understanding the origin of the error and given that the error did not originate from the source itself, 
the user of the client may attempt to re-queue the data by using the relevant IngestFromFile/IngestFromBlob methods with the failed source. 

### Posting to Queue Failures With IDataReader as a Source
While using a DataReader source, the data to post to the queue is saved to a temporary folder whose default location is `<Temp Path>\Ingestions_<current date and time>`.
This folder is always deleted after the data has been successfully posted to the queue.
In the `IngestFromDataReader` and `IngestFromDataReaderAsync` methods, the `retainCsvOnFailure` flag, whose default value is `false`, determines whether the files should be kept after a failed ingestion. If this flag is set to `false`, data that fails the ingestion would not be persisted, making it hard to understand what went wrong.

### Common Failures
|Error|Reason|Mitigation|
|------------------------------|----|------------|
|Database <database name> name doesn't exist| The database does not exist|Check the database name at kustoIngestionProperties/Create the database |
|Entity 'table name that doesn't exist' of kind 'Table' was not found.|The table doesn't exist and there is no CSV mapping.| Add CSV mapping / create the required table |
|Blob <blob path> excluded for reason: json pattern must be ingested with jsonMapping parameter| Json ingestion when no json mapping provided.|Provide a JSON mapping |
|Failed to download blob: 'The remote server returned an error: (404) Not Found.'| The blob does not exist.|Verify the blob exists, if exists retry and contact the Kusto team |
|Json column mapping is not valid: two or more mapping elements point to the same column.| JSON mapping has 2 columns with different paths|Fix JSON mapping |
|EngineError - [UtilsException] IngestionDownloader.Download: One or more files failed to download (search KustoLogs for ActivityID:<GUID1>, RootActivityId:<GUID2>)| One or more files failed to download. |Retry |
|Failed to parse: Stream with id '<stream name>' has a malformed Csv format, failing per ValidationOptions policy |Malformed csv file (e.g., not the same number of columns on every line). Fails only when validation policy is set to ValidationOptions. ValidateCsvInputConstantColumns |Check your csv files. This message apply only on csv/tsv files |
|IngestClientAggregateException with error message 'Missing mandatory parameters for valid Shared Access Signature' |The SAS being used is of the service, and not of the storage account |Use the SAS of the storage account |

### Ingestion Error Codes

To help handle ingestion failures programmatically, failure information is enriched with a numeric error code (IngestionErrorCode enumeration).

|ErrorCode|Reason|
|-----------|-------|
|Unknown| Unknown error occurred|
|Stream_LowMemoryCondition| Operation ran out of memory|
|Stream_WrongNumberOfFields| CSV document has inconsistent number of fields|
|Stream_InputStreamTooLarge| The document submitted for ingestion has exceeded the allowed size|
|Stream_NoDataToIngest| Found no data streams to ingest|
|Stream_DynamicPropertyBagTooLarge| One of the dynamic columns in the ingested data contains too many unique properties|
|Download_SourceNotFound| Failed to download source from Azure storage - source not found|
|Download_AccessConditionNotSatisfied| Failed to download source from Azure storage - access denied|
|Download_Forbidden| Failed to download source from Azure storage - access forbidden|
|Download_AccountNotFound| Failed to download source from Azure storage - account not found|
|Download_BadRequest| Failed to download source from Azure storage - bad request|
|Download_NotTransient| Failed to download source from Azure storage - not transient error|
|Download_UnknownError| Failed to download source from Azure storage - unknown error|
|UpdatePolicy_QuerySchemaDoesNotMatchTableSchema| Failed to invoke update policy. Query schema does not match table schema|
|UpdatePolicy_FailedDescendantTransaction| Failed to invoke update policy. Failed descendant transactional update policy|
|UpdatePolicy_IngestionError| Failed to invoke update policy. Ingestion Error occurred|
|UpdatePolicy_UnknownError| Failed to invoke update policy. Unknown error occurred|
|BadRequest_MissingJsonMappingtFailure| Json pattern did not ingested with jsonMapping parameter|
|BadRequest_InvalidOrEmptyBlob| Blob is invalid or empty zip archive|
|BadRequest_DatabaseNotExist| Database does not exist|
|BadRequest_TableNotExist| Table does not exist|
|BadRequest_InvalidKustoIdentityToken| Invalid kusto identity token|
|BadRequest_UriMissingSas| Blob path without SAS from unknown blob storage|
|BadRequest_FileTooLarge| Trying to ingest too large file|
|BadRequest_NoValidResponseFromEngine| No valid reply from ingest command|
|BadRequest_TableAccessDenied| Access to table is denied|
|BadRequest_MessageExhausted| Message is exhausted|
|General_BadRequest| General bad request (may hint for ingestion to non existing Database/Table)|
|General_InternalServerError| Internal server error occurred|

## Detailed Kusto.Ingest Exceptions Reference

### CloudQueuesNotFoundException
Raised when no queues were returned from the Data Management cluster

Base Class: [Exception](https://msdn.microsoft.com/library/system.exception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning
|-----------|----|------------------------------|
|Error| `String`| The error that occurred while attempting to retrieve queues from the DM
                            
Additional information:

Relevant only when using the [Kusto Queued Ingest Client](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient).
During the ingestion process several attempts are made to retrieve the Azure Queues linked to the DM. When these attempts fail, the exception is raised containing the
reason for failure in the 'Error' field and possibly an inner exception in the 'InnerException' field.


### CloudBlobContainersNotFoundException
Raised when no blob containers were returned from the Data Management cluster

Base Class: [Exception](https://msdn.microsoft.com/library/system.exception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|KustoEndpoint| `String`| The endpoint of the relevant DM
                            
Additional information:

Relevant only when using the [Kusto Queued Ingest Client](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient).  
When ingesting sources that are NOT already in an Azure container - i.e. files, DataReader or Stream, the data is uploaded to a temporary blob for ingestion. 
The exception is raised when there are no containers found to upload the data to.

### DuplicateIngestionPropertyException
Raised when an ingestion property is configured more than once

Base Class: [Exception](https://msdn.microsoft.com/library/system.exception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|PropertyName| `String`| The name of the duplicate property
                            
### PostMessageToQueueFailedException
Raised when posting a message to queue failed

Base Class: [Exception](https://msdn.microsoft.com/library/system.exception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|QueueUri| `String`| The URI of the queue
|Error| `String`| The error message that was generated while attempting to post to queue
                            
Additional information:

Relevant only when using the [Kusto Queued Ingest Client](kusto-ingest-client-reference.md#interface-ikustoqueuedingestclient).  
The queued ingest client ingests data by uploading a message to the relevant Azure Queue. In case of a post failure, the exception is raised containing the queue URI, the
reason for failure in the 'Error' field and possibly an inner exception in the 'InnerException' field.

### DataFormatNotSpecifiedException
Raised when data format is required but not specified in IngestionProperties

Base Class: IngestClientException

Additional information:

When ingesting from a Stream, a data format must be specified in the [IngestionProperties](kusto-ingest-client-reference.md#class-kustoingestionproperties) in order to properly ingest the data. This exception is raised when the IngestionProperties.Format is not
specified.

### InvalidUriIngestClientException
Raised when an invalid blob URI was submitted as an ingestion source

Base Class: IngestClientException

### CompressFileIngestClientException
Raised when the ingest client failed to compress the file provided for ingestion

Base Class: IngestClientException

Additional information:

Files are compressed prior to their ingestion. This exception is raised when an attempt to compress the file failed.

### UploadFileToTempBlobIngestClientException
Raised when the ingest client failed to upload the source provided for ingestion to a temporary blob

Base Class: IngestClientException

### SizeLimitExceededIngestClientException
Raised when an ingestion source is too large

Base Class: IngestClientException

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|Size| `long`| The size of the ingestion source
|MaxSize| `long`| The maximal size allowed for ingestion

Additional information:

If an ingestion source exceeds the maximal size of 4GB, the exception is thrown. The size validation can be overridden by the IgnoreSizeLimit
flag in the [IngestionProperties class](kusto-ingest-client-reference.md#class-kustoingestionproperties), however it is not recommended 
[to ingest single sources larger than 1 GB](about-kusto-ingest.md#ingestion-best-practices).

### UploadFileToTempBlobIngestClientException
Raised when the ingest client failed to upload the file provided for ingestion to a temporary blob

Base Class: IngestClientException

### DirectIngestClientException
Raised when a general error occurred while performing a direct ingestion

Base Class: IngestClientException

### QueuedIngestClientException
Raised when an error occurred while performing a queued ingestion

Base Class: IngestClientException

### IngestClientAggregateException
Raised when one or more errors occurred during an ingestion

Base Class: [AggregateException](https://msdn.microsoft.com/library/system.aggregateexception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|IngestionErrors| `IList<IngestClientException>`| The errors that occurred while attempting to ingest and the sources related to them
|IsGlobalError| `bool`| Indicates whether the exception occurred for all sources

## Errors in native code
The Kusto engine is written in native code. For details about errors in native code, please see [Errors in native code](../../concepts/errorsinnativecode.md)