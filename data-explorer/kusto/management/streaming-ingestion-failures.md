---
title: .show streamingingestion failures command
description: Learn how to use the `.show streamingingestion failures` command to show streaming ingestion failures when data is ingested.
ms.topic: reference
ms.date: 05/23/2023
---

# .show streamingingestion failures command

This command returns a result set that includes aggregated streaming ingestion failures that occur when [data is ingested using one of the streaming ingestion types](../../ingest-data-streaming.md#choose-the-appropriate-streaming-ingestion-type).

> [!NOTE]
> Streaming ingestion failures are grouped into buckets of short periods of time and aggregated by database, table, principal, ingestion properties, failure kind, and error code.
>
> Gateway throttling failures will not appear in the result set of this command.
>
> The retention period for streaming ingestion failures is 14 days.

## Permissions

If you have Database Admin or Database Monitor permissions, you see all failed operations. Otherwise, you only see operations that you created. For more information about permissions, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

| Syntax option | Description |
|--|--|--|
| `.show` `streamingingestion` `failures` | Returns aggregated streaming ingestion failures |
| `.show` `streamingingestion` `failures` \| `where` ... | Returns a filtered set of streaming ingestion failures |

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Returns

| Output parameter | Type | Description |
|--|--|--|
| Database | `string` | Target database of the ingestion |
| Table | `string` | Target table of the ingestion |
| Principal | `string` | The principal whosе credentials were used for the ingestion |
| RootActivityId | `guid` | The ingestion Root Activity ID |
| IngestionProperties | `dynamic` | The ingestion properties |
| Count | `long` | The total count of failures in the bucket |
| FirstFailureOn | `datetime` | Date/time (in UTC) of the first ingestion in the bucket |
| LastFailureOn | `datetime` | Date/time (in UTC) of the last ingestion in the bucket |
| FailureKind | `string` | Type of the failure (Permanent/Transient) |
| ErrorCode | `string` | The error code of the failure |
| Details | `string` | The details about the failure |

## Example

| Database | Table | Principal | RootActivityId | IngestionProperties | Count | FirstFailureOn | LastFailureOn | FailureKind | ErrorCode | Details |
|--|--|--|--|--|--|--|--|--|--|--|
| DB1 | Table1 | aadapp=xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx | 04411033-5ffb-410f-bc6d-a24d50790a80 | { "Mapping": "Mapping_name", "Format": "Csv", "Compressed": true, "IngestionSource": "Storage" } | 2 | 2020-10-11 12:06:35.8362967 | 2020-10-11 12:06:35.8362967 | Transient | Kusto.DataNode.Exceptions.StreamingIngestionServiceException | Server error in performing streaming ingestion into xxxx : Can't determine row store for ingestion |
| DB1 | Table1 | aadapp=xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx | d025b3e1-8f3d-4864-be0a-de54ce5246be | { "Mapping": null, "Format": "Csv", "Compressed": false, "IngestionSource": "Stream" } | 3 | 2020-10-11 12:07:40.8362967 | 2020-10-11 12:08:35.8362967 | Permanent | Kusto.DataNode.Exceptions.StreamingIngestionServiceException | Database metadata is unavailable. |
