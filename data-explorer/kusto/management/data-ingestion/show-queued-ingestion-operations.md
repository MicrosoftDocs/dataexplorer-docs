---
title:  .show queued ingestion operations command
description: Learn how to use the `.show queued ingestion operations` command to view a log of the queued ingestion operations that are currently running or completed.
ms.reviewer: 
ms.topic: reference
ms.date: 12/04/2024
---

# .show queued ingestion operations command

Ingestion operations can be tracked once the operation is initiated by [.ingest-from-storage-queued](ingest-from-storage-queued.md).

## Syntax

`.show queued ingestion operations` *OperationId*

`.show queued ingestion operations` `(` *OperationId* [`,` ... ] `)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *OperationId* | `string` | | The operation ID for which to show details.|

## Returns

When one or more operation IDs are provided, the command returns the latest update for each ID, <span style="background:yellow">given the user's access and the record being less than 6 hours old</span>.

The output table contains the following information:

|Output parameter |Type |Description|
|---|---|---|
|IngestionOperationId | `string` |Operation Identifier|
|IngestionStatus | `string` |Status of the operation|
|Database | `string` |Database where the ingestion is occuring|
|Table | `string` |Table where the ingestion is occuring|
|StartedAt | `datetime` |Date/time (in UTC) at which the `.ingest-from-storage-queued` was executed.|
|LastUpdatedAt | `datetime` |Date/time (in UTC) the status was updated.|
|DiscoveredCount | `long` |Count of blobs that were listed from storage and queued for ingestion.|
|PendingCount | `long` |Count of remaining blobs to ingest.|
|CanceledCount | `long` |Count of blobs that were cancelled <span style="background:yellow">due to a call to the [.cancel]() command</span>|
|IngestedCount | `long` |Count of blobs that have been ingested|
|FailedCount | `long` |Count of blobs that failed permanently|
|SampleFailedReasons | `string` |A sample of reasons for blob ingestion failures|

**IngestionStatus table**

<span style="background:yellow">TODO</span>

The following table describes the possible values for the result table's *State* column:

|Value             |Description|
|------------------|-----------|
|InProgress        |The operation is still running|
|Completed         |The operation completed (successfully)|
|Failed            |The operation completed (unsuccessfully)|
|PartiallySucceeded|The operation completed (parts of it successfully and part of it not)|
|Abandoned         |The operation was abandoned before completion|
|BadInput          |The operation didn't start executing as there was bad input|
|Scheduled         |The operation is scheduled for execution|
|Throttled         |The operation has been aborted due to throttling|
|Canceled         |The operation has been canceled by the user|
|Skipped           |The operation was skipped (due to some logical condition provided as the operation input)|

## Examples

### Single operation ID

```kusto
.show queued ingestion operations 5da31e5f-2819-4835-8b01-3ecf4a70b0e5
```

<span style="background:yellow">TODO</span>

|ID |Operation |Node ID |Started On |Last Updated On |Duration |State |Status |
|--|--|--|--|--|--|--|--|
|9edb3ecc-f4b4-4738-87e1-648eed2bd998 |DataIngestPull | |2015-01-10 14:57:41.0000000 |2015-01-10 14:57:41.0000000 |0001-01-01 00:00:00.0000000 |Failed |Collection was modified. Enumeration operation may not execute. |

### Multiple operation IDs

```kusto
.show queued ingestion operations (5da31e5f-2819-4835-8b01-3ecf4a70b0e5, 8033eaf9-bc3a-43c4-8533-d904e10e49fe)
```

<span style="background:yellow">TODO</span>

|ID |Operation |Node ID |Started On |Last Updated On |Duration |State |Status |
|--|--|--|--|--|--|--|--|
|9edb3ecc-f4b4-4738-87e1-648eed2bd998 |DataIngestPull | |2015-01-10 14:57:41.0000000 |2015-01-10 14:57:41.0000000 |0001-01-01 00:00:00.0000000 |Failed |Collection was modified. Enumeration operation may not execute. |

