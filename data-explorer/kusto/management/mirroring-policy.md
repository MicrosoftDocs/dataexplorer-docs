---
title: Mirroring policy
description: Learn how to use the mirroring policy.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 05/23/2024
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Mirroring policy

::: zone pivot="fabric"
The mirroring policy commands allow you to view, change and partition, and delete your table mirroring policy and mirroring file partition. They also provide a way to check the mirroring latency by reviewing the operations mirroring status.

## Management commands

* Use [.show table policy mirroring command](show-table-mirroring-policy-command.md) to show the current mirroring policy of the table.
* Use [.alter-merge table policy mirroring command](alter-merge-mirroring-policy-command.md) to change the current mirroring policy.
* Use [.delete table policy mirroring command](delete-table-mirroring-policy-command.md) to soft-delete the current mirroring policy.
* Use [.show table mirroring operations command](show-table-mirroring-operations-command.md) to check operations mirroring status.
* Use [.Show table mirroring operations exported artifacts command](show-table-mirroring-operations-exported-artifacts.md) to check operations exported artifacts status.
* Use [.show table mirroring operations failures](show-table-mirroring-operations-failures.md) to check operations mirroring failure status.


## The policy object

The mirroring policy includes the following properties:

| Property | Description | Values | Default|
|---|---|---|---|
| **Format** | The format of your mirrored files. | Valid value is `parquet`. | `parquet` |
|**ConnectionStrings** |An array of connection strings that help configure and establish connections. In some environments this value is autopopulated. | | |
|  **IsEnabled** | Determines whether the mirroring policy is enabled. When the mirroring policy is disabled and set to `false`, the underlying mirroring data is retained in the database. | `true`, `false`, `null`. | `null` |
| **Partitions** | A comma-separated list of columns used to divide the data into smaller partitions. | See [Partitions formatting](#partitions-formatting). | |

[!INCLUDE [partitions-formatting](../../includes/partitions-formatting.md)]

> [!NOTE]
> *PartitionName* must be a case insensitive unique string, both among other partition names and the column names of the mirrored table.

## Data types mapping

To ensure compatibility and optimize queries, ensure that your data types are properly mapped to the parquet data types.

### Event house to Delta parquet data types mapping

 Event house data types are mapped to Delta Parquet data types using the following rules:

| Event house data type | Delta data type |
| --------------- | -----------------|
| `bool`     | `boolean` |
| `datetime` | `timestamp OR date (for date-bound partition definitions)` |
| `dynamic`  | `string` |
| `guid` | `string` |
| `int` | `integer` |
| `long` | `long` |
| `real` | `double` |
| `string` | `string` |
| `timespan` | `long` |
| `decimal` | `decimal(38,18)` |

For more information on Event house data types, see [Scalar data types](/azure/data-explorer/kusto/query/scalar-data-types/index?context=/fabric/context/context-rta&pivots=fabric).

## Example policy

```json
{
  "Format": "parquet",
  "IsEnabled": true,
  "Partitions": null,
}

```

::: zone-end

::: zone pivot="azuredataexplorer, azuremonitor"

This feature isn't supported.

::: zone-end
