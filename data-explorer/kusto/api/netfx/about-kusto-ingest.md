---
title: Kusto Ingest Client Library - Azure Kusto | Microsoft Docs
description: This article describes Kusto Ingest Client Library in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto Ingest Client Library

## Overview
Kusto.Ingest library is a .NET 4.5.1 library that allows to send data to Kusto service.
Takes dependencies on the following libraries and SDKs:
* ADAL for AAD Authentication
* Azure Storage Client
* [TBD: complete list of external dependencies]

Kusto ingestion methods are defined by [IKustoIngestClient](kusto-ingest-client-reference.md#interface-ikustoingestclient) interface and allow data ingestion from Stream, IDataReader, local file(s), and Azure blob(s) in both synchronous and asynchronous modes.

## Ingest Client Flavors
Conceptually, there are two basic flavors of Ingest client: Queued and Direct

### Queued Ingestion
Implemented by [KustoQueuedIngestClient](kusto-ingest-client-reference.md#class-kustoqueuedingestclient), this mode limits the client code dependency on the Kusto service. Ingestion is performed by posting a Kusto ingestion message to an Azure queue, which, in turn is acquired from Kusto Data Management (a.k.a. Ingestion) service. Any intermediate storage artifacts will be created by the ingest client using the resources allocated by Kusto Data Management service.<BR>

**Advantages of the Queued mode** include (but are not limited to):
* Decoupling of the data ingestion process from the Kusto Engine service
* Allows ingestion requests to be persisted when the Kusto Engine (or Ingestion) service is unavailable
* Allows efficient and controllable aggregation of inbound data by the Ingestion service, thus improving performance
* Allows the Kusto Ingestion service to manage ingestion load on the Kusto Engine service
* Kusto Ingestion service will retry as needed on transient ingestion failures (e.g., XStore throttling)
* Provides a convinient mechanism to track the progress and outcome of every ingestion request

The following diagram outlines the Queued ingestion client interaction with Kusto:<BR>

![alt text](../images/queued-ingest.jpg "queued-ingest")

### Direct Ingestion
Implemented by [KustoDirectIngestClient](kusto-ingest-client-reference.md#class-kustodirectingestclient), this mode forces direct interaction with the Kusto Engine service. In this mode Kusto Ingestion service plays no moderative or managerial role. Every ingestion request in Direct mode is eventually translated into `.ingest` command executed directly on Kusto Engine service.<BR>
The following diagram outlines the Direct ingestion client interaction with Kusto:<BR>

![alt text](../images/direct-ingest.jpg "direct-ingest")

>The Direct mode is not recommended for production grade ingestion solutions.

**Advantages of the Direct mode** include:
* Low latency (there is no aggregation). However, low latency can also be achieved with Queued ingestion
* When synchronous methods are used, method completion indicates the end of the ingestion operation

**Disadvantages of the Direct mode** include:
* The client code must implement any retry or error handling logic
* Ingestions are impossible when the Kusto Engine service is unavailable
* The client code might overwhelm the Kusto Engine service with ingestion requests, as it is not aware of the Engine service capacity

## Ingestion Best Practices

### General
[Ingestion best practices](kusto-ingest-best-practices.md) provides COGs and throughput POV on ingestion.

### Thread Safety
> Kusto Ingest Client implementations are thread-safe and intended to be reused. There is no need to create an instance of `KustoQueuedIngestClient` class for each or even several ingest operations. A single instance of `KustoQueuedIngestClient` is required per target Kusto cluster per user process. In fact, running multiple instances is counter productive and may DoS the Data Management cluster.

### Supported Data Formats
When using native ingestion, the data to be ingested is be uploaded (if not already there) to  one or more Azure Storage Blobs. Currently supported blob formats are documented in the [Supported Data Formats](https://kusdoc2.azurewebsites.net/docs/concepts/data-ingestion.html#supported-data-formats) section.

### Schema Mapping
[Schema mappings](https://kusdoc2.azurewebsites.net/docs/concepts/data-ingestion.html#schema-mapping) help deterministically bind source data fields to destination table columns.

## Usage and Further Reading
* As described above, the recommended basis for sustainable and high scale ingestion solutions for Kusto should be the **KustoQueuedIngestClient**.
* In order to minimize unnecessary load on your Kusto service, it is recommended that a single instance of Kusto Ingest client (Queued or Direct) is used per process per Kusto cluster. Kusto Ingest client implementation is thread safe and fully reentrant.

### Ingestion Permissions
* [Kusto Ingestion Permissions](kusto-ingest-client-permissions.md) explains permissions setup required for a successful ingestion using Kusto.Ingest package

### Kusto.Ingest Library Reference
* [Kusto.Ingest Client Reference](kusto-ingest-client-reference.md) contains a complete reference of Kusto ingest client interfaces and implementations.<BR>There you will find the information on how to create ingest clients, augment ingestion requests, manage ingestion progress and more
* [Kusto.Ingest Operation Status](kusto-ingest-client-status.md) explains **KustoQueuedIngestClient** facilities for tracking ingestion status
* [Kusto.Ingest Errors](kusto-ingest-client-errors.md) documents Kusto Ingest Client errors and exceptions
* [Kusto.Ingest Examples](kusto-ingest-client-examples.md) presents code snippets demonstrating various techniques of ingesting data into Kusto

### Data Ingestion REST APIs
[Data Ingestion without Kusto.Ingest Library](kusto-ingest-client-rest.md) explains how to implement Queued Kusto ingestion utilizing Kusto REST APIs and without taking dependency on Kusto.Ingest library.

<#idfef MICROSOFT>## Changelog
```text
Version 4.0.2-beta (05 AUG 2018)
* Use priority ranked resources in ingest client

Version 4.0.0 (19 JUL 2018)
* Upgrade WindowsAzure.Storage to version 9.3.0

Version 3.1.4 (15 JUL 2018)
* Bug fix: fix a memory leak when performing dSTS-based authentication.

Version 3.1.3 (09 JUL 2018)
* Better error messages for AAD Application authentication
* Support for overriding dSTS namespace expansion in app.config
* Refactored FileWatchIngestor class (breaking change)
* Removed the obsolete IIngestClient

Version 3.1.2 (17 JUN 2018)
* Upgrade ADAL's version from 3.19.4 to 3.19.8

Version 3.1.1 (10 JUN 2018)
* Introducing Kusto managed streaming ingest client

Version 3.1.0 (04 JUN 2018)
* Upgrade ADAL's version from 3.16.1 to 3.19.4 in order to support AAD application authentication by subject and issuer names (additional information: http://aadwiki/index.php?title=Subject-Name-and-Issuer-Authentication).
* Support dMSI-based authentication.

Version 3.0.20 (22 MAR 2018)
* Bug fix: Support future ingestion error codes.

Version 3.0.19 (21 MAR 2018)
* Kusto.Cloud.Platform.Data.ExtendedDataReader: add support for writing collections to CSV files.

Version 3.0.18 (22 FEB 2018)
* Ingestion properties: adding support for AVRO mapping and mapping-reference.

Version 3.0.17 (1 FEB 2018)
* Include missing assemblies in package.
* Change the upload method for streams which are smaller than 8 MB, leading to reduction of storage transactions, and reduction of costs.
* Ingestion properties: adding ‘IgnoreFirstRecord’ property.

Version 3.0.15 (30 JAN 2018)
* Performance improvement in Kusto Queued Ingest Client

Version 3.0.14 (31 DEC 2017)
* Upgrade depenedency of Kusto.Client to version 3.0.14

Version 3.0.13 (08 NOV 2017)
* Add support for EntityNotFoundException.

Version 3.0.12 (20 OCT 2017)
* Presence of IngestBy or IngestIfNotExists tags will force ingesting DataReader as a single bulk

Version 3.0.11 (01 OCT 2017)
* Support explicit authority ID for AAD user authentication scenario.

Version 3.0.10 (13 SEP 2017)
* Fix hang when issuing multiple async requests requiring AAD authentication

Version 3.0.9 (12 SEP 2017):
* Fix ADAL reference to version 3.16.1.

Version 3.0.8 (11 SEP 2017):
* Add client ingest version to rest client header

Version 3.0.7 (10 SEP 2017):
* Upgrade ADAL's version from 3.12.0 to 3.16.1

Version 3.0.6 (06 SEP 2017):
* Support Windows Hello for dSTS-based authentication (for Microsoft internal principals)

Version 3.0.5 (08 AUG 2017):
* Bug fix: Update Newtonsoft.Json dependency to version 10.0.3.

Version 3.0.4 (06 AUG 2017):
* FileWatchIngestor: supporting multiple queues.

Version 3.0.3 (17 JULY 2017):
* Bug fix: Race condition in TraceSourceBase<> static construction.

Version 3.0.2 (13 JULY 2017):
* Exposing the QueueRetryPolicy property in IKustoQueuedIngestClient

Version 3.0.1 (05 JULY 2017):
* Fix Microsoft.WindowsAzure.Storage dependency declaration

Version 3.0.0 (05 JULY 2017):
* Upgrade Newtonsoft.Json to version 10.0.3 and Microsoft.WindowsAzure.Storage to version 8.1.4
* Making KustoQueuedIngestClient and KustoDirectIngestClient internals. Clients from now on should be created thru KustoIngestFactory.

Version 2.6.1 (03 JULY 2017):
* Added IKustoQueuedIngestClient interface

Version 2.6.0 (02 JUL 2017):
* Bug fix - .tt file breaks package

Version 2.5.13 (30 JUNE 2017):
* Bug fix: NuGet puts too much in a package

Version 2.5.12 (20 JUNE 2017):
* Bug fix - fix hang when running inside 'Orleans' framework

Version 2.5.11 (15 JUNE 2017):
* Bug Fix: Increased estimated gz/zip compression ratio for raw size from 5 to 11.
* Improve refreshing resources logic.
* KustoIngestionProperties: CsvMapping/JsonMapping objects serialization will be done with DefaultValueHandling.Ignore serializer setting.

Version 2.5.10 (23 MAY 2017):
* Add streaming ingestion capabilites to the Kust.Ingest client library

Version 2.5.9 (22 MAY 2017):
* KCSB - block sending corporate credentials when using basic authentication.

Version 2.5.8 (7 MAY 2017):
* Extend kusto ingestion error codes with 'NoError'.

Version 2.5.7 (27 APR 2017):
* Add kusto ingestion error codes.
* Handle SyntaxError exceptions and optimize the call for 'show version'.

Version 2.5.6 (09 APR 2017):
* Bug fix - support AAD token acquisition based-on application client ID and certificate thumbprint.

Version 2.5.5 (29 MAR 2017):
* Change ingestion queue reference in internal resource manager.
* Add Kusto Connection String validation. 

Version 2.5.4 (16 MAR 2017):
* Target client library to .net 4.5 to enable customers that cannot use higher versions to use Kusto client.
* Fix blob size estimation when uri is of a non-SAS type.
* Initialize all reference-type properties in KustoIngestionProperties's ctor.

Version 2.5.3 (09 MAR 2017):
* Extend Azure Table ingestion status retrievals to support later versions of Microsoft.WindowsAzure.Storage.

Version 2.5.2 (08 MAR 2017):
* Extend Azure Table ingestion status reports to support cases where a large DataReader is provided as an ingestion source.

Version 2.5.1 (22 FEB 2017):
* Added activity id to ingest client API.

Version 2.5.0 (13 FEB 2017):
* Support AAD Multi-Tenant access to Kusto for applications.

Version 2.4.9 (12 FEB 2017):
* Support AAD Multi-Tenant access to Kusto.

Version 2.4.8 (12 FEB 2017):
* Support 'Ingestor' access permission level.

Version 2.4.7 (07 FEB 2017):
* Add support for Azure Table ingestion status reports.

Version 2.4.6 (31 JAN 2017):
* Kusto clients version alignment.

Version 2.4.5 (08 JAN 2017):
* Bug fix: In caching of ingestion queues and temporary storages.

Version 2.4.4 (03 JAN 2017):
* This version has been unlisted due to an issue with one of its underlying dependencies.

Version 2.4.3 (19 DEC 2016):
* Support multiple ingestions status queues.

Version 2.4.2 (24 NOV 2016):
* Extend Azure Storage retry policy in order to handle IO exceptions.

Version 2.4.1 (16 NOV 2016):
* Extend Azure Storage retry policy in order to handle web and socket exceptions.

Version 2.4.0 (16 NOV 2016):
* Support Multi-Factor Authentication enforcement for AAD-based authentication.

Version 2.3.11 (19 OCT 2016):
* Add ability to control MaximumFreeLargePoolBytes and MaximumFreeSmallPoolBytes of RecyclableMemoryStreamManager

Version 2.3.10 (06 OCT 2016):
* Minor bug fix: properly dispose of intermediate streams in case of errors in IngestFromDataReader.

Version 2.3.9 (26 SEP 2016):
* Add DataReaderDescription and StreamDescription that support a source identifier that can be used to follow ingestion status.

Version 2.3.8 (22 SEP 2016):
* Fix potential deadlock in 'ExecuteQuery' when running in IIS.

Version 2.3.7 (20 SEP 2016):
* Fix potential deadlock during AAD token acquisition and ingestion from IDataReader or files.

Version 2.3.6 (18 SEP 2016):
* Support ingestion from MemoryStream.
* Extend blob and file descriptions to support a source identifier that can be used to follow ingestion status.
* Security bug fix (client credentials leak to traces).

Version 2.3.5 (5 SEP 2016):
* Support dSTS-based application authentication.

Version 2.3.4 (31 AUG 2016):
* Improve exceptions handling when trying to retrieve queues and containers from DM.

Version 2.3.3 (24 AUG 2016):
* Enable ingestion successes reporting when using KustoQueuedIngestClient.
* Support multiple versions of Windows Azure Storage package.

Version 2.3.2 (12 AUG 2016)
* Target client library to .net 4.5 to enable customers that cannot use higher versions to use Kusto client.

Version 2.3.1 (10 AUG 2016):
* Added methods in KustoIngestFactory to create KustoDirectIngestClient and KustoQueuedIngestClient.
* Marked IIngestClient and IngestClient as [Obsolete].

Version 2.3.0 (02 AUG 2016):
* Add .ConfigureAwait(false) in order to avoid potential deadlocks.
* Modify IngestClientAggregateException to inherit from AggregateException.

Version 2.2.9 (01 AUG 2016):
* Fix blobs removal bug in case of an empty IDataReader.
* Support file system based persistent storage.

Version 2.2.8 (24 JUL 2016):
* Fix UI potential deadlock during AAD token acquisition.

Version 2.2.7 (20 JUL 2016):
* Upgrade ADAL's version from 2.14.2011511115 to 3.12.0

Version 2.2.6 (19 JUL 2016):
* Supporting dSTS-based authentication for Microsoft internal principals. More details can be found at https://kusto.azurewebsites.net/docs/concepts/security-authn-dsts.html.

Version 2.2.5 (13 JUL 2016):
* Update IngestFromDataReader implementation: upload data to blobs directly (instead of using local files) when retainCsvOnFailure is false.
* Supporting DateTimeOffset data type when ingestion from DataReader.

Version 2.2.4 (10 JUL 2016):
* Add size validation for ingestion sources. Size limit is set to 4GB.
* Update IngestClientAggregateException implementation.

Version 2.2.3 (15 JUN 2016):
* Extend IKustoIngestClient to accept sizes when ingesting from blobs.
* Bug fix: Use an async implementation while estimating blob's size.

Version 2.2.2 (07 JUN 2016):
* Skip retries after getting a non-transient exception while trying to retrieve queues and containers from DM.
* Bug fix: Create a unique folder for each IDataReader ingestion.

Version 2.2.1 (08 MAY 2016):
* New: Improved error reporting - 
KustoDirectIngestClient – An IngestClientAggregateException exception is thrown in case of an ingestion failure.
KustoQueuedIngestClient – An IngestClientAggregateException exception is thrown in case of a post to queue failure.
```