---
title: Errors and Exceptions - Azure Kusto | Microsoft Docs
description: This article describes Errors and Exceptions in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Errors and Exceptions

Kusto indicates errors in the following ways:
1. When using the Kusto Client Libraries, exceptions are thrown.
2. When using the REST API directly, errors are indicated
   by returning 4xx or 5xx HTTP status codes.

## Exceptions 

### Kusto.Ingest Exceptions
#### CloudQueuesNotFoundException
Raised when no queues were returned from the Data Management cluster

Base Class: [Exception](https://msdn.microsoft.com/en-us/library/system.exception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning
|-----------|----|------------------------------|
|Error| `String`| The error that occurred while attempting to retrieve queues from the DM
                            
Additional information

Relevant only when using the [Kusto Queued Ingest Client](kusto-ingest-client-reference.md#class-kustoqueuedingestclient).
During the ingestion process several attempts are made to retrieve the Azure Queues linked to the DM. When these attempts fail, the exception is raised containing the
reason for failure in the 'Error' field and possibly an inner exception in the 'InnerException' field.


#### CloudBlobContainersNotFoundException
Raised when no blob containers were returned from the Data Management cluster

Base Class: [Exception](https://msdn.microsoft.com/en-us/library/system.exception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|KustoEndpoint| `String`| The endpoint of the relevant DM
                            
Additional information

Relevant only when using the [Kusto Queued Ingest Client](kusto-ingest-client-reference.md#class-kustoqueuedingestclient).  
When ingesting sources that are NOT already in an Azure container - i.e. files, DataReader or Stream, the data is uploaded to a temporary blob for ingestion. 
The exception is raised when there are no containers found to upload the data to.

#### DuplicateIngestionPropertyException
Raised when an ingestion property is configured more than once

Base Class: [Exception](https://msdn.microsoft.com/en-us/library/system.exception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|PropertyName| `String`| The name of the duplicate property
                            
#### PostMessageToQueueFailedException
Raised when posting a message to queue failed

Base Class: [Exception](https://msdn.microsoft.com/en-us/library/system.exception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|QueueUri| `String`| The URI of the queue
|Error| `String`| The error message that was generated while attempting to post to queue
                            
Additional information

Relevant only when using the [Kusto Queued Ingest Client](kusto-ingest-client-reference.md#class-kustoqueuedingestclient).  
The queued ingest client ingests data by uploading a message to the relevant Azure Queue. In case of a post failure, the exception is raised containing the queue URI, the
reason for failure in the 'Error' field and possibly an inner exception in the 'InnerException' field.

#### IngestClientException
Raised when an error occurred for an ingestion source

Base Class: [Exception](https://msdn.microsoft.com/en-us/library/system.exception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|IngestionSourceId| `Guid?`| The identifier of the source that generated the error
|IngestionSource| `String`| The source that generated the error
|Error| `String`| The error message that was generated while processing the source

#### DataFormatNotSpecifiedException
Raised when data format is required but not specified in IngestionProperties

Base Class: IngestClientException

Additional information

When ingesting from a Stream, a data format must be specified in the [IngestionProperties](kusto-ingest-client-reference.md#class-kustoingestionproperties) in order to properly ingest the data. This exception is raised when the IngestionProperties.Format is not
specified.

#### InvalidUriIngestClientException
Raised when an invalid blob URI was submitted as an ingestion source

Base Class: IngestClientException

#### CompressFileIngestClientException
Raised when the ingest client failed to compress the file provided for ingestion

Base Class: IngestClientException

Additional information

Files are compressed prior to their ingestion. This exception is raised when an attempt to compress the file failed.

#### UploadFileToTempBlobIngestClientException
Raised when the ingest client failed to upload the source provided for ingestion to a temporary blob

Base Class: IngestClientException

#### SizeLimitExceededIngestClientException
Raised when an ingestion source is too large

Base Class: IngestClientException

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|Size| `long`| The size of the ingestion source
|MaxSize| `long`| The maximal size allowed for ingestion

Additional information

If an ingestion source exceeds the maximal size of 4GB, the exception is thrown. The size validation can be overriden by the IgnoreSizeLimit
flag in the [IngestionProperties class](kusto-ingest-client-reference.md#class-kustoingestionproperties), however it is not recommended 
[to ingest single sources larger than 1 GB](kusto-ingest-client-library.md#ingestion-best-practices).

#### UploadFileToTempBlobIngestClientException
Raised when the ingest client failed to upload the file provided for ingestion to a temporary blob

Base Class: IngestClientException

#### DirectIngestClientException
Raised when a general error occurred while performing a direct ingestion

Base Class: IngestClientException

#### QueuedIngestClientException
Raised when an error occurred while performing a queued ingestion

Base Class: IngestClientException

#### IngestClientAggregateException
Raised when one or more errors occurred during an ingestion

Base Class: [AggregateException](https://msdn.microsoft.com/en-us/library/system.aggregateexception(v=vs.110).aspx)

Fields:

|Name|Type|Meaning       
|-----------|----|------------------------------|
|IngestionErrors| `IList<IngestClientException>`| The errors that occurred while attempting to ingest and the sources related to them
|IsGlobalError| `bool`| Indicates whether the exception occurred for all sources

Additional information

For more information regarding the IngestClientAggregateException please refer [here](kusto-ingest-client-errors.md).

## Errors in Native Code

The Kusto engine is written in native code, and reports errors
by using negative `HRESULT` values. While normally these are not
surfaces through a programmatic API, one might catch a rare
sighting of them; for example, operation failures might have
a status of "`Exception from HRESULT:` *HRESULT-CODE*".

Kusto native error codes are defined using Windows'
`MAKE-HRESULT` macro with:
* Severity set to `1`
* Facility set to `0xDA`
  
The following error codes are defined:

|Manifest constant             |Code|Value       |Meaning                                                            |
|------------------------------|----|------------|-------------------------------------------------------------------|
|`E_EXTENT_LOAD_FAILED`        | `0` |`0x80DA0000`|A data shard could not be loaded                                   |
|`E_RUNAWAY_QUERY`             | `1` |`0x80DA0001`|Query execution aborted as it exceeded its allowed resources       |
|`E_STREAM_FORMAT`             | `2` |`0x80DA0002`|A data stream cannot be parsed as it is badly formatted            |
|`E_QUERY_RESULT_SET_TOO_LARGE`| `3` |`0x80DA0003`|The result set for this query exceed its allowed record/size limits|
|`E_STREAM_ENCODING_VERSION`   | `4` |`0x80DA0004`|A result stream cannot be parsed as its version is unknown         |
|`E_KVDB_ERROR`                | `5` |`0x80DA0005`|Failure to perform a key/value database operation                  |
|`E_QUERY_CANCELLED`           | `6` |`0x80DA0006`|Query was cancelled                                                |
|`E_LOW_MEMORY_CONDITION`      | `7` |`0x80DA0007`|Operation was aborted due to process' available memory running low |
|`E_WRONG_NUMBER_OF_FIELDS`    | `8` |`0x80DA0008`|A CSV document submitted for ingestion has a record with the wrong number of fields (relative to other records)|
|`E_INPUT_STREAM_TOO_LARGE`    | `9` |`0x80DA0009`|The document submitted for ingestion has exceeded the allowed length|
|`E_ENTITY_NOT_FOUND`          | `10`|`0x80DA000A`|The requested entity was not found|
|`E_CLOSING_QUOTE_MISSING`     | `11`|`0x80DA000B`|A CSV document submitted for ingestion has a field with a missing quote|
|`E_OVERFLOW`                  | `12`|`0x80DA000C`|Represents an arithmetic overflow error (the result of a computation is too large for the destination type)|