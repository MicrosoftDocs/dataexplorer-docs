---
title: Queued ingestion overview
description: Learn about queued ingestion and its commands.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 02/23/2025
---
# Queued ingestion overview

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Queued ingestion commands allow you to ingest specific folders, or an entire container and manage the operations related to queued ingestion. You can also ingest multiple or individual blobs by URL and from a source file. The ingestion commands are useful for preparing and testing distinct ingestion scenarios before the final ingestion. Using them helps to ensure that fields, columns, partitioning, and other needs are handled properly during ingestion.

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

To understand the historical data better, you list a maximum of 10 blobs from the Azure blob storage container.

```kusto
.list blobs (
    "https://\<blobstoragelocation>/\<blobstoragelocation>;managed_identity=system"
)
MaxFiles=10
 ```

**Output**

| BlobUri | SizeInBytes | CapturedVariables |
|--|--|--|
| https://\<blobstoragelocation>/part-100.parquet |  7,429,062 | {} |
| https://\<blobstoragelocation>/part-101.parquet | 262,610  |  {} |
| https://\<blobstoragelocation>/part-102.parquet | 6,154,166 |  {} |
| https://\<blobstoragelocation>/part-103.parquet | 7,460,408 |  {} |
| https://\<blobstoragelocation>/part-104.parquet | 6,154,166 |  {} |
| https://\<blobstoragelocation>/part-105.parquet | 7,441,587 |  {} |
| https://\<blobstoragelocation>/part-106.parquet | 1,087,425 |  {} |
| https://\<blobstoragelocation>/part-107.parquet | 6,238,357 |  {} |
| https://\<blobstoragelocation>/part-108.parquet | 7,460,408 |  {} |
| https://\<blobstoragelocation>/part-109.parquet | 6,338,148 |  {} |

You can now verify if these are the correct blobs to ingest.

### Ingest folder

Next you queue 10 parquet files for ingestion into the `Logs` table in the `TestDatabase` database with tracking enabled for the ingestion.

```kusto
.ingest-from-storage-queued into table database('TestDatabase').Logs
EnableTracking=true
with (format='parquet')
<|
    .list blobs (
        "https://\<blobstoragelocation>/\<foldername>;managed_identity=system"
    )
    MaxFiles=10
```

**Output**

| IngestionOperationId | ClientRequestId | OperationInfo |
|----------------------|-----------------|---------------|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444|Kusto.Web.KWE,Query;11112222;11112222;22223333-bbbb-3333-cccc-4444cccc5555|.show queued ingestion operations "00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444 |

