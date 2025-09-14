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

`.alter` `external` `table` _ExternalTableName_ `policy` `query_acceleration` '_JSON-serialized policy_'

## Parameters

| Name                     | Type     | Required           | Description                                                       |
| ------------------------ | -------- | ------------------ | ----------------------------------------------------------------- |
| _ExternalTableName_      | `string` | :heavy_check_mark: | The name of the external delta table.                             |
| _JSON-serialized policy_ | `string` | :heavy_check_mark: | String literal holding a [JSON property bag](#json-property-bag). |

### JSON property bag
::: moniker range="microsoft-fabric"
| Property   		| Type       | Required           | Description                                                                                                                                                                                                               |
| ---------- 		| ---------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IsEnabled  		| `Boolean`  | :heavy_check_mark: | Indicates whether the policy is enabled.                                                                                                                                                                                  |
| Hot        		| `Timespan` | :heavy_check_mark: | The hot period defined in the query acceleration policy. Minimum value = 1 d.                                                                                                                                             |
| HotWindows 		| `DateTime` |                    | One or more optional time windows. Delta data files created within these time windows are accelerated.                                                                                                                    |
| MaxAge     		| `Timespan` |                    | The external table will return accelerated data if the last index refresh time is greater than @now - MaxAge. Otherwise, external table will operate in non-accelerated mode. Default is 5 minutes. Minimum is 1 minute. |
::: moniker-end

::: moniker range="azure-data-explorer"
| Property   		| Type       | Required           | Description                                                                                                                                                                                                               |
| ---------- 		| ---------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IsEnabled  		| `Boolean`  | :heavy_check_mark: | Indicates whether the policy is enabled.                                                                                                                                                                                  |
| Hot        		| `Timespan` | :heavy_check_mark: | The hot period defined in the query acceleration policy. Minimum value = 1 d.                                                                                                                                             |
| HotWindows 		| `DateTime` |                    | One or more optional time windows. Delta data files created within these time windows are accelerated.                                                                                                                    |
| MaxAge     		| `Timespan` |                    | The external table will return accelerated data if the last index refresh time is greater than @now - MaxAge. Otherwise, external table will operate in non-accelerated mode. Default is 5 minutes. Minimum is 1 minute. |
| ManagedIdentity   | `string`	 |                	  | Optional managed identity for which the query acceleration background operations are executed. This identity must have relevant delta table permissions and must be enabled for AutomatedFlows in the ADX cluster / database managed identity policy. For more information, see [Managed identities overview](/azure/data-explorer/managed-identities-overview)|
::: moniker-end
> [!NOTE]
> Query acceleration is applied to data within a specific time period, defined as `timespan`, starting from the `modificationTime` as stated for each file in the [delta log](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#add-file-and-remove-file).

### Example

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
::: moniker range="microsoft-fabric"
```Kusto
.alter external table MyExternalTable policy query_acceleration '{"IsEnabled": true, "Hot": "1.00:00:00", "HotWindows":[{"MinValue":"2025-07-07 07:00:00","MaxValue":"2025-07-09 07:00:00"}], "MaxAge": "00:05:00"}'
```
::: moniker-end

::: moniker range="azure-data-explorer"
```Kusto
.alter external table MyExternalTable policy query_acceleration '{"IsEnabled": true, "Hot": "1.00:00:00", "HotWindows":[{"MinValue":"2025-07-07 07:00:00","MaxValue":"2025-07-09 07:00:00"}], "MaxAge": "00:05:00", "ManagedIdentity": "12345678-1234-1234-1234-1234567890ab"}'
```
::: moniker-end
## Related content

- [Query acceleration policy](query-acceleration-policy.md)
- [.delete query acceleration policy command](delete-query-acceleration-policy-command.md)
- [.show query acceleration policy command](show-query-acceleration-policy-command.md)
- [.show external table operations query_acceleration statistics](show-external-table-operations-query-acceleration-statistics.md)
