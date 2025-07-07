---
title: .show external table details
description: Learn how to use the `.show external table details` command to show details of the specified external tables in the database. 
ms.reviewer: yifats
ms.topic: reference
ms.date: 04/23/2025
---
# .show external table details

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Returns query acceleration details of a specified external table or all external tables in the database.

This command is relevant to any external table of any type. For an overview of external tables, see [external tables](../query/schema-entities/external-tables.md).

## Permissions

You must have at least Database User, Database Viewer, Database Monitor to run these commands. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `external` `tables` `details`

`.show` `external` `table` *TableName* `details`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the external table to show.|

## Returns

| Output parameter | Type | Description |
|--|--|--|
| TableName | `string` | Name of external table |
| QueryAccelerationPolicy | `string` | A JSON-serialization of the [query acceleration policy](#query-acceleration-policy) that is set on the table. |
| QueryAccelerationState | `string` | A JSON-serialization of the [query acceleration status](#query-acceleration-state) parameters. |

### Query acceleration policy

| Column | Type | Description |
|--|--|--|
| TableName | `string` | The name of the external table. |
| IsEnabled | `bool` | Indicates whether the external table has a query acceleration policy enabled. |
| Hot | `timespan` | The hot period defined in the query acceleration policy. |

### Query acceleration state

| Column | Type | Description |
|--|--|--|
| HotSize | `long` | The total size on disk (in bytes) of artifacts accelerated due to the query acceleration policy. |
| CompletePercentage | `double` | The percentage of artifacts that are accelerated, out of the total artifacts that are able to be accelerated. |
| PendingDataFilesSize | `long` | The total size of artifacts that are pending acceleration. |
| PendingDataFilesCount | `int` | The number of artifacts that are pending acceleration. |
| IsHealthy | `string` | Indicated whether healthy or not health. |
| NotHealthyReason | `string` | Describes the reason for query acceleration not being healthy. Empty if healthy. |
| LastUpdatedDateTime | `datetime` | The last datetime when the internal representation of the table was successfully refreshed. |
| Latency | `timespan` | The time in minutes since the last new data was added to your logical copy. |

## Example

```kusto
.show external tables details
.show external table deltatable details
```

**Output**

| TableName | QueryAccelerationPolicy | QueryAccelerationState        |
|-----------|-----------|----------------|
| deltatable        | {
  "IsEnabled": true,  "Hot": "365000.00:00:00"}      | {  "HotSize": 29454192,  "CompletionPercentage": 75.0,  "PendingArtifactSize": 21162035,  "PendingArtifactCount": 3,  "IsHealthy": false,  "NotHealthyReason": "InaccessibleDeltaTable : Delta table does not exist",  "LastUpdatedDateTime": "2025-04-03 13:38:00.1541537",  "Latency": "26.00:58:12.8941033"} |
