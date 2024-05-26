---
title:  Export data to an external table
description:  This article describes Export data to an external table.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/20/2023
---
# Export data to an external table

You can export data by defining an [external table](../show-external-tables.md) and exporting data to it.
 The table properties are specified when [creating the external table](../external-tables-azure-storage.md).
 The export command references the external table by name.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.export` [`async`] `to` `table` *externalTableName* <br>
[`with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`] `<|` *query*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *externalTableName* | `string` |  :heavy_check_mark: | The name of the external table to which to export.|
| *propertyName*, *propertyValue* | `string` | | A comma-separated list of optional [properties](#supported-properties).|
| *query* | `string` |  :heavy_check_mark: | The export query.|

## Supported properties

The following properties are supported as part of the export to external table command.

| Property | Type | Description| Default
|---|---|---|---|
| `sizeLimit`     |`long`  |The size limit in bytes of a single storage artifact being written (prior to compression). A full row group of size `parquetRowGroupSize` will be written before checking whether this row group has reached the size limit and should start a new artifact. Valid range: 100 MB (default) to 1 GB.|
|`distributed`   |`bool`  |Disable/enable distributed export. Setting to false is equivalent to `single` distribution hint. | Default is `true`.
| `distribution` | `string` |Distribution hint (`single`, `per_node`, `per_shard`).  See more details in [Distribution settings](#distribution-settings)| Default is `per_node`.
|`distributionKind`   |`string`  |Optionally switches to uniform distribution when the external table is partitioned by string partition. Valid values are `uniform` or `default`. See more details in [Distribution settings](#distribution-settings)|
|`concurrency`|*Number*|Hints the system how many partitions to run in parallel. See more details in [Distribution settings](#distribution-settings)| The default value is 16. |
|`spread`|*Number*|Hints the system how to distribute the partitions among cluster nodes. See more details in [Distribution settings](#distribution-settings)| The default value is `Min(64, number-of-nodes)`. |
|`parquetRowGroupSize`|`int`  |Relevant only when data format is Parquet. Controls the row group size in the exported files. This value takes precedence over `sizeLimit`, meaning a full row group will be exported before checking whether this row group has reached the size limit and should start a new artifact. | Default row group size is 100,000 records.|

### Distribution settings

The distribution of an export to external table operation indicates the number of nodes and threads that are writing to storage concurrently. The default distribution depends on the external table partitioning:

| External table partitioning | Default distribution
|---|---|
|External table isn't partitioned, or partitioned by `datetime` column only|Export is distributed `per_node` - all nodes in the cluster are exporting concurrently. Each node writes the data assigned to that node. The number of files exported by a node will be greater than one, only if the size of the data from that node exceeds `sizeLimit`.|
|External table is partitioned by a string column|The data to export is moved between the nodes, such that each node writes a subset of the partition values. A single partition is always written by a single node. The number of files written per partition should be greater than one only if the data exceeds `sizeLimit`. If the external table includes several string partitions, then data is partitioned between the node based on the first partition. Therefore, it is recommended to define the partition with most uniform distribution as the first one.|

#### Change the default distribution settings

Changing the default distribution settings can be useful in the following cases:

| Use case| Description| Recommendation
|---|---|--|
| **Reduce the number of exported files** |Export is creating too many small files, and you would like it to create a smaller number of larger files.|Set `distribution`=`single` or `distributed`=`false` (both are equivalent) in the command properties. Only a single thread performs the export. The downside of this is that the export operation can be slower, as concurrency is much reduced.|
| **Reduce the export duration** |Increasing the concurrency of the export operation, to reduce its duration.| Set `distribution`=`per_shard` in the command properties. This means concurrency of the write operations is per data shard, instead of per node. This is only relevant when exporting to an external table that isn't partitioned by string partition. This might create too much load on storage, potentially resulting in throttling. See [Storage failures](export-data-to-storage.md#storage-failures).|
| **Reduce the export duration for external tables that are partitioned by a string partition** | If the partitions are not uniformly distributed between the nodes, export might take a longer time to run. For example, if there is a single partition that's much larger than others, most of the export work is done by the single node assigned to that partition, while other nodes will be mostly idle. See [Distribution settings](#distribution-settings). | There are several settings you can change: <br>* If there is more than one string partition, define the one with best distribution first.</br><br>* Set `distributionKind`=`uniform` in the command properties. This setting disables the default distribution settings for string-partitioned external tables. Export will run with `per-node` distribution and each node will export the data assigned to the node. A single partition might be written by several nodes, and the number of files increases accordingly. To increase concurrency even further, set `distributionKind`=`uniform` along with `distribution`=`per_shard` for highest concurrency (at the cost of potentially many more files written)</br><br>* If the cause for slow export isn't outliers in the data, reduce duration by increasing concurrency, without changing partitioning settings. Use the `hint.spread` and `hint.concurrency` properties, which determine the concurrency of the partitioning. See [partition operator](../../query/partition-operator.md). By default, the number of nodes exporting concurrently (the `spread`) will be the minimum value between 64 and the number of cluster nodes. Setting `spread` to a higher number than number of nodes increases the concurrency on each node (max value for `spread` is 64).

## Authentication and authorization

In order to export to an external table, you must set up write permissions. For more information, see the **Write permissions** for [Azure Storage external table](../external-tables-azure-storage.md#authentication-and-authorization) or [SQL Server external table](../external-sql-tables.md).

## Output

|Output parameter |Type |Description
|---|---|---
|ExternalTableName  | `string` |The name of the external table.
|Path| `string` |Output path.
|NumRecords| `string` | Number of records exported to path.

## Notes

* The export query output schema must match the schema of the external table, including all columns defined by the partitions. For example, if the table is partitioned by *DateTime*, the query output schema must have a Timestamp column matching the *TimestampColumnName*. This column name is defined in the external table partitioning definition.

* It isn't possible to override the external table properties using the export command.
 For example, you can't export data in Parquet format to an external table whose data format is CSV.

* If the external table is partitioned, exported artifacts are written to their respective directories according to the partition definitions as seen in the [partitioned external table example](#partitioned-external-table-example).
  * If a partition value is null/empty or is an invalid directory value, per the definitions of the target storage, the partition value is replaced with a default value of `__DEFAULT_PARTITION__`.

* For suggestions to overcome storage errors during export commands, see [failures during export commands](export-data-to-storage.md#failures-during-export-commands).

* External table columns are mapped to suitable target format data types, according to [data types mapping](export-data-to-storage.md#data-types-mapping) rules.

* Parquet native export is a more performant, resource light export mechanism. An exported 'datetime' column is currently unsupported by Synapse SQL 'COPY'.

### Number of files

The number of files written per partition depends on the [distribution settings](#distribution-settings) of the export operation:

 * If the external table includes datetime partitions only, or no partitions at all, the number of files written (for each partition, if exists) should be similar to the number of nodes in the cluster (or more, if `sizeLimit` is reached). When the export operation is distributed, all nodes in the cluster export concurrently. To disable distribution, so that only a single node does the writes, set `distributed` to false. This process creates fewer files, but will reduce the export performance.

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
partition by (CustomerName:string=CustomerName, Date:datetime=startofday(Timestamp))   
pathformat = ("CustomerName=" CustomerName "/" datetime_pattern("yyyy/MM/dd", Date))   
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

If the command is executed asynchronously (by using the `async` keyword), the output is available using the [show operation details](..query/show-operations.md) command.
