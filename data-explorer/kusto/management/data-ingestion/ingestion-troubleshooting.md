---
title: Ingestion troubleshooting with .dup-next-ingest
description: Learn how to troubleshoot your data ingestion on demand using .dup-next-ingest commands.
ms.topic: reference
ms.date: 12/01/2022
---

# Ingestion troubleshooting with .dup-next-ingest

Use the `.dup-next-ingest` and `.dup-next-failed-ingest` commands for on-demand troubleshooting of your data ingestion pull flow.

Invoking `.dup-next-ingest` causes the next data pull ingestion into the specified table to be duplicated to the specified storage container, and `.dup-next-failed-ingest` will do the same only in the case of an ingestion failure.

The command causes the ingestion source files and an additional file containing metadata to be uploaded to the specified blob container. The file uploads to the blob container are performed by the same node that does the ingestion. Since the duplication configuration is not persisted, rerun the command if there are admin node changes.

> [!NOTE]
>
> * These commands requires Database Admin permissions
> * These commands run in the context of a specific database
> * Only azure blob containers are currently supported

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

Upon the next pull data ingestion, or failed ingestion in the case of `.dup-next-failed-ingest`, the source files and an additional file containing metadata will be uploaded to the blob container.

## Example

```kusto
.dup-next-ingest into PerfCounter to h@'https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter;storagekey...==
```

|TableName|StorageContainerPath|IngestionCommandFilePath|
|--|--|--|
|PerfCounter|https://kustorenginsomecluster.blob.core.windows.net/ingestion-duplication-perf-counter|ingestionrequest-KustoEH-PerfCounter-083736db-8cf7-4166-85fd-74ef54e491d1|
