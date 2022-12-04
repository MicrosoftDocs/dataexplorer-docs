---
title: Ingestion troubleshooting
description: Learn how to troubleshoot your data ingestion on demand using .dup-next-ingest and .dup-next-failed-ingest commands.
ms.topic: reference
ms.date: 12/01/2022
---

# Ingestion troubleshooting

Use the `.dup-next-ingest` and `.dup-next-failed-ingest` commands for on-demand troubleshooting of your data ingestion pull flow.

On the next ingestion to the specified table, `.dup-next-ingest` uploads the successfully downloaded source files plus a file containing metadata on the ingestion request to the specified storage container. `.dup-next-failed-ingest` does the same process but only if the ingestion fails.

The file uploads to the storage container are performed by the same node that does the ingestion. Since the duplication configuration isn't persisted, rerun the command if there are admin node changes.

> [!NOTE]
>
> * These commands require `Database admin` permissions
> * These commands run in the context of a specific database
> * Azure blob containers are the only storage containers currently supported

## Syntax

`.dup-next-ingest` `into` *TableName* `to` h@*StorageContainerPath*

`.dup-next-failed-ingest` `into` *TableName* `to` h@*StorageContainerPath*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName* | string | &check; | The name of the table from which the next ingestion will be duplicated.|
|*StorageContainerPath*| string | &check; | The path to the blob container that will store the duplication.|

## Returns

The *TableName* and *StorageContainerPath* will be returned along with an *IngestionCommandFilePath*, which is the location of the the ingestion file request within the blob container.

Upon the next pull data ingestion, or failed ingestion for `.dup-next-failed-ingest`, the source files and another file containing metadata will be uploaded to the blob container.

## Example

```kusto
.dup-next-ingest into PerfCounter to h@'https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter;storagekey...==
```

|TableName|StorageContainerPath|IngestionCommandFilePath|
|--|--|--|
|PerfCounter|https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter|ingestionrequest-KustoEH-PerfCounter-083736db-8cf7-4166-85fd-74ef54e491d1|
