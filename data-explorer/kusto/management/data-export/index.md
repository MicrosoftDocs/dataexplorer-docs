---
title: Data export - Azure Data Explorer | Microsoft Docs
description: This article describes Data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/09/2019

---
# Data export

Data export is the process that executes a Kusto query and writes its
results, making the query results available for later inspection.

There are several methods for data export:

* **Client-side export**:
  In its simplest form, data export can be done on the client side (the client
  runs a query against the service, reads back the results, and then writes them
  somewhere). This form of data export depends on the client tool to do the
  export, most commonly to the local filesystem where the tool runs. Among tools
  that support this model are [Kusto.Explorer](../../tools/kusto-explorer.md),
  [Web UI](https://docs.microsoft.com/azure/data-explorer/web-query-data), 


 and others.

* **Service-side export (pull)**:
  If the target of the export is a Kusto table (on the same cluster/database
  as the query or another), use the "ingest from query"
  flow on the target table. In this flow a query is run and its results are immediately
  ingested into a Kusto table. See [data ingestion](../data-ingestion/index.md).



* **Service-side export (push)**:
  The methods above are somewhat limited since the query results have to be streamed
  through a single network connection between the producer doing the query and
  the consumer writing its results. For scalable data export, Kusto provides a
  "push" export model in which the service running the query also writes its
  results in an optimized manner. This model is exposed through a set of
  `.export` control commands, supporting exporting query results to
 an [external table](export-data-to-an-external-table.md),
  a [SQL table](export-data-to-sql.md), or an [external Blob storage](export-data-to-storage.md).
  
  Service side export commands are limited by the cluster's available data export capacity. 
  You can run [show capacity command](../../management/diagnostics.md#show-capacity) to view the cluster's total, consumed and remaining data export capacity.

## Recommendations for secret management when using data export commands

Ideally, exporting data to a remote target (such as Azure Blob Storage
and Azure SQL Database) would be done by implicitly using the credentials
of the security principal executing the data export command. This is not
possible in some scenarios (for example, Azure Blob Storage doesn't
support the notion of a security principal, only its own tokens.) 
Therefore, Kusto supports introducing the necessary credentials inline as part of the
data export control command. Here are a few recommendations to make sure that this is done in a secure manner:

Use [obfuscated string literals](../../query/scalar-data-types/string.md#obfuscated-string-literals)
(such as `h@"..."`) when sending secrets to Kusto.
Kusto will then scrub these secrets so that they do not appear in any
trace it emits internally.

Additionally, passwords and similar secrets should be stored securely
and "pulled" by the application as needed.
