---
title:  Show continuous data export failures
description:  This article describes how to show continuous data export failures.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# Show continuous export failures

Returns all failures logged as part of the continuous export. Filter the results by the Timestamp column in the command to view only time range of interest.
The command will not return any results if executed on a [follower database](../../../follower.md), it must be executed against the leader database.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../../access-control/role-based-access-control.md).

## Syntax

`.show` `continuous-export` *ContinuousExportName* `failures`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ContinuousExportName* | `string` |  :heavy_check_mark: | The name of the continuous export. |

## Returns

| Output parameter | Type      | Description                                         |
|------------------|-----------|-----------------------------------------------------|
| Timestamp        | `datetime` | Timestamp of the failure.                           |
| OperationId      | `string` | Operation ID of the failure.                    |
| Name             | `string` | Continuous export name.                             |
| LastSuccessRun   | Timestamp | The last successful run of the continuous export.   |
| FailureKind      | `string` | Failure/PartialFailure. PartialFailure indicates some artifacts were exported successfully before the failure occurred. |
| Details          | `string` | Failure error details.                              |

## Example

```kusto
.show continuous-export MyExport failures 
```

| Timestamp                   | OperationId                          | Name     | LastSuccessRun              | FailureKind | Details    |
|-----------------------------|--------------------------------------|----------|-----------------------------|-------------|------------|
| 2019-01-01 11:07:41.1887304 | ec641435-2505-4532-ba19-d6ab88c96a9d | MyExport | 2019-01-01 11:06:35.6308140 | Failure     | Details... |
