---
title: Export data to an external table - Azure Data Explorer
description: This article describes Export data to an external table in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/30/2020
---
# Export data to an external table

You can export data by defining an [external table](../external-table-commands.md) and exporting data to it.
 The table properties are specified when [creating the external table](../external-tables-azurestorage-azuredatalake.md#create-or-alter-external-table). You don't need to embed the table's properties in the export command. 
 The export command references the external table by name. Export data requires [database admin permission](../access-control/role-based-authorization.md).

## Syntax

`.export` [`async`] `to` `table` *ExternalTableName* <br>
[`with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <| *Query*

## Output

|Output parameter |Type |Description
|---|---|---
|ExternalTableName  |String |The name of the external table.
|Path|String|Output path.
|NumRecords|String| Number of records exported to path.

## Notes

* The export query output schema must match the schema of the external table, including all columns defined by the partitions. For example, if the table is partitioned by *DateTime*, the query output schema must have a Timestamp column matching the *TimestampColumnName*. This column name is defined in the external table partitioning definition.

* It isn't possible to override the external table properties using the export command.
 For example, you can't export data in Parquet format to an external table whose data format is CSV.

* The following properties are supported as part of the export command. See the [export to storage](export-data-to-storage.md) section for details: 
   * `sizeLimit`, `parquetRowGroupSize`, `distributed`.

* If the external table is partitioned, exported artifacts will be written to their respective directories according to the partition definitions as seen in the [partitioned external table example](#partitioned-external-table-example). 
  * If a partition value is null/empty or is an invalid directory value, per the definitions of the target storage, the partition value is replaced with a default value of `__DEFAULT_PARTITION__`. 

### Number of files

The number of files written per partition depends on the settings:
 * If the external table includes datetime partitions only, or no partitions at all, the number of files written (for each partition, if exists) should be similar to the number of nodes in the cluster (or more, if `sizeLimit` is reached). When the export operation is distributed, all nodes in the cluster export concurrently. To disable distribution, so that only a single node does the writes, set `distributed` to false. This process will create fewer files, but will reduce the export performance.

* If the external table includes a partition by a string column, the number of exported files should be a single file per partition (or more, if `sizeLimit` is reached). All nodes still participate in the export (operation is distributed), but each partition is assigned to a specific node. Setting `distributed` to false, will cause only a single node to do the export, but behavior will remain the same (a single file written per partition).

## Examples

### Non-partitioned external table example

ExternalBlob is a non-partitioned external table. 

```kusto
.export to table ExternalBlob <| T
```

|ExternalTableName|Path|NumRecords|
|---|---|---|
|ExternalBlob|http://storage1.blob.core.windows.net/externaltable1cont1/1_58017c550b384c0db0fea61a8661333e.csv|10|

### Partitioned external table example

PartitionedExternalBlob is an external table, defined as follows: 

```kusto
.create external table PartitionedExternalBlob (Timestamp:datetime, CustomerName:string) 
kind=blob
partition by 
   "CustomerName="CustomerName,
   bin(Timestamp, 1d)
dataformat=csv
( 
   h@'http://storageaccount.blob.core.windows.net/container1;secretKey'
)
```

```kusto
.export to table PartitionedExternalBlob <| T
```

|ExternalTableName|Path|NumRecords|
|---|---|---|
|ExternalBlob|http://storageaccount.blob.core.windows.net/container1/CustomerName=customer1/2019/01/01/fa36f35c-c064-414d-b8e2-e75cf157ec35_1_58017c550b384c0db0fea61a8661333e.csv|10|
|ExternalBlob|http://storageaccount.blob.core.windows.net/container1/CustomerName=customer2/2019/01/01/fa36f35c-c064-414d-b8e2-e75cf157ec35_2_b785beec2c004d93b7cd531208424dc9.csv|10|

If the command is executed asynchronously (by using the `async` keyword), the output is available using the [show operation details](../operations.md#show-operation-details) command.