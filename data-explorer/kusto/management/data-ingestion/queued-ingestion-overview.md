---
title: Queued ingestion overview
description: Learn about queued ingestion and its commands.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 03/19/2025
---
# Queued ingestion overview (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Queued ingestion commands allow you to ingest specific folders, or an entire container and manage the operations related to queued ingestion. You can also ingest multiple or individual blobs by URL and from a source file. The ingestion commands are useful for preparing and testing distinct ingestion scenarios before the final ingestion. Using them helps to ensure that fields, columns, partitioning, and other needs are handled properly during ingestion.

## Management commands

Queued storage commands include:

* [.show queued ingestion operations command](show-queued-ingestion-operations.md) shows the queued ingestion operations.
* [.ingest-from-storage-queued command](ingest-from-storage-queued.md) queues blobs for ingestion into a table.
* [.cancel queued ingestion operation command](cancel-queued-ingestion-operation-command.md)
cancels a queued ingestion operation.
* [.list blobs command](list-blobs.md) lists the blobs for ingestion.

## Related content

* [Queued ingestion use case](queued-ingestion-use-case.md)
* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
