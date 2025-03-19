---
title: Queued ingestion use case
description: Learn how to ingest historical data using the queued ingestion commands.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 03/19/2025
---

# Queued ingestion use case (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

The queued ingestion commands allow you to test how the historical data is ingested and fix any problems before ingesting that data. This article describes a common use for queued ingestion commands, the fine-tuning the ingestion of historical data. The following tasks are completed to fine-tune the historical data queued ingestion:

1. [List blobs in a folder](#list-blobs-in-a-folder)
1. [Ingest folder](#ingest-folder)
1. [Track ingestion status](#track-ingestion-status)
1. [Filter queued files for ingestion](#filter-queued-files-for-ingestion)
1. [Capture the creation time](#capture-the-creation-time)
1. [Ingest 20 files](#ingest-20-files)
1. [Track follow up ingestion status](#track-follow-up-ingestion-status)
1. [Perform your full ingestion](#perform-your-full-ingestion)
1. [Cancel ingestion](#cancel-ingestion)

### List blobs in a folder

To understand the historical data better, you list a maximum of 10 blobs from the Azure blob storage container.

```kusto
.list blobs (
    "https://<BlobStorageLocation>/<FolderName>;managed_identity=system"
)
MaxFiles=10
 ```

**Output**

| BlobUri | SizeInBytes | CapturedVariables |
|--|--|--|
| https://\<BlobStorageLocation>/\<FolderName>/part-100.parquet |  7,429,062 | {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-101.parquet | 262,610  |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-102.parquet | 6,154,166 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-103.parquet | 7,460,408 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-104.parquet | 6,154,166 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-105.parquet | 7,441,587 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-106.parquet | 1,087,425 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-107.parquet | 6,238,357 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-208.csv | 7,460,408 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-109.parquet | 6,338,148 |  {} |

You can now verify if the blobs are the correct blobs to ingest.

### Ingest folder

Next you queue 10 parquet files for ingestion into the `Logs` table in the `TestDatabase` database with tracking enabled for the ingestion.

```kusto
.ingest-from-storage-queued into table database('TestDatabase').Logs
EnableTracking=true
with (format='parquet')
<|
    .list blobs (
        "https://<BlobStorageLocation>/<FolderName>;managed_identity=system"
    )
    MaxFiles=10
```

**Output**

| IngestionOperationId | ClientRequestId | OperationInfo |
|----------------------|-----------------|---------------|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444|Kusto.Web.KWE,Query;11112222;11112222;22223333-bbbb-3333-cccc-4444cccc5555|.show queued ingestion operations "00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444" |

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

If the `State` isn't `Completed`, you can run the `.show queued ingestion operations` again. Running it again allows you to monitor the increase in the number of ingested blobs until the `State` changes to `Completed`. You can also [cancel the ingestion](#cancel-ingestion), if necessary.

### Filter queued files for ingestion

After the results of the ingestion are examined, another attempt at listing blobs for ingestion is made. This time the parquet suffix is added to ensure that only parquet files are ingested.

```kusto
.list blobs (
    "https://<BlobStorageLocation>/<FolderName>;managed_identity=system"
)
Suffix="parquet"
MaxFiles=10
```

**Output**

| BlobUri | SizeInBytes | CapturedVariables |
|--|--|--|
| https://\<BlobStorageLocation>/\<FolderName>/part-100.parquet |  7,429,062 | {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-101.parquet | 262,610  |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-102.parquet | 6,154,166 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-103.parquet | 7,460,408 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-104.parquet | 6,154,166 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-105.parquet | 7,441,587 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-106.parquet | 1,087,425 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-107.parquet | 6,238,357 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-108.parquet | 7,460,408 |  {} |
| https://\<BlobStorageLocation>/\<FolderName>/part-109.parquet | 6,338,148 |  {} |

### Capture the creation time

A path format is added to capture the creation time.

```kusto
.list blobs (
    "https://<BlobStorageLocation>/<FolderName>;managed_identity=system"
)
Suffix="parquet"
MaxFiles=10
PathFormat=("output/03/Year=" datetime_pattern("yyyy'/Month='MM'/Day='dd", creationTime) "/")
```

**Output**

| BlobUri | SizeInBytes | CapturedVariables |
|--|--|--|
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-100.parquet |  7,429,062 | {"creationTime": "03/20/2025 00:00:00"} |
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-101.parquet | 262,610  |  {"creationTime": "03/20/2025 00:00:00"} |
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-102.parquet | 6,154,166 |  {"creationTime": "03/20/2025 00:00:00"} |
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-103.parquet | 7,460,408 |  {"creationTime": "03/20/2025 00:00:00"} |
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-104.parquet | 6,154,166 |  {"creationTime": "03/20/2025 00:00:00"} |
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-105.parquet | 7,441,587 |  {"creationTime": "03/20/2025 00:00:00"} |
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-106.parquet | 1,087,425 |  {"creationTime": "03/20/2025 00:00:00"} |
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-107.parquet | 6,238,357 |  {"creationTime": "03/20/2025 00:00:00"} |
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-108.parquet | 7,460,408 |  {"creationTime": "03/20/2025 00:00:00"} |
| https://\<BlobStorageLocation>/\<FolderName>/output/03/Year=2025/Month=03/Day=20/Hour=00/part-109.parquet | 6,338,148 |  {"creationTime": "03/20/2025 00:00:00"} |

The `CapturedVariables` column dates match the dates specified in the `BlobUri` column.

### Ingest 20 files

Now 20 files in parquet format are ingested from the Azure blob storage container, along with their creation time.

```kusto
.ingest-from-storage-queued into table database('TestDatabase').Logs
EnableTracking=true
with (format='parquet')
<|
    .list blobs (
        "https://<BlobStorageLocation>/<FolderName>;managed_identity=system"
    )
    Suffix="parquet"
    MaxFiles=20
    PathFormat=("output/03/Year=" datetime_pattern("yyyy'/Month='MM'/Day='dd", creationTime) "/")
```

**Output**

| IngestionOperationId | ClientRequestId | OperationInfo |
|----------------------|-----------------|---------------|
|22223333;22223333;11110000-bbbb-2222-cccc-4444dddd5555|Kusto.Web.KWE,Query;22223333;22223333;33334444-dddd-4444-eeee-5555eeee5555|.show queued ingestion operations "22223333;22223333;11110000-bbbb-2222-cccc-4444dddd5555" |

The `OperationInfo` is then used to [track the ingestion status](#track-ingestion-status).

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

You can [cancel the ingestion](#cancel-ingestion), if necessary.

### Perform your full ingestion

By running the queued ingestion commands on a sample, you discovered the problems your ingestion might encounter. Now that you fixed them, you're ready to ingest all your historical data and wait for the full ingestion to complete.

### Cancel ingestion

At any time during the ingestion process, you can cancel your queued ingestion.

```Kusto
.cancel queued ingestion operation '22223333;22223333;11110000-bbbb-2222-cccc-4444dddd5555'
```

**Output**

|IngestionOperationId|Started On |Last Updated On |State |Discovered |Pending| Canceled | Ingested |Failed|SampleFailedReasons|Database|Table|
|--|--|--|--|--|--|--|--|--|--|--|--|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444 |2025-03-20 15:03:11.0000000 ||Canceled | 10 |10 |0 |0 |0 | |TestDatabase|Logs|

You can then roll back the ingestion, fix the issues, and rerun the ingestion.

## Related content

* [Queued ingestion overview](queued-ingestion-overview.md)
* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [.show extents](../show-extents.md)
