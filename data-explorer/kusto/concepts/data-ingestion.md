---
title: Kusto Data Ingestion Overview - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto Data Ingestion Overview in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto Data Ingestion Overview

Data ingestion is the process by which data records from one or more data sources
are appended to a Kusto table and made available for query. This process requires
[Table or Database Ingestor permissions](../management/access-control/role-based-authorization.md) for the target
table or database.

This process consists of several steps:

1. Retrieving the data from the data source
2. Parsing and validating the data
3. Matching the schema of the data to the schema of the target Kusto table
4. Organizing the data in columns
5. Indexing the data
6. Encoding and compressing the data
7. Persisting the resulting Kusto storage artifacts in storage
8. Executing all relevant update policies, if any.
9. "Committing" the data ingest, thus making it available for query

(Some of the steps above may be skipped, depending on the details of the scenario.
For example, data ingested through the streaming ingestion endpoint skips steps
4, 5, 6, and 9 above; these are done in the background as the data is "groomed".
As another example, if the data source is the results of a Kusto query to the same
cluster, there's no need to parse and validate the data.)

> [!WARNING]
> Data ingested into a table in Kusto is subject to the table's effective **retention policy**.
> Unless set on a table explicitly, the effective retention policy is derived from
> the database's retention policy. Therefore, users ingesting data into Kusto should make sure
> that the database's retention policy is appropriate for their needs, and explicitly
> override it at the table level if not. Failure to do so might mean "silent" deletion of
> their data due to the database's retention policy. See [retention policy](https://kusto.azurewebsites.net/docs/concepts/retentionpolicy.html)
> for details.

## Ingestion Methods

Kusto supports a number of ingestion methods, each with its own target scenarios
and advantages/disadvantages:

1. **Inline ingestion**: A control command (`.ingest inline`) is sent to the Kusto engine, with the data included
   in the body of the command text. This method is primarily intended for ad-hoc testing
   purposes, and should not be used for production purposes.

2. **Ingest from query**: A control command (`.set`, `.set-or-append`, `.set-or-replace`)
   is sent to the Kusto engine, with the data specified indirectly as the results of a query.
   This method is useful for generating reporting tables out of raw data tables,
   or for creating small temporary tables for further analysis.

3. **Ingest from storage**: A control command (`.ingest into`) is sent to the
   Kusto engine, with the data stored in some external storage (e.g., Azure
   Blob Storage) accessible by the Kusto engine and pointed-to by the command.
   This method allows efficient bulk ingestion of data, but puts some burden on
   the client performing the ingestion (for example, the client must ensure that
   it doesn't "DDos" the Kusto engine by monitoring the ingestion capacity metric
   and slowing down appropriately).

4. **Streaming ingestion**: Data is sent to the Kusto engine over a special endpoint
   (the streaming ingestion endpoint) which allows efficient record-by-record
   ingestion. This method has an excellent ingestion-to-query-ability latency (a second or less),
   but should not be used for bulk ingestion due to its larger overhead.

5. **Queued ingestion**: Data is uploaded to external storage (e.g., Azure Blob
   Storage) and then a notification is sent to a queue (e.g., Azure Queue, or Event Hub).
   This is the primary method used in production, as it has very high availability,
   doesn't require the client to perform capacity management itself, and handles bulk
   appends well. This is sometimes called "native ingestion".



For the syntax of the control commands used for ingestion, please see the [data ingestion control commands](../management/data-ingest.md).



## Managed Ingestion Pipelines

Kusto can connect to the following Azure messaging services:

* [Azure Event Hub](./data-ingestion-eventhub.md) - allows to stream data directly into Kusto
* [Azure IoT Hub](./data-ingestion-eventhub.md) - allows to stream IoT data directly into Kusto
* [Azure Event Grid](./data-ingestion-eventgrid.md) - allows to set up notifications on blob creation events under specified storage account.
    These notifications will be delivered to Kusto via an Event Hub, and Kusto will ingest the blobs according to those notifications

## SDKs and OSS components

Kusto offers client SDK that can be used both to ingest and query data with Kusto:

* [.Net framework SDK](../api/netfx/about-the-sdk.md)
* [Python SDK](../api/python/kusto-python-client-library.md)
* [Java SDK](../api/java/kusto-java-client-library.md)

## Supported Data Formats

For all ingestion methods other than **ingest from query**, the data must be
formatted in one of the supported data formats so that Kusto may parse it.
The following data formats are supported:

|Format|Extension|Description|
|------|---------|-----------|
|CSV   |.csv     |Comma-separated values. See [RFC 4180: _Common Format and MIME Type for Comma-Separated Values (CSV) Files_](https://www.ietf.org/rfc/rfc4180.txt)|
|TSV   |.tsv     |Tab-separated values.|
|PSV   |.psv     |Pipe-separated values.|
|SOHV  |.sohv    |SOH-separated values.|
|SCSV  |.scsv    |Semicolon-separated values.|
|JSON  |.json    |Text file with multiple lines, each of which is a JSON document.|
|AVRO  |.avro    |Binary file with multiple records, each of which is an Avro record. Supported codecs: `null`, `deflate`. |

Blobs and files can be optionally compressed through any of the following compression algorithms:

|Compression|Extension|
|-----------|---------|
|GZip       |.gz      |
|Zip        |.zip     |

Kusto generally expects the extensions to be appended in the following way: `MyData.csv.zip` (not `MyData.zip.csv`; note that `MyData.zip` is also legal, but then Kusto can't infer the data format automatically and the data format must be provided at the time of ingestion)

## Schema Mapping

Schema mapping helps deterministically bind source data fields to destination table columns.
While being optional for CSV and TSV-like formats, shema mapping for JSON and Avro data is mandatory.

* [Csv Mapping](https://kusto.azurewebsites.net/docs/controlCommands/dataingestion.html#csv-mapping) works with all ordinal-based formats and can be passed as the ingest command parameter or [precreated on the table](https://kusto.azurewebsites.net/docs/controlCommands/tables.html#create-ingestion-mapping) and be referenced from the ingest command parameter.
* [Json Mapping](https://kusto.azurewebsites.net/docs/controlCommands/dataingestion.html#json-mapping) can be passed as the ingest command parameter or [precreated on the table](https://kusto.azurewebsites.net/docs/controlCommands/tables.html#create-ingestion-mapping) and be referenced from the ingest command parameter.
* [Avro Mapping](https://kusto.azurewebsites.net/docs/controlCommands/dataingestion.html#avro-mapping) can be passed as the ingest command parameter or [precreated on the table](https://kusto.azurewebsites.net/docs/controlCommands/tables.html#create-ingestion-mapping) and be referenced from the ingest command parameter.