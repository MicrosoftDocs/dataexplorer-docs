---
title: .show ingestion failures command
description: Learn how to use the `.show ingestion failures` command to show any ingestion failures when running data ingestion management commands.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/05/2023
---
# .show ingestion failures command

This command returns information about ingestion failures associated with the use of data ingestion management commands. 

This command only shows ingestion failures related to data ingestion management commands and doesn't include failures from other stages of the ingestion process. Failures from all stages of ingestion are recorded in ingestion [metrics](../../using-metrics.md) and [diagnostic logs](../../using-diagnostic-logs.md).

The retention period for ingestion failures is 14 days.

## Syntax

To return all recorded ingestion failures:

`.show` `ingestion` `failures`

To return a filtered set of ingestion failures:

`.show` `ingestion` `failures` `|` `where` *Condition*

To return an ingestion failure for a specific operation ID:

`.show` `ingestion` `failures` `with` `(` `OperationId` `=` *OperationId* `)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*Condition*| `string` | :heavy_check_mark:|The condition to match in order for the ingestion failure to be returned.|
|*OperationId| `guid` | :heavy_check_mark:|The operation ID of the ingestion failure to return.|

## Returns

| Output parameter | Type | Description |
|--|--|--|
| OperationId | `string` | Operation identifier that can be used to view additional operation details via the <br> [.show operations](operations.md) command </br> |
| Database | `string` | Database on which the failure occurred |
| Table | `string` | Table on which the failure occurred |
| FailedOn | `dateTime` | Date/time (in UTC) when the failure was registered |
| IngestionSourcePath | `string` | Identifies the ingestion source (usually, an Azure Blob URI) |
| Details | `string` | Failure details. Provides insight into the actual ingestion failure root cause |
| FailureKind | `string` | Type of the failure (Permanent/Transient) |
| RootActivityId | `string` | Root Activity ID. |
| OperationKind | `string` | The ingestion operation type (phase) during which the failure was registered |
| OriginatesFromUpdatePolicy | Boolean | Indicates whether the failure was registered while executing an [Update Policy](./show-table-update-policy-command.md) |
| ErrorCode | `string` | Ingestion error code |
| Principal | `int` | The principal whosе credentials were used for the ingestion |
| User | `int` | The user who performed the ingestion |
| IngestionProperties | `int` | The ingestion properties that were sent for the ingestion operation |
| NumberOfSources | `int` | The number if ingestion sources represented by this failure record |
| ShouldRetry | Boolean | For internal use |

## Example

The following table is an example output from the `.show` `ingestion` `failures` command.

| OperationId | Database | Table | FailedOn | IngestionSourcePath | Details | FailureKind | RootActivityId | OperationKind | OriginatesFromUpdatePolicy | ErrorCode | Principal | User | IngestionProperties | NumberOfSources |
|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
| 3827def6-0773-4f2a-859e-c02cf395deaf | DB1 | Table1 | 2017-02-14 22:25:03.1147331 | ...url... | Stream with ID '*****.csv' has a malformed CSV format* | Permanent | 3c883942-e446-4999-9b00-d4c664f06ef6 | DataIngestPull | 0 | Stream_ClosingQuoteMissing | aadapp=xxxxxx |  | Format=Csv | 1 |
| 841fafa4-076a-4cba-9300-4836da0d9c75 | DB1 | Table1 | 2017-02-14 22:34:11.2565943 | ...url... | Stream with ID '*****.csv' has a malformed CSV format* | Permanent | 48571bdb-b714-4f32-8ddc-4001838a956c | DataIngestPull | 0 | Stream_ClosingQuoteMissing | aadapp=xxxxxx |  | Format=Csv | 1 |
| e198c519-5263-4629-a158-8d68f7a1022f | DB1 | Table1 | 2017-02-14 22:34:44.5824741 | ...url... | Stream with ID '*****.csv' has a malformed CSV format* | Permanent | 5e31ab3c-e2c7-489a-827e-e89d2d691ec4 | DataIngestPull | 0 | Stream_ClosingQuoteMissing | aadapp=xxxxxx |  | Format=Csv | 1 |
| a9f287a1-f3e6-4154-ad18-b86438da0929 | DB1 | Table1 | 2017-02-14 22:36:26.5525250 | ...url... | Unknown error occurred: Exception of type 'System.Exception' was thrown | Transient | 9b7bb017-471e-48f6-9c96-d16fcf938d2a | DataIngestPull | 0 | Unknown | aadapp=xxxxxx |  | Format=Csv | 10 |
| 9edb3ecc-f4b4-4738-87e1-648eed2bd998 | DB1 | Table1 | 2017-02-14 23:52:31.5460071 | ...url... | Failed to download source from Azure storage - access forbidden | Permanent | 21fa0dd6-cd7d-4493-b6f7-78916ce0d617 | DataIngestPull | 0 | Download_Forbidden | aadapp=xxxxxx |  | Format=Csv | 1 |

## Related content

* [Data ingestion](../../ingest-data-overview.md)
* [Ingestion of invalid data](../../ingest-invalid-data.md)
* [Duplicate next ingestion failure](dup-next-failed-ingest.md)
* [Kusto.Ingest ingestion status reporting](../api/netfx/kusto-ingest-client-status.md)
