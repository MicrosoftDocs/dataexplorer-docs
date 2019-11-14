---
title: Export data to an external table - Azure Data Explorer | Microsoft Docs
description: This article describes Export data to an external table in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/11/2019
---
# Export data to an external table

You can export data by defining an [external table](../externaltables.md) and exporting data to it. The table properties are specified when [creating the external table](../externaltables.md#create-or-alter-external-table), therefore, you don't need to embed the table's properties in the export command. The export command references the external table by name. Export data requires [database admin permission](../access-control/role-based-authorization.md).

**Syntax:**

`.export` [`async`] `to` `table` *ExternalTableName* <br>
[`with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <| *Query*

It isn't possible to override the external table properties using this command. For example, you can't export data in Parquet format to an external table whose data format is CSV. 
Each type of external table supports different properties in the export command. 

If the external table is partitioned, exported artifacts will be written to their respective directories, according to the partition definitions as seen in the [example](#partitioned-external-table-example). 
The export query output schema must include all columns defined by the partitions. For example, if the table is partitioned by *DateTime*, 
the query output schema must include a Timestamp column that matches the *TimestampColumnName* defined in the external table partitioning definition.

|External Table Type|Property|Type|Description                                                                               
|--------------------|----------------|-------|---|
|`Blob`|`sizeLimit`|`long`|The size limit at which to switch to the next blob (before compression). The default value is 100MB, max 1GB.|

**Output:**

|Output parameter |Type |Description
|---|---|---
|ExternalTableName  |String |The name of the external table.
|Path|String|Output path.
|NumRecords|String| Number of records exported to path.

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

```
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

```
.export to table PartitionedExternalBlob <| T
```

|ExternalTableName|Path|NumRecords|
|---|---|---|
|ExternalBlob|http://storageaccount.blob.core.windows.net/container1/CustomerName=customer1/2019/01/01/fa36f35c-c064-414d-b8e2-e75cf157ec35_1_58017c550b384c0db0fea61a8661333e.csv|10|
|ExternalBlob|http://storageaccount.blob.core.windows.net/container1/CustomerName=customer2/2019/01/01/fa36f35c-c064-414d-b8e2-e75cf157ec35_2_b785beec2c004d93b7cd531208424dc9.csv|10|

If the command is executed asynchronously (by using the `async` keyword), the output is available using the [show operation details](../operations.md#show-operation-details) command.
