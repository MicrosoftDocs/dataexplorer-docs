---
title: .alter-merge table policy mirroring command
description: Learn how to use the `.alter-merge table policy mirroring` command to mirror your data in Azure storage.
ms.reviewer: sharmaanshul
ms.topic: reference
ms.date: 01/16/2024
---

# .alter-merge table policy mirroring command

::: zone pivot="fabric"

Changes the tables's [mirroring policy](mirroring-policy.md). The mirroring policy mirrors tables in Azure Data Explorer in parquet format and allows you to partition your files to improve query speed. Each partition is represented as a separate column using the *PartitionName* listed in the *Partitions* list. This means there are more columns in the target than in your source table.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run these commands.

## Syntax

(`.alter` | `.alter-merge`) `table` *TableName* `policy mirroring` 
[`partition` `by` (*Partitions*)] 
`dataformat`= `parquet`  
[`with` (`IsEnabled`=`IsEnabledValue`)]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| string| :heavy_check_mark:|A table name that adheres to the [Entity names](../query/schema-entities/entity-names.md) rules.|
|*Partitions*| string| | A comma-separated list of columns used to divide the data into smaller partitions. *PartitionName* must be a case insensitive unique string both among other partition names and the column names of the mirrored table. See [Partitions formatting](external-tables-azure-storage.md#partitions-formatting).|
|*DataFormat*| string| :heavy_check_mark:| The data format. Valid values: `Parquet`.|

## Properties

|Name|Type|Description|
|--|--|--|
|`IsEnabled`| `bool`| A Boolean value that determines whether the mirroring policy is enabled. Default is `true`. When the mirroring policy is disabled and set to `false`, the underlying mirroring data is retained in the database but is considered inactive. |

## Examples

### .alter table policy mirroring

In the following example, a table called *NYCTaxiRides* is mirrored. The data is partitioned first by name and then by date.

```kusto
.alter table NYCTaxiRides policy mirroring
partition by (Flag:string=store_and_fwd_flag, Date:datetime= startofday(timestamp))
dataformat=parquet
with
(IsEnabled=true
)
```

## Related content

* To check mirroring operations, see [.show table mirroring operations command](show-table-mirroring-operations-command.md).
* To delete mirroring operations, see [.delete table policy mirroring command](delete-table-mirroring-policy-command.md).

::: zone-end

::: zone pivot="azuredataexplorer, azuremonitor, azurestorage"

This feature isn't supported.

::: zone-end
