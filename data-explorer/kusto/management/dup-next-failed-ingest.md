---
title: .dup-next-failed-ingest command
description: Learn how to troubleshoot your data ingestion on demand using the .dup-next-failed-ingest command.
ms.topic: reference
ms.date: 05/29/2023
---

# .dup-next-failed-ingest command

Use the `.dup-next-failed-ingest` command for ad-hoc troubleshooting of your data ingestion flows.

`.dup-next-failed-ingest` will watch the next ingestion for an ingestion failure. If the next ingestion fails, the successfully downloaded ingestion source file(s) and a file containing metadata on the ingestion request will be uploaded to the specified storage container. Since this command only watches one subsequent ingestion, run this command each time you want to watch the next ingestion.

The file uploads to the storage container and the ingestion are performed by the same cluster node. The command takes effect on a single ingest operation and has no persistent state, so if the admin node changes between the command execution and the next ingestion, you'll need to rerun the command. Watch the storage container to know when the duplication is completed.

> [!NOTE]
>
> * This command runs in the context of a specific database.
> * Supported storage is Azure blob containers.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.dup-next-failed-ingest` `into` *TableName* `to` *StorageContainerPath*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName* | string |  :heavy_check_mark: | The name of the table from which the next ingestion will be duplicated.|
|*StorageContainerPath*| string |  :heavy_check_mark: | The path to the blob container that will store the duplication. We recommend prefacing the path with "h@" to hide sensitive information. To learn more, see [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals). |

## Returns

The provided *TableName*, *StorageContainerPath*, and *IngestionCommandFilePath*. The ingestion command file path is the location of the ingestion file request within the blob container.

Upon the next pull data ingestion, the ingestion source file(s) and a file containing metadata will be uploaded to the blob container.

## Example

```kusto
.dup-next-failed-ingest into PerfCounter to h@'https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter;storagekey...==

.dup-next-failed-ingest into PerfCounter to h@'https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter?<SAS key that allows write>

```

|TableName|StorageContainerPath|IngestionCommandFilePath|
|--|--|--|
|PerfCounter|https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter|ingestionrequest-KustoEH-PerfCounter-083736db-8cf7-4166-85fd-74ef54e491d1|
