---
title: Data ingestion - Azure Data Explorer | Microsoft Docs
description: This article describes Data ingestion in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/30/2020
---
# Data ingestion

The process by which data is added to a table and is made available for query.
Depending on the existence of the table beforehand, the process requires
[database admin, database ingestor, database user, or table admin permissions](../access-control/role-based-authorization.md).

The data ingestion process consists of several steps:

1. Retrieving the data from the data source.
1. Parsing and validating the data.
1. Matching the schema of the data to the schema of the target Kusto table,
   or creating the target table if it doesn't already exist.
1. Organizing the data in columns.
1. Indexing the data.
1. Encoding and compressing the data.
1. Persisting the resulting Kusto storage artifacts in storage.
1. Executing all relevant update policies, if any.
1. "Committing" the data ingest, making it available for query.

> [!NOTE]
> Some of the steps above may be skipped, depending on the specific scenario.
> For example, data ingested through the streaming ingestion endpoint skips steps
> 4, 5, 6, and 9. These are done in the background as the data is "groomed".
> As another example, if the data source is the results of a Kusto query to the same
> cluster, there's no need to parse and validate the data.

> [!WARNING]
> Data ingested into a table in Kusto is subject to the table's effective **retention policy**.
> Unless set on a table explicitly, the effective retention policy is derived from
> the database's retention policy. Therefore, when you ingest data into Kusto, make sure
> that the database's retention policy is appropriate for your needs. If not, explicitly
> override it at the table level. Failure to do so might result in a "silent" deletion of
> your data due to the database's retention policy. See [retention policy](https://kusto.azurewebsites.net/docs/concepts/retentionpolicy.html)
> for details.

For data ingestion properties, see [data ingestion properties](https://docs.microsoft.com/azure/data-explorer/ingestion-properties).
For a list of supported formats for data ingestion, see [data formats](https://docs.microsoft.com/azure/data-explorer/ingestion-supported-formats).



## Ingestion methods

There are a number of methods by which data can be ingested, each with
its own characteristics:

1. **Inline ingestion (push)**: A control command ([.ingest inline](./ingest-inline.md))
   is sent to the engine, with the data to be ingested being a part of the command
   text itself.
   This method is primarily intended for ad-hoc testing
   purposes, and should not be used for production purposes.
1. **Ingest from query**: A control command ([.set, .append, .set-or-append, or .set-or-replace](./ingest-from-query.md))
   is sent to the engine, with the data specified indirectly as the results of a query
   or a command.
   This method is useful for generating reporting tables out of raw data tables,
   or for creating small temporary tables for further analysis.
1. **Ingest from storage (pull)**: A control command ([.ingest into](./ingest-from-storage.md))
   is sent to the engine, with the data stored in some external storage (for example, Azure
   Blob Storage) accessible by the engine and pointed-to by the command.
   This method allows efficient bulk ingestion of data, but puts some burden on
   the client performing the ingestion to not overtax the cluster with concurrent
   ingestions (or risk consuming all cluster resources by data ingestion, reducing
   the performance of queries).
1. **Queued ingestion**: Data is uploaded to external storage (for example, Azure Blob
   Storage). A notification is sent to a queue (such as Azure Queue or Event Hub).
   This is the primary method used in production because it has very high availability,
   doesn't require the client to perform capacity management itself, and handles bulk
   appends well. This is sometimes called "native ingestion".


|Method             |Latency                 |Production|Bulk|Availability|Synchronicity|
|-------------------|------------------------|----------|----|------------|-------------|
|Inline ingestion   |Seconds + ingest time   |No        |No  |Kusto Engine|Synchronous  |
|Ingest from query  |Query time + ingest time|Yes       |Yes |Kusto Engine|Synchronous  |
|Ingest from storage|Seconds + ingest time   |Yes       |Yes |Kusto Engine|Both         |
|Queued ingestion   |Minutes                 |Yes       |Yes |Storage     |Asynchronous |

## Validation policy during ingestion

When ingesting from storage, the source data is validated as part of parsing.
The validation policy indicates how to react to parsing failures. It consists
of two properties:

* `ValidationOptions`: Here, `0` means that no validation should be performed,
  `1` validates that all records have the same number of fields (useful for
  CSV files and similar), and `2` indicates to ignore fields that are not
  double-quoted.

* `ValidationImplications`: `0` indicates that validation failures should fail
  the whole ingestion,
  and `1` indicates that validation failures should be ignored.