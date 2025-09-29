---
title: .alter-merge query acceleration policy command
description: Learn how to use the ".alter-merge query acceleration policy command" to accelerate queries over external delta tables.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 09/16/2025
---

# .alter-merge query acceleration policy command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Alters the [query acceleration policy](query-acceleration-policy.md) properties of a specific external delta table.

> [!TIP]
> Use `.alter-merge` to add or update properties without replacing the whole policy. Array properties are merged (new elements are added, existing values preserved).
> Use `.alter` to fully replace the policy, including overwriting arrays.

For limitations, see [Limitations](query-acceleration-policy.md#limitations).

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `external` `table` _ExternalTableName_ `policy` `query_acceleration` '_JSON-serialized policy_'

## Parameters

| Name                     | Type     | Required           | Description                                                       |
| ------------------------ | -------- | ------------------ | ----------------------------------------------------------------- |
| _ExternalTableName_      | `string` | :heavy_check_mark: | The name of the external delta table.                             |
| _JSON-serialized policy_ | `string` | :heavy_check_mark: | String literal holding a [JSON property bag](#json-property-bag). |

### JSON property bag

| Property   | Type       | Required           | Description                                                                                                                                                                                                               |
| ---------- | ---------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IsEnabled  | `Boolean`  |                    | Indicates whether the policy is enabled. This property is required if no query acceleration policy is defined on the external table.                                                                                                                                                                                   |
| Hot        | `Timespan` |                    | The hot period defined in the query acceleration policy. Minimum value = 1 d. This property is required if no query acceleration policy is defined on the external table.                                                                                                                                             |
| HotWindows | `DateTime` |                    | One or more optional time windows. Delta data files created within these time windows are accelerated.                                                                                                                    |
| MaxAge     | `Timespan` |                    | The external table will return accelerated data if the last index refresh time is greater than @now - MaxAge. Otherwise, external table will operate in non-accelerated mode. Default is 5 minutes. Minimum is 1 minute. |

> [!NOTE]
> Query acceleration is applied to data within a specific time period, defined as `timespan`, starting from the `modificationTime` as stated for each file in the [delta log](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#add-file-and-remove-file).

### Example

In case the external table has query acceleration policy defined:

```json
{ "Hot": "1.00:00:00" }
```

In case the external table doesn't have query acceleration policy defined:

```json
{ "IsEnabled": true, "Hot": "1.00:00:00" }
```


## Returns

The command returns a table with one record that includes the modified policy object.

| Column        | Type     | Description                                                                                   |
| ------------- | -------- | --------------------------------------------------------------------------------------------- |
| PolicyName    | `string` | The name of the policy - `QueryAcceleration`                                                  |
| EntityName    | `string` | The fully qualified name of the entity: `[DatabaseName].[ExternalTableName]`                  |
| Policy        | `string` | A JSON-serialization of the query acceleration policy that is set on the external delta table |
| ChildEntities | `string` | The child entities this policy affects - `null`                                               |
| EntityType    | `string` | The type of the entity the policy applies to - `ExternalTable`                                |

## Example

In case the external table has query acceleration policy defined:

```Kusto
.alter-merge external table MyExternalTable policy query_acceleration '{"Hot": "1.00:00:00", "MaxAge" : "00:05:00"}'
```

In case the external table doesn't have query acceleration policy defined:

```Kusto
.alter-merge external table MyExternalTable policy query_acceleration '{"IsEnabled": true, "Hot": "1.00:00:00", "MaxAge" : "00:05:00"}'
```

## Related content

- [Query acceleration policy](query-acceleration-policy.md)
- [.alter query acceleration policy command](alter-query-acceleration-policy-command.md)
- [.delete query acceleration policy command](delete-query-acceleration-policy-command.md)
- [.show query acceleration policy command](show-query-acceleration-policy-command.md)
- [.show external table operations query_acceleration statistics](show-external-table-operations-query-acceleration-statistics.md)
