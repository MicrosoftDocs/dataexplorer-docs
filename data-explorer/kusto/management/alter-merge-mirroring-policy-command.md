---
title: .alter-merge table policy mirroring command
description: Learn how to use the `.alter-merge table policy mirroring` command to create a logical copy of tables of your database.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 04/22/2025
monikerRange: "microsoft-fabric"
---

# .alter-merge table policy mirroring command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)]

Changes the tables's [mirroring policy](mirroring-policy.md). The mirroring policy creates a logical copy of tables in your database in delta parquet format and allows you to partition your files to improve query speed. Each partition is represented as a separate column using the *PartitionName* listed in the *Partitions* list. This means there are more columns in the target than in your source table.

## Syntax

(`.alter` | `.alter-merge`) `table` *TableName* `policy mirroring`
[`partition` `by` (*Partitions*)]
`dataformat` = `parquet`
[`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| string| :heavy_check_mark:|A table name that adheres to the [Entity names](../query/schema-entities/entity-names.md) rules.|
|*Partitions*| string| | A comma-separated list of columns used to divide the data into smaller partitions. See [Partitions formatting](#partitions-formatting). |
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|

[!INCLUDE [partitions-formatting](../includes/partitions-formatting.md)]

> [!NOTE]
> Each partition is represented as a separate column using the *PartitionName* listed in the *Partitions* list. *PartitionName* must be a case insensitive unique string, both among other partition names and the column names of the mirrored table.

## Supported properties

|Name|Type|Description|
|--|--|--|
|`IsEnabled`| `bool`| A Boolean value that determines whether the mirroring policy is enabled. Default value is `true`. When the mirroring policy is disabled and set to `false`, the underlying mirroring data is soft-deleted and retained in the database. |
|`TargetLatencyInMinutes`| `int`| The write operation delay in minites. By default, the write operation can take up to 3 hours or until there's 256 MB of data available. You can adjust the delay to a value between 5 minutes and 3 hours. |
|`Backfill`| `bool`| When set to `true`, mirroring starts from the `EffectiveDateTime`. If `EffectiveDateTime` isn't specified, all of the table data is mirrored. Default value is `false`.|
|`EffectiveDateTime`| `datetime`| Relevant when Backfill is set to `true`. If provided, mirroring starts from the specified value.|

[!INCLUDE [mirroring-note](../includes/mirroring-note.md)]

## Examples

### .alter table policy mirroring

In the following example, a table called *myTable* is mirrored. The data is partitioned first by name and then by date.

```kusto
.alter table myTable policy mirroring
  partition by (Name: string=Name, Date: datetime= startofday(timestamp))
  dataformat=parquet
  with
  (IsEnabled=true, Backfill=true, EffectiveDateTime=datetime(2025-01-01))
```

## Related content

* To check mirroring operations, see [.show table mirroring operations command](show-table-mirroring-operations-command.md).
* To delete mirroring operations, see [.delete table policy mirroring command](delete-table-mirroring-policy-command.md).
