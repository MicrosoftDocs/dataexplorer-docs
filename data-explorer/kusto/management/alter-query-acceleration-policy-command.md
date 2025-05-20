---
title: .alter query acceleration policy command
description: Learn how to use the ".alter query acceleration policy command" to accelerate queries over external delta tables.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 11/19/2024
---
# .alter query acceleration policy command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Alters the [query acceleration policy](query-acceleration-policy.md) of a specific external delta table.

For limitations, see [Limitations](query-acceleration-policy.md#limitations).

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `external` `table` *ExternalTableName* `policy` `query_acceleration` '*JSON-serialized policy*'

## Parameters

| Name                     | Type     | Required           | Description                                 |
| ------------------------ | -------- | ------------------ | ------------------------------------------- |
| *ExternalTableName*      | `string` | :heavy_check_mark: | The name of the external delta table.       |
| *JSON-serialized policy* | `string` | :heavy_check_mark: | String literal holding a [JSON property bag](#json-property-bag). |

### JSON property bag

| Property  | Type       | Required           | Description                                                                  |
| --------- | ---------- | ------------------ | ---------------------------------------------------------------------------- |
| IsEnabled | `Boolean`  | :heavy_check_mark: | Indicates whether the policy is enabled.                                     |
| Hot       | `Timespan` | :heavy_check_mark: | The hot period defined in the query acceleration policy. Minimum value = 1 d. |

> [!NOTE]
> Query acceleration is applied to data within a specific time period, defined as `timespan`, starting from the `modificationTime` as stated for each file in the [delta log](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#add-file-and-remove-file). 

### Example

```json
{"IsEnabled": true, "Hot": "1.00:00:00"}
```

## Returns

The command returns a table with one record that includes the modified policy object.

| Column        | Type     | Description                                                                    |
| ------------- | -------- | ------------------------------------------------------------------------------ |
| PolicyName    | `string` | The name of the policy - `QueryAcceleration`                                   |
| EntityName    | `string` | The fully qualified name of the entity: `[DatabaseName].[ExternalTableName]`   |
| Policy        | `string` | A JSON-serialization of the query acceleration policy that is set on the external delta table |
| ChildEntities | `string` | The child entities this policy affects - `null`                                |
| EntityType    | `string` | The type of the entity the policy applies to - `ExternalTable`                 |

## Example

```Kusto
.alter external table MyExternalTable policy query_acceleration '{"IsEnabled": true, "Hot": "1.00:00:00"}'
```

## Related content

* [Query acceleration policy](query-acceleration-policy.md)
* [.delete query acceleration policy command](delete-query-acceleration-policy-command.md)
* [.show query acceleration policy command](show-query-acceleration-policy-command.md)
* [.show external table operations query_acceleration statistics](show-external-table-operations-query-acceleration-statistics.md)
