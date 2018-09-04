---
title: Row Stores - Azure Kusto | Microsoft Docs
description: This article describes Row Stores in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Row Stores

## show rowstores

Shows the list of streaming ingestion rowstores associated with the cluster.

```kusto
.show rowstores
```

**Returns**

This command returns a table that has one record per rowstore,
with the following columns:

|Column    |Type    |Description                                                                                                                                                           |
|----------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|RowStoreName|`string`|The name of the rowstore|                                                                                                                |
|RowStoreId  |`guid`|The id of the rowstore|
|WriteAheadLogStorage|`string`|The path to the persistent storage container of the rowstore| 
|IsActive|`bool`|Is the rowstore active|
|AssignedToNode|`string`|The cluster node to which the rowstore is asigned|
|NumberOfKeys|`long`|The number of table keys stored in the rowstore| 
|WriteAheadLogSize|`string`|The size of the persistent storage of the rowstore| 
|WriteAheadLogStartOffset|`string`|The start offset in the persistent storage of the rowstore| 
|LocalStorageSize|`ulong`|The rowstore local storage size|


## show table rowstores

Shows the list of streaming ingestion rowstores associated with a table.

**Syntax**

* `.show` `table` *TableName* `rowstores` 

**Example**

```kusto
.show table MyTable rowstores
```

**Returns**

This command returns a table that has one record per rowstore
plus one record per each extent that contains data from any rowstore
per row store with the following columns:

|Column    |Type    |Description                                                                                                                                                           |
|----------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|DatabaseName|`string`|The database to which the table belong                                                                                                                |
|TableName  |`string`|The table name|
|ExtentId  |`string`|The id of the extent. Zero guid for rowstore data that is not in any extent yet|
|IsSealed  |`bool`|True for extent data, false for the data yet in the rowstore|
|RowStoreName  |`string`|The rowstore name|
|RowStoreId  |`string`|The rowstore id|
|RowStoreKey  |`string`|The table key inside the rowstore|
|OrdinalFrom  |`long`|The minimal ordinal in the rowstore|
|OrdinalTo  |`long`|The maximum ordinal in the rowstore|


## show rowstore

Shows the information about the streaming ingestion rowstore content.

**Syntax**

* `.show` `rowstore` *RowStore*  

**Example**

```kusto
.show rowstore MyRowStore
```

**Returns**

This command returns a table that has one record per Kusto table with the data stored in the rowstore,
with the following columns:

|Column    |Type    |Description                                                                                                                                                           |
|----------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|RowStoreName|`string`|The name of the rowstore|                                                                                                                |
|RowStoreId  |`guid`|The id of the rowstore|
|RowStoreKey|`string`|The table's key in the rowstore| 
|OrdinalFrom|`long`|The smallest ordinal for a table in the rowstore|
|OrdinalTo|`long`|The biggest ordinal for a table in the rowstore|
|EstimatedDataSize|`ulong`|Estimated data size stored in the rowstore for a table| 
|MinWriteAheadLogOffset|`ulong`|The start offset in the persistent storage of the rowstore| 
|LocalStorageSize|`ulong`|The rowstore local storage size for a table|
|LocalStorageStartOffset|`ulong`|The start offset of the local storage size for a table|


## create rowstore

Creates a row store in the cluster.

**Syntax**

* `.create` `rowstore` *RowStoreName*  `writeaheadlog` (' storage path')

* `.create` `rowstore` *RowStoreName*  `volatile`

**Example**

```kusto
.create rowstore MyRowStore writeaheadlog (h"http://....")

.create rowstore MyRowStore volatile
```

Note: there are rowstores that are created automatically by the cluster.
Currently they have names RowStore-xxxx, where xxxx is a number.
Row stores with such pattern in the name cannot be created manually.

## drop rowstore

Drops a row store from the cluster.

**Syntax**

* `.drop` `rowstore` *RowStoreName*  [ifexists]

**Example**

```kusto
.drop rowstore MyRowStore 
```

Note: there are rowstores that are created automatically by the cluster.
Currently they have names RowStore-xxxx, where xxxx is a number.
Row stores with such pattern in the name cannot be droped manually.