The `OperationInfo`, which includes the `IngestionOperationId`, is then used to [track the ingestion status](#track-ingestion-status).

### Track ingestion status

You run the `.show queued ingestion operations` command to check whether the ingestion is complete or if there are any errors.

```kusto
.show queued ingestion operations "00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444"
 ```

**Output**

|IngestionOperationId|Started On |Last Updated On |State |Discovered |InProgress|Ingested |Failed|Canceled |SampleFailedReasons|Database|Table|
|--|--|--|--|--|--|--|--|--|--|--|--|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444 |2025-03-19 14:57:41.0000000 |2025-01-10 15:15:04.0000000|Completed | 10 |0 |10 |0 |0 | |TestDatabase|Logs|

If the `State` isn't `Completed`, you can run the `.show queued ingestion operations` again. This allows you to monitor the increase in the number of ingested blobs until the `State` changes to `Completed`.

### Filter queued files for ingestion

After the results of the ingestion are examined, another attempt at listing blobs for ingestion is made. This time the parquet suffix is added to ensure that only parquet files are ingested.

```kusto
.list blobs (
    "https://\<blobstoragelocation>/\<foldername>;managed_identity=system"
)
Suffix="parquet"
MaxFiles=10
```

**Output**

| BlobUri | SizeInBytes | CapturedVariables |
|--|--|--|
| https://\<blobstoragelocation>/\<foldername>/part-100.parquet |  7,429,062 | {} |
| https://\<blobstoragelocation>/\<foldername>/part-101.parquet | 262,610  |  {} |
| https://\<blobstoragelocation>/\<foldername>/part-102.parquet | 6,154,166 |  {} |
| https://\<blobstoragelocation>/\<foldername>/part-103.parquet | 7,460,408 |  {} |
| https://\<blobstoragelocation>/\<foldername>/part-104.parquet | 6,154,166 |  {} |
| https://\<blobstoragelocation>/\<foldername>/part-105.parquet | 7,441,587 |  {} |
| https://\<blobstoragelocation>/\<foldername>/part-106.parquet | 1,087,425 |  {} |
| https://\<blobstoragelocation>/\<foldername>/part-107.parquet | 6,238,357 |  {} |
| https://\<blobstoragelocation>/\<foldername>/part-108.parquet | 7,460,408 |  {} |
| https://\<blobstoragelocation>/\<foldername>/part-109.parquet | 6,338,148 |  {} |

### Capture the creation time

A path format is added to capture the creation time.

```kusto
.list blobs (
    "https://\<blobstoragelocation>/\<foldername>;managed_identity=system"
)
Suffix="parquet"
MaxFiles=10
PathFormat=("output/03/Year=" datetime_pattern("yyyy'/Month='MM'/Day='dd", creationTime) "/")
```

**Output**

| BlobUri | SizeInBytes | CapturedVariables |
|--|--|--|
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-100.parquet |  7,429,062 | {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-101.parquet | 262,610  |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-102.parquet | 6,154,166 |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-103.parquet | 7,460,408 |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-104.parquet | 6,154,166 |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-105.parquet | 7,441,587 |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-106.parquet | 1,087,425 |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-107.parquet | 6,238,357 |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-108.parquet | 7,460,408 |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/\<foldername>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-109.parquet | 6,338,148 |  {"creationTime":"03/20/2025 00:00:00"} |

The `CapturedVariables` column dates match the dates specified in the `BlobUri` column.

### Ingest 20 files

Now 20 files in parquet format are ingested from the Azure blob storage container, along with their creation time.

```kusto
.ingest-from-storage-queued into table database('TestDatabase').Logs
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

**Output**

| BlobUri | SizeInBytes | CapturedVariables |
|--|--|--|
| https://\<blobstoragelocation>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-100.parquet |  7,429,062 | {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-101.parquet | 262,610  |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-102.parquet | 6,154,166 |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-103.parquet | 7,460,408 |  {"creationTime":"03/20/2025 00:00:00"} |
| https://\<blobstoragelocation>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-104.parquet | 6,154,166 |  {"creationTime":"03/20/2025 00:00:00"} |
|...|...|...|

### Track follow up ingestion status

The `.show queued ingestion operations` command is run to check whether there are any issues with this ingestion.

```kusto
.show queued ingestion operations "22223333;22223333;11110000-bbbb-2222-cccc-4444dddd5555"
```

**Output**

|IngestionOperationId|Started On |Last Updated On |State |Discovered |InProgress|Canceled|Ingested |Failed|Canceled |SampleFailedReasons|Database|Table|
|--|--|--|--|--|--|--|--|--|--|--|--|
|22223333;22223333;11110000-bbbb-2222-cccc-4444dddd5555 |2025-02-20 14:57:41.0000000 | | InProgress| 10 |10 |0 |0 |0 | |TestDatabase|Logs|

The `.show extents` command is run to check whether extents are created with an anterior date for data integrity and historical accuracy.

```kusto
.show table Logs extents
```

The `MinCreatedOn` and `MaxCreatedOn` values should show the data creation time, rather than the data ingestion time. For more information about these returns, see [.show extents](../show-extents.md).

<!--
### Check blob ingestion details

Since some blobs were ingested, some failed, and some are still pending, the `.show queued ingestion operations details` command is run to see more detailed information for each blob in the ingestion.

```kusto
.show queued ingestion operations "11112222;22223333;11110000-bbbb-2222-cccc-3333dddd4444" details
```

**Output**

| IngestionOperationId | BlobUrl | IngestionStatus | StartedAt | CompletedAt | FailedReason |
|--|--|--|--|--|--|
| 22223333;22223333;11110000-bbbb-2222-cccc-4444dddd5555 | https://\<blobstoragelocation>/100.parquet | Pending | 2025-02-09T14:56:08.8708746Z |  |  |
| 22223333;22223333;11110000-bbbb-2222-cccc-4444dddd5555 | https://\<blobstoragelocation>/102.parquet | Succeeded | 2025-02-09T14:56:09.0800631Z | 2024-02-09T15:02:06.5529901Z |  |
|22223333;22223333;11110000-bbbb-2222-cccc-4444dddd5555 | https://\<blobstoragelocation>/103.parquet | Failed | 2025-02-09T14:56:09.3026602Z |  | Failed to download |
| ... | ... | ... | ... | ... | ... |
-->

### Cancel ingestion

The ingestion is now canceled.

```Kusto
.cancel queued ingestion operation '22223333;22223333;11110000-bbbb-2222-cccc-4444dddd5555'
```

**Output**

|IngestionOperationId|Started On |Last Updated On |State |Discovered |Pending| Canceled | Ingested |Failed|SampleFailedReasons|Database|Table|
|--|--|--|--|--|--|--|--|--|--|--|--|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444 |2025-03-20 15:03:11.0000000 ||Canceled | 10 |10 |0 |0 |0 | |TestDatabase|Logs|

You can then roll back the ingestion, fix the issues, and rerun the ingestion.

## Management commands

Queued storage commands include:

* [.show queued ingestion operations command](show-queued-ingestion-operations.md) shows the queued ingestion operations.
* [.ingest-from-storage-queued into command](ingest-from-storage-queued.md) queues blobs for ingestion into a table.
* [.cancel queued ingestion operation command](cancel-queued-ingestion-operation-command.md)
cancels a queued ingestion operation.
* [.list blobs command](list-blobs.md) lists the blobs for ingestion.

## Related content

* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [.show extents](../show-extents.md)