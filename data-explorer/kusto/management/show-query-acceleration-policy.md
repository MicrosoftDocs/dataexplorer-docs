---
title: .show query acceleration policy command
description: Learn how to use the ".show query acceleration policy command" to accelerate queries over external delta tables.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 10/15/2024
---
# .show query acceleration policy command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Shows the [query acceleration policy](query-acceleration-policy.md)of a specific external table, or for all external tables in the database that have a query acceleration policy set.

## Permissions

TODO: What permissions? The internal doc says none, but wouldn't you at least need database viewer?

## Syntax

`.show` `external` `table` *ExternalTableName* `policy` `query_acceleration`

`.show` `external` `table` `*` `policy` `query_acceleration`

## Returns

The command returns a table with a record per external table with the following columns:

| Column        | Type     | Description                                                                    |
| ------------- | -------- | ------------------------------------------------------------------------------ |
| PolicyName    | `string` | The name of the policy - `QueryAcceleration`                                   |
| EntityName    | `string` | The fully qualified name of the entity: `[DatabaseName].[ExternalTableName]`   |
| Policy        | `string` | A JSON-serialization of the query acceleration policy that is set on the table |
| ChildEntities | `string` | The child entities this policy affects - `null`                                |
| EntityType    | `string` | The type of the entity the policy applies to - `ExternalTable`                 |

## Example

```Kusto
.show external table MyExternalTable policy query_acceleration
```

**Output**

| PolicyName              | EntityName                     | Policy                                                                             | ChildEntities | EntityType    |
| ----------------------- | ------------------------------ | ---------------------------------------------------------------------------------- | ------------- | ------------- |
| QueryAccelerationPolicy | [MyDatabase].[MyExternalTable] | {<br>  "IsEnabled": true,<br>  "Hot": "1.00:00:00",<br>  "MaxAge": "00:05:00"<br>}                || ExternalTable |

## Related content

* [Query acceleration policy](query-acceleration-policy.md)
* [.alter query acceleration policy command](alter-query-acceleration-policy-command.md)
* [.delete query acceleration policy command](delete-query-acceleration-policy-command.md)
* [.show external table operations query_acceleration statistics](show-external-table-operations-query-acceleration-statistics.md)