---
title: `.delete query acceleration policy` command
description: Learn how to use the `.delete query acceleration policy` command to accelerate queries over external delta tables.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 09/16/2025
---
# `.delete query acceleration policy` command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Deletes the [`query acceleration policy`](query-acceleration-policy.md) of a specific external delta table.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `external` `table` *ExternalTableName* `policy` `query_acceleration`

## Parameters

| Name                | Type     | Required           | Description                     |
| ------------------- | -------- | ------------------ | ------------------------------- |
| *ExternalTableName* | `string` | :heavy_check_mark: | The name of the external delta table. |

## Example

```Kusto
.delete external table MyExternalTable policy query_acceleration
```

## Related content

* [Query acceleration policy](query-acceleration-policy.md)
* [.alter query acceleration policy command](alter-query-acceleration-policy-command.md)
* [.alter-merge query acceleration policy command](alter-merge-query-acceleration-policy-command.md)
* [.show query acceleration policy command](show-query-acceleration-policy-command.md)
* [.show external table operations query_acceleration statistics](show-external-table-operations-query-acceleration-statistics.md)
