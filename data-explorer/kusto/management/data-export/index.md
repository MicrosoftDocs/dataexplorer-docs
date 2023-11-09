---
title: Data export
description: Learn how to export data from Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/05/2023
---
# Data export

Data export involves executing a Kusto query and saving its results. This process can be carried out either on the client side or the service side.

## Client-side export

Client-side export gives you control over saving query results either to the local file system or pushing them to a preferred storage location. This flexibility is facilitated through the use of [Kusto client libraries](../../api/client-libraries.md). You can [create an app to run queries](../../api/get-started/app-basic-query.md), read the desired data, and implement an export process tailored to your requirements.

Alternatively, you can use a client tool like the Azure Data Explorer web UI to export data from your Kusto cluster. For more information, see [Share queries](../../../web-share-queries.md).

## Service-side export (pull)

Use the [ingest from query](../../management/data-ingestion/ingest-from-query.md) commands to pull query results into a table in the same or different cluster. See the [performance tips](../../management/data-ingestion/ingest-from-query.md#performance-tips) before using these commands.

## Service-side export (push)

For scalable data export, the service offers various `.export` management commands to push query results to [cloud storage](export-data-to-storage.md), an [external table](export-data-to-an-external-table.md), or an [SQL table](export-data-to-sql.md). This approach enhances scalability by avoiding the bottleneck of streaming through a single network connection.

> [!NOTE]
> The `.export` management commands are limited by the available data export capacity of your cluster. Run the [.show capacity command](../../management/diagnostics.md#show-capacity) to view the total, consumed, and remaining data export capacity.

### Recommendations for secret management

In certain scenarios, it isn't possible to use the credentials of the principal running the command for data export authentication. For instance, Azure Blob Storage relies on its own authorization tokens.

In such cases, you may need to include security credentials within the data export management command.

To ensure security:

* Use [obfuscated string literals](../../query/scalar-data-types/string.md#obfuscated-string-literals), such as `h@"..."`, when sending secrets. The secrets will be scrubbed so that they don't appear in any trace emitted internally.
* Safely store passwords and similar secrets, and retrieve them as needed using the application.
