---
title:  .show queued ingestion operations command
description: Learn how to use the `.show queued ingestion operations` command to view a log of the queued ingestion operations that are currently running or completed.
ms.reviewer: 
ms.topic: reference
ms.date: 12/04/2024
---

# .show queued ingestion operations command

Ingestion operations can be tracked once the operation is initiated by [.ingest-from-storage-queued](ingest-from-storage-queued.md).

## Permissions

You must have at least [Table Ingestor](../access-control/role-based-access-control.md) permissions on the table the `OperationId`(s) belong to.

## Syntax

`.show queued ingestion operations` *OperationId*

`.show queued ingestion operations` `(` *OperationId* [`,` ... ] `)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *OperationId* | `string` | | The operation ID for which to show details.|

## Returns

The command returns the latest update for each ID.

The output table contains the following information:

|Output parameter |Type |Description|
|---|---|---|
|OperationId | `string` |Operation Identifier|
|StartedOn | `datetime` |Date/time (in UTC) at which the `.ingest-from-storage-queued` was executed.|
|LastUpdatedOn | `datetime` |Date/time (in UTC) the status was updated.|
|State | `string` |State of the operation|
|Discovered | `long` |Count of blobs that were listed from storage and queued for ingestion.|
|InProgress | `long` |Count of blobs to be ingested.|
|Ingested | `long` |Count of blobs that have been ingested|
|Failed | `long` |Count of blobs that failed **permanently**|
|Canceled | `long` |Count of blobs that were cancelled due to a call to the [.cancel](cancel-queued-ingestion-operation-command.md) command|
|SampleFailedReasons | `string` |A sample of reasons for blob ingestion failures|
|Database | `string` |Database where the ingestion is occuring|
|Table | `string` |Table where the ingestion is occuring|

**State table**

The following table describes the possible values for the result table's *State* column:

|Value             |Description|
|------------------|-----------|
|InProgress        |The operation is still running|
|Completed         |The operation completed (successfully)|
|Failed            |The operation completed (unsuccessfully)|
|Canceled         |The operation has been canceled by the user|

## Examples

### Single operation ID

```kusto
.show queued ingestion operations 5da31e5f-2819-4835-8b01-3ecf4a70b0e5
```

OperationId|Started On |Last Updated On |State |Discovered |InProgress|Ingested |Failed|Canceled |SampleFailedReasons|Database|Table
--|--|--|--|--|--|--|--|--|--|--|--
5da31e5f-2819-4835-8b01-3ecf4a70b0e5 |2015-01-10 14:57:41.0000000 |2015-01-10 14:57:41.0000000|InProgress | 10387 |9391 |995 |1 |0 | |MyDatabase|MyTable

### Multiple operation IDs

```kusto
.show queued ingestion operations (5da31e5f-2819-4835-8b01-3ecf4a70b0e5, 8033eaf9-bc3a-43c4-8533-d904e10e49fe)
```

OperationId|Started On |Last Updated On |State |Discovered |InProgress|Ingested |Failed|Canceled |SampleFailedReasons|Database|Table
--|--|--|--|--|--|--|--|--|--|--|--
5da31e5f-2819-4835-8b01-3ecf4a70b0e5 |2015-01-10 14:57:41.0000000 |2015-01-10 15:15:04.0000000|InProgress | 10387 |9391 |995 |1 |0 | |MyDatabase|MyTable
8033eaf9-bc3a-43c4-8533-d904e10e49fe |2015-01-10 15:12:23.0000000 |2015-01-10 15:15:16.0000000|InProgress | 25635 |25489 |145 |1 |0 | |MyDatabase|MyOtherTable
