---
title:  .show continuous data-export failures
description:  This article describes how to show continuous data export failures.
ms.reviewer: yifats
ms.topic: reference
ms.date: 12/08/2024
---
# .show continuous-export failures

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Returns all failures logged as part of the continuous export. To view only a specific time range, filter the results by the **Timestamp** column.

::: moniker range="azure-data-explorer"
The command doesn't return any results if executed on a [follower database](/azure/data-explorer/follower), it must be executed against the leader database.
::: moniker-end

::: moniker range="microsoft-fabric"
The command doesn't return any results if executed on a [database shortcut](/fabric/real-time-intelligence/database-shortcut), it must be executed against the leader database.
::: moniker-end

## Permissions

You must have at least Database Monitor or Database Admin permissions to run this command. For more information, see [role-based access control](../../access-control/role-based-access-control.md).

## Syntax

`.show` `continuous-export` *ContinuousExportName* `failures`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ContinuousExportName* | `string` |  :heavy_check_mark: | The name of the continuous export. |

## Returns

| Output parameter | Type | Description |
|--|--|--|
| Timestamp | `datetime` | Timestamp of the failure. |
| OperationId | `string` | Operation ID of the failure. |
| Name | `string` | Continuous export name. |
| LastSuccessRun | Timestamp | The last successful run of the continuous export. |
| FailureKind | `string` | Failure/PartialFailure. PartialFailure indicates some artifacts were exported successfully before the failure occurred. |
| Details | `string` | Failure error details. |

## Example

The following example shows failures from the continuous export `MyExport`.

```kusto
.show continuous-export MyExport failures 
```

**Output**

| Timestamp                   | OperationId                          | Name     | LastSuccessRun              | FailureKind | Details    |
|-----------------------------|--------------------------------------|----------|-----------------------------|-------------|------------|
| 2019-01-01 11:07:41.1887304 | ec641435-2505-4532-ba19-d6ab88c96a9d | MyExport | 2019-01-01 11:06:35.6308140 | Failure     | Details... |

## Related content

* [Continuous data export overview](continuous-data-export.md)
* [External tables](../../query/schema-entities/external-tables.md)
* [.create or alter continuous-export](create-alter-continuous.md)
* [.disable or enable continuous-export](disable-enable-continuous.md)
* [.show continuous-export](show-continuous-export.md)
* [.drop continuous-export](drop-continuous-export.md)
