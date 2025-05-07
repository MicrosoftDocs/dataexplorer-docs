---
title:  .show queued ingestion operations command
description: Learn how to use the `.show queued ingestion operations` command to view a log of the queued ingestion operations that are currently running or completed.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 03/19/2025
---

# .show queued ingestion operations command (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Displays the queued ingestion operations. Ingestion operations are tracked once the [.ingest-from-storage-queued](ingest-from-storage-queued.md) command begins.

> [!NOTE]
>
> Queued ingestion commands are run on the data ingestion URI endpoint `https://ingest-<YourClusterName><Region>.kusto.windows.net`.

## Permissions

You must have at least [Table Ingestor](../../access-control/role-based-access-control.md) permissions on the table that the `IngestionOperationId` or IDs belong to.

## Syntax

`.show queued ingestion operations` `"`*IngestionOperationId*`"`

`.show queued ingestion operations` `(` `"`*IngestionOperationId*`"` [`,` ... ] `)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *IngestionOperationId* | `string` | | The operation ID for which to show details.|

## Returns

### Returns for queued ingestion operations

The command returns a table with the latest update information for each ID.

|Output parameter |Type |Description|
|---|---|---|
|IngestionOperationId | `string` |The unique operation identifier.|
|StartedOn | `datetime` |Date/time, in UTC, at which the `.ingest-from-storage-queued` was executed.|
|LastUpdatedOn | `datetime` |Date/time, in UTC, when the status was updated.|
|State | `string` |The state of the operation.|
|Discovered | `long` |Count of the blobs that were listed from storage and queued for ingestion.|
|Pending | `long` |Count of the blobs to be ingested.|
|Canceled | `long` |Count of the blobs that were canceled due to a call to the [.cancel queued ingestion operation](cancel-queued-ingestion-operation-command.md) command.|
|Ingested | `long` |Count of the blobs that have been ingested.|
|Failed | `long` |Count of the blobs that failed **permanently**.|
|SampleFailedReasons | `string` |A sample of reasons for blob ingestion failures.|
|Database | `string` |The database where the ingestion process is occurring.|
|Table | `string` | The table where the ingestion process is occurring.|

#### States

The following table describes the possible values for the result table's *State* column.

| Value | Description |
|--|--|
| InProgress | The operation is still running. |
| Completed | The operation completed successfully. |
| Failed | The operation didn't complete successfully. |
| Canceled | The user canceled the operation. |

## Examples

The examples in this section show how to use the syntax to help you get started.

### Single operation ID

The following example shows the queued ingestion operations for a specific operation ID.

```kusto
.show queued ingestion operations "00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444"
```

**Output**

|IngestionOperationId|Started On |Last Updated On |State |Discovered |InProgress|Ingested |Failed|Canceled |SampleFailedReasons|Database|Table|
|--|--|--|--|--|--|--|--|--|--|--|--|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444 |2025-01-10 14:57:41.0000000 |2025-01-10 14:57:41.0000000|InProgress | 10387 |9391 |995 |1 |0 | Stream with ID '*****.csv' has a malformed CSV format*|MyDatabase|MyTable|

### Multiple operation IDs

The following example shows the queued ingestion operations for multiple operation ID numbers.

```kusto
.show queued ingestion operations ("00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444", "11112222;22223333;11110000-bbbb-2222-cccc-3333dddd4444")
```

**Output**

|IngestionOperationId|Started On |Last Updated On |State |Discovered |InProgress|Ingested |Failed|Canceled |SampleFailedReasons|Database|Table|
|--|--|--|--|--|--|--|--|--|--|--|--|
|00001111;11112222;00001111-aaaa-2222-bbbb-3333cccc4444 |2025-01-10 14:57:41.0000000 |2025-01-10 15:15:04.0000000|InProgress | 10387 |9391 |995 |1 |0 | Stream with ID '*****.csv' has a malformed CSV format*|MyDatabase|MyTable|
|11112222;22223333;11110000-bbbb-2222-cccc-3333dddd4444 |2025-01-10 15:12:23.0000000 |2025-01-10 15:15:16.0000000|InProgress | 25635 |25489 |145 |1 |0 | Unknown error occurred: Exception of type 'System.Exception' was thrown|MyDatabase|MyOtherTable|

## Related content

* [Queued ingestion overview](queued-ingestion-overview.md)
* [Data formats supported for ingestion](../../ingestion-supported-formats.md)
* [.ingest-from-storage-queued](ingest-from-storage-queued.md)
* [.cancel queued ingestion operation command](cancel-queued-ingestion-operation-command.md)
* [.list blobs command](list-blobs.md)
