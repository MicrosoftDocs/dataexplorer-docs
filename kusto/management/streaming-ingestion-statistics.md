---
title: .show streamingingestion statistics command
description: Learn how to use the `.show streamingingestion statistics` command to show aggregated statistics for the streaming ingestion.
ms.topic: reference
ms.date: 08/11/2024
---
# .show streamingingestion statistics command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This command returns a result set that includes aggregated statistics for the [streaming ingestion](/azure/data-explorer/ingest-data-streaming.md#choose-the-appropriate-streaming-ingestion-type).

> [!NOTE]
> The streaming ingestion statistics are grouped into buckets of short periods of time and aggregated by database, table, principal, ingestion status, and ingestion properties.
>
> The retention period for streaming ingestion statistics is 14 days.

## Permissions

If you have Database Admin or Database Monitor permissions, you'll see all failed operations. Otherwise, you'll only see operations that you created. For more information about permissions, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

| Syntax option | Description |
|--|--|
| `.show` `streamingingestion` `statistics` | Returns aggregated streaming ingestion statistics |
| `.show` `streamingingestion` `statistics` \| `where` ... | Returns a filtered set of streaming ingestion statistics |

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Results

| Output parameter | Type | Description |
|--|--|--|
| Database | `string` | Target database of the ingestion |
| Table | `string` | Target table of the ingestion |
| StartTime | `datetime` | Date/time (in UTC) of the first ingestion in the bucket |
| EndTime | `datetime` | Date/time (in UTC) of the last ingestion in the bucket |
| Count | `long` | The total count of the ingestions in the bucket |
| MinDuration | `timespan` | The minimum ingestion duration in the bucket |
| MaxDuration | `timespan` | The maximum ingestion duration in the bucket |
| AvgDuration | `timespan` | The average ingestion duration in the bucket |
| TotalDataSize | `long` | The total size of the data ingested in the bucket |
| MinDataSize | `long` | The minimum size of the data ingested in the bucket |
| MaxDataSize | `long` | The maximum size of the data ingested in the bucket |
| TotalRowCount | `long` | The total ingestion row count per ingestion operation in the bucket |
| MinRowCount | `long` | The minimum ingestion row count per ingestion operation in the bucket |
| MaxRowCount | `long` | The maximum ingestion row count per ingestion operation in the bucket |
| IngestionStatus | `string` | The ingestion status |
| NumOfRowStoresReferences | `int` | The number of RowStore references on the table |
| Principal | `string` | The principal whosе credentials were used for the ingestion |
| NodeId | `string` | The machine that performed the ingestion |
| IngestionProperties | `dynamic` | The ingestion properties |

## Example

| Database | Table | StartTime | EndTime | Count | MinDuration | MaxDuration | AvgDuration | TotalDataSize | MinDataSize | MaxDataSize | TotalRowCount | MinRowCount | MaxRowCount | IngestionStatus | NumOfRowStoresReferences | Principal | NodeId | IngestionProperties |
|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
| DB1 | Table1 | 2020-10-12 11:10:45.0837731 | 2020-10-12 11:11:44.6201738 | 27 | 00:00:00.0366988 | 00:00:00.5637870 | 00:00:00.3220000 | 62418 | 1864 | 3075 | 154 | 1 | 16 | Success | 4 | aadapp=xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx | KEngine00000Q | { "Mapping": "Mapping_name", "Format": "Csv", "Compressed": true, "IngestionSource": "Storage" } |
| DB2 | Table22 | 2020-10-11 09:07:14.7668889 | 2020-10-11 09:07:15.5168829 | 2 | 00:00:39.9945820 | 00:00:40.0112379 | 00:00:40.0030000 | 0 | 0 | 0 | 4 | 2 | 2 | FailureInternalError | 4 | aadapp=xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx | KEngine00000X | { "Mapping": null, "Format": "Csv", "Compressed": false, "IngestionSource": "Stream" } |
