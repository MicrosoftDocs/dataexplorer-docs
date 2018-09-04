---
title: Row Store policy control commands - Azure Kusto | Microsoft Docs
description: This article describes Row Store policy control commands in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Row Store policy control commands

Row Store policy is a policy object that can be attached to the cluster to 
define the row store resources to be used for the streaming ingestion and their usage pattern.


## .show cluster policy rowstore

This command shows the rowstore policy of the cluster.

**Syntax**

* `.show` `cluster` `policy` `rowstore`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|PolicyName|`string`|The policy name - RowStorePolicy
|EntityName|`string`|Empty                         
|Policy    |`string`|A JSON object that defines the row stores policy, formatted as [row stores policy object](#row-stores-policy-object)

**Example**

```kusto
.show cluster policy rowstore 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|RowStorePolicy||{  "TableSealThresholdBytes": 209715200,  "WriteAheadDistanceToSizeRatioThreshold": 2.0,  "StorageRoots": [    "https://somestorage.blob.core.windows.net/;******",    "https://someotherstorage.blob.core.windows.net/;******",  ]}


## Row stores policy object

|Property  |Type    |Description                                                       |
|----------|--------|------------------------------------------------------------------|
|TableSealThresholdBytes |`long`  |The threshold of amount of data to be moved to the column (extent) storage|
|WriteAheadDistanceToSizeRatioThreshold|`double`|Threshold that controls external triggering of write-ahead log trimming  based on ratio between WriteAheadDistance (size of the write ahead log) and the effective size of the data stored in RowStore. The smaller threshold will result in more frequent rate of trimming.|
|StorageRoots|`array`|An array of storages (Azure containers / local folders) to store the row store data. This setting is controlled by system administrator and should not be modified manually.|

## .alter cluster policy rowstore

This command sets the rowstore policy of the cluster.

**Syntax**

* `.alter` `cluster` `policy` `rowstore` *RowStorePolicyObject*

*RowStorePolicyObject* is a JSON object that has row stores policy object defined.


**Example**

```kusto
.alter cluster policy rowstore '{  "TableSealThresholdBytes": 209715200,  "WriteAheadDistanceToSizeRatioThreshold": 2.0,  "StorageRoots": ["some container", "another container"]}'
```

## .alter-merge cluster policy rowstore

This command merges the rowstore policy with the existing one on the cluster.

**Syntax**

* `.alter-merge` `cluster` `policy` `rowstore` *RowStorePolicyObject*

*RowStorePolicyObject* is a JSON object that has row stores policy object defined.


**Example**

```kusto
.alter-merge cluster policy rowstore '{"TableSealThresholdBytes": 209715200}'
```
