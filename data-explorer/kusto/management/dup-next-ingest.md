---
title: .dup-next-ingest command
description: Learn how to use the `.dup-next-ingest` command to troubleshoot your data ingestion pull flow.
ms.topic: reference
ms.date: 05/24/2023
---

# .dup-next-ingest command

Use the `.dup-next-ingest` command for on-demand troubleshooting of your data ingestion pull flow.

Run `.dup-next-ingest` before the ingestion you wish to watch. After running the command, the successfully downloaded ingestion source file(s) and a file containing metadata on the ingestion request will be uploaded to the specified storage container. Since this command only watches one subsequent ingestion, run this command each time you want to watch the next ingestion.

The file uploads to the storage container and the ingestion are performed by the same node. If there are admin node changes between running the command and the next ingestion, you'll need to rerun the command since the duplication configuration isn't persisted. Watch the storage container to know when the duplication is completed.

> [!NOTE]
>
> * This command run in the context of a specific database.
> * Supported storage is Azure blob containers.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.dup-next-ingest` `into` *TableName* `to` *StorageContainerPath*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName* | string |  :heavy_check_mark: | The name of the table from which the next ingestion will be duplicated.|
|*StorageContainerPath*| string |  :heavy_check_mark: | The path to the blob container that will store the duplication. We recommend prefacing the path with "h@" to hide sensitive information. To learn more, see [obfuscated string literals](../query/scalar-data-types/string.md#obfuscated-string-literals)|

## Returns

The provided *TableName* and *StorageContainerPath* will be returned along with an *IngestionCommandFilePath*, which is the location of the ingestion file request within the blob container.

Upon the next pull data ingestion, the ingestion source file(s) and a file containing metadata will be uploaded to the blob container.

## Example

```kusto
.dup-next-ingest into PerfCounter to h@'https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter;storagekey...==
```

|TableName|StorageContainerPath|IngestionCommandFilePath|
|--|--|--|
|PerfCounter|https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter|ingestionrequest-KustoEH-PerfCounter-083736db-8cf7-4166-85fd-74ef54e491d1|
