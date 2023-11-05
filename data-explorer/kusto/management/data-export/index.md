---
title: Data export
description: Learn how to export data from Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/05/2023
---
# Data export

Data export is the process that runs a Kusto query and writes its results.

There are several methods for data export:

* [Client-side export](#client-side-export): Save query results to the local file system.
* [Service-side export (pull)](#service-side-export-pull): Pull query results into a target table in the same or different cluster.
* [Service-side export (push)](#service-side-export-push): Push query results to an external table, cloud storage, or a SQL table.

> [!NOTE]
> For scalable data export, use the [service-side export (push)](#service-side-export-push) method.

## Client-side export

<!-- TODO: Add a zone pivot here for Fabric. -->

To perform client-side export:

1. Run your query in the [Azure Data Explorer web UI](../../../web-query-data.md#run-queries).
2. In the top-right corner, select **Export**.
3. From the dropdown of options, select **Download**, **Open in Excel**, or **Export to CSV**. For more information, see [Share queries from Azure Data Explorer web UI](../../../web-share-queries.md).

## Service-side export (pull)

To pull query results into a table in the same or different cluster, use an [ingest from query](../../management/data-ingestion/ingest-from-query.md) command.

## Service-side export (push)

For scalable data export, use `.export` management commands. These commands can be used to push query results to [Azure Blob Storage](export-data-to-storage.md), an [external table](export-data-to-an-external-table.md), or a [SQL table](export-data-to-sql.md).

This approach offers improved scalability as query results bypass the bottleneck of streaming through a single network connection between the query producer and the result consumer.

> [!NOTE]
> Export commands are limited by the available data export capacity of your cluster. Run the [.show capacity command](../../management/diagnostics.md#show-capacity) to view the total, consumed, and remaining data export capacity.

## Recommendations for secret management

In certain scenarios, it isn't possible to use the credentials of the principal running the command for data export authentication. For instance, Azure Blob Storage relies on its own authorization tokens.

In such cases, you may need to include security credentials within the data export management command.

To ensure security:

* Use [obfuscated string literals](../../query/scalar-data-types/string.md#obfuscated-string-literals), such as `h@"..."`, when sending secrets. The secrets will be scrubbed so that they don't appear in any trace emitted internally.
* Safely store passwords and similar secrets, and retrieve them as needed using the application.
