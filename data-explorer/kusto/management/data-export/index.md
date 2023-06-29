---
title:  Data export
description: This article describes Data export in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/03/2022
---
# Data export

Data export is the process that runs a Kusto query and writes its results. The query results are available for later inspection.

There are several methods for data export:

## Client-side export

  In its simplest form, data export can be done on the client side. The client
  runs a query against the service, reads back the results, and then writes them.
  This form of data export depends on the client tool to do the
  export, usually to the local filesystem where the tool runs. Among tools
  that support this model are [Kusto.Explorer](../../tools/kusto-explorer.md) and the
  [Azure Data Explorer web UI](../../../web-query-data.md).

## Service-side export (pull)

  If the target of the export is a table in the same or different cluster/database
  as the query, use "ingest from query" on the target table. In this flow, a query is run and its results are immediately ingested into a table. For more information, see [ingest from query](../../management/data-ingestion/ingest-from-query.md).

## Service-side export (push)

  The above methods, [Client-side export](#client-side-export), and [Service-side export (pull)](#service-side-export-pull), are limited. The query results must stream through a single network connection between the producer doing the query, and the consumer who writes its results.
  For scalable data export, use the "push" export model in which the service running the query also writes its results in an optimized manner.
  This model is exposed through a set of `.export` management commands, that support exporting query results to an [external table](export-data-to-an-external-table.md),
  a [SQL table](export-data-to-sql.md), or an [external Blob storage](export-data-to-storage.md).

  Service side export commands are limited by the cluster's available data export capacity.
  You can run [show capacity command](../../management/diagnostics.md#show-capacity) to view the cluster's total, consumed, and remaining data export capacity.

## Recommendations for secret management when using data export commands

Ideally, export data to a remote target, such as Azure Blob Storage and Azure SQL Database. Implicitly use the credentials of the security principal that executes the data export command. This method isn't possible in some scenarios. For example, Azure Blob Storage doesn't support the notion of a security principal, only its own tokens.
This feature supports introducing the necessary credentials inline, as part of the data export management command.

To do the export in a secure manner:

* Use [obfuscated string literals](../../query/scalar-data-types/string.md#obfuscated-string-literals), such as `h@"..."`, when sending secrets. The secrets will be scrubbed so that they don't appear in any trace emitted internally.

* Store passwords and similar secrets securely and "pull" using the application, as needed.
