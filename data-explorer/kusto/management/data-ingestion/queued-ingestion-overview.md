---
title: Queued ingestion overview
description: Learn about queued ingestion and its commands.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 02/05/2025
---
# Queued ingestion overview

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Queued ingestion commands allow you to ingest files, specific folders, or an entire container and manage the operations related to queued ingestion. They're useful for preparing and testing distinct ingestion scenarios before the final ingestion. Using them helps to ensure that fields, columns, partitioning, and other needs are handled properly during ingestion.

In this article, you learn about a common scenario, ingesting historical data.

## Historical data

One common use case for queued storage commands is in fine-tuning ingestion of historical data. The queued ingestion commands allow you to test how the historical data is ingested and fix any problems before ingesting that data. In the following example, the following tasks are completed as a test scenario to check the historical data ingestion:

1. [List blobs in a folder](#list-blobs-in-a-folder)
1. [Ingest folder](#ingest-folder)
1. [Track ingestion status](#track-ingestion-status)
1. [Filter queued files for ingestion](#filter-queued-files-for-ingestion)
1. [Ingest 20 files](#ingest-20-files)
1. [Track follow up ingestion status](#track-follow-up-ingestion-status)
1. [Cancel ingestion](#cancel-ingestion)

### List blobs in a folder

To understand the historical data better, the data engineer lists a maximum of 10 blobs from the Azure blob storage container.

```kusto
.list blobs (
    "https://vpldata.blob.core.windows.net/logsparquet1tb;managed_identity=system"
)
MaxFiles=10
 ```

### Ingest folder

Next they queue 10 parquet files for ingestion into the `Logs` table in the `dm-ingest-test` database with tracking enabled for the ingestion.

```kusto
.ingest-from-storage-queued into table database('dm-ingest-test').Logs
EnableTracking=true
with (format='parquet')
<|
    .list blobs (
        "https://vpldata.blob.core.windows.net/logsparquet1tb;managed_identity=system"
    )
    MaxFiles=10
```

### Track ingestion status

The `.show queued ingestion operations` command is run to check whether the ingestion is complete or if there are any errors.

```kusto
.show queued ingestion operations "aaaaaaaa-0b0b-1c1c-2d2d-333333333333"
 ```

### Filter queued files for ingestion

After the results of the ingestion are examined, another attempt at listing blobs for ingestion is made. This time the parquet suffix is added to ensure that only parquet files are ingested, and a path format to capture the creation time is included.

```kusto
.list blobs (
    "https://testdata.blob.core.windows.net/logsparquet1tb;managed_identity=system"
)
Suffix="parquet"
MaxFiles=10
PathFormat=("output/03/Year=" datetime_pattern("yyyy'/Month='MM'/Day='dd", creationTime) "/")
```

### Ingest 20 files

Now 20 files in parquet format are ingested from the Azure blob storage container, along with their creation time.

```kusto
.ingest-from-storage-queued into table database('dm-ingest-test').Logs
EnableTracking=true
with (format='parquet')
<|
    .list blobs (
        "https://testdata.blob.core.windows.net/logsparquet1tb;managed_identity=system"
    )
    Suffix="parquet"
    MaxFiles=20
    PathFormat=("output/03/Year=" datetime_pattern("yyyy'/Month='MM'/Day='dd", creationTime) "/")
```

### Track follow up ingestion status

The `.show queued ingestion operations` command is run to check whether there are any issues with this ingestion.

.show queued ingestion operations "bbbbbbbb-1c1c-2d2d-3e3e-444444444444"

### Cancel ingestion

The ingestion is now canceled.

```kusto
.cancel queued ingestion operation
```

## Management commands

Queued storage commands include:

* [.show queued ingestion operations command](show-queued-ingestion-operations.md) shows the queued ingestion operations.
* [.ingest-from-storage-queued into command](ingest-from-storage-queued.md) queues blobs for ingestion into a table.
* [.cancel queued ingestion operation command](cancel-queued-ingestion-operation-command.md)
cancels a queued ingestion operation.
* [.list blobs command](list-blobs.md) lists the blobs for ingestion.

<!--
## Example historical data ingestion test

In this example, the following tasks are completed as a test scenario to check the historical data ingestion:

1. To understand the historical data better, the data engineer lists a maximum of 10 blobs from the Azure blob storage container.

```kusto
.list blobs (
    "https://testdata.blob.core.windows.net/logsparquet1tb;managed_identity=system"
)
MaxFiles=10
 ```
    ```kusto
    .create table MySourceTable (OriginalRecord:string)
    ```

1. Next they queue 10 parquet files for ingestion into the `Logs` table in the `dm-ingest-test` database with tracking enabled for the ingestion.

```kusto
.ingest-from-storage-queued into table database('dm-ingest-test').Logs
EnableTracking=true
with (format='parquet')
<|
    .list blobs (
        "https://testdata.blob.core.windows.net/logsparquet1tb;managed_identity=system"
    )
    MaxFiles=10
```

1. The `.show queued ingestion operations` command is run to check whether the ingestion is complete or if there are any errors.

```kusto
.show queued ingestion operations (aaaaaaaa-0b0b-1c1c-2d2d-333333333333)
 ```

1. After the results of the ingestion are examined, another attempt at listing blobs for ingestion is made. This time the parquet suffix is added to ensure that only parquet files are ingested, and a path format to capture the creation time is included.

```kusto
.list blobs (
    "https://testdata.blob.core.windows.net/logsparquet1tb;managed_identity=system"
)
Suffix="parquet"
MaxFiles=10
PathFormat=("output/03/Year=" datetime_pattern("yyyy'/Month='MM'/Day='dd", creationTime) "/")
```
1. Now 20 files in parquet format are ingested from the Azure blob storage container, along with their creation time.

```kusto
.ingest-from-storage-queued into table database('dm-ingest-test').Logs
EnableTracking=true
with (format='parquet')
<|
    .list blobs (
        "https://testdata.blob.core.windows.net/logsparquet1tb;managed_identity=system"
    )
    Suffix="parquet"
    MaxFiles=20
    PathFormat=("output/03/Year=" datetime_pattern("yyyy'/Month='MM'/Day='dd", creationTime) "/")
```

1. The `.show queued ingestion operations` command is run to check whether there are any issues with this ingestion.

.show queued ingestion operations (bbbbbbbb-1c1c-2d2d-3e3e-444444444444)

1. Now the ingestion is canceled.

```kusto
.cancel queued ingestion operation
```
-->
## Related content

* [Data formats supported for ingestion](../../ingestion-supported-formats.md)