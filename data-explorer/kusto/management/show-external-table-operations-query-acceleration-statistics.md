---
title: .show external table operations query_acceleration statistics command
description: Learn how to use the ".show external table operations query_acceleration statistics command" to accelerate queries over external delta tables.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 09/16/2025
---
# .show external table operations query_acceleration statistics command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Shows statistics for [query acceleration](query-acceleration-policy.md) for a specific external delta table, or all external delta tables in the database that have a query acceleration policy set.

## Permissions

You must have at least [Database monitor or Database viewer](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `external` `table` *ExternalTableName* `operations` `query_acceleration` `statistics`

`.show` `external` `tables` `operations` `query_acceleration` `statistics`

## Parameters

| Name                | Type     | Required           | Description                     |
| ------------------- | -------- | ------------------ | ------------------------------- |
| *ExternalTableName* | `string` |  | The name of the external table. |

## Returns

The command returns a table with a record per external table that has a non-null policy, with the following columns:

| Column                            | Type       | Description                                                                                                  |
| --------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| ExternalTableName                 | `string`   | The name of the external table                                                                               |
| IsEnabled                         | `bool`     | Indicates whether the external has a query acceleration policy enabled                                       |
| Hot                               | `timespan` | The hot period defined in the query acceleration policy                                                      |
| HotSize                           | `long`     | The total size on disk (in bytes) of data files accelerated due to the query acceleration policy             |
| LastUpdatedDateTime               | `datetime` | Indicates the last datetime when the internal representation of the table was successfully refreshed         |
| AccelerationPendingDataFilesCount | `long`     | The total number of data files that are pending acceleration                                                 |
| AccelerationPendingDataFilesSize  | `long`     | The total size of data files that are pending acceleration                                                   |
| AccelerationCompletePercentage    | `double`   | The percentage of artifacts that are accelerated, out of the total artifacts that are able to be accelerated |
| NotHealthyReason                  | `string`   | Describes the reason for query acceleration not being healthy. Empty if healthy                              |

## Example

```Kusto
.show external table MyExternalTable operations query_acceleration statistics
```

**Output**

| ExternalTableName | IsEnabled | Hot | HotSize | LastUpdatedDateTime | AccelerationPendingDataFilesCount | AccelerationPendingDataFilesSize | AccelerationCompletePercentage | NotHealthyReason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MyExternalTable | True | 1.00:00:00 | 37 | 56877928187 | 2024-08-13 19:54:47.5868860 | 0 | 100 | |
| MyExternalTable2 | True | 1.00:00:00 | 104 | 60467660293 | 2024-08-13 19:54:47.5868860 | 0 | 100 | |

## Related content

* [Query acceleration policy](query-acceleration-policy.md)
* [.alter query acceleration policy command](alter-query-acceleration-policy-command.md)
* [.alter-merge query acceleration policy command](alter-merge-query-acceleration-policy-command.md)
* [.delete query acceleration policy command](delete-query-acceleration-policy-command.md)
* [.show query acceleration policy command](show-query-acceleration-policy-command.md)
