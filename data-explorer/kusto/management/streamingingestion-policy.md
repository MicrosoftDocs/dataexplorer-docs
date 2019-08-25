---
title: Streaming ingestion policy management - Azure Data Explorer | Microsoft Docs
description: This article describes Streaming ingestion policy management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2019
---
# Streaming ingestion policy management

Streaming ingestion policy can be attached to a database or table to allow streaming ingestion to those locations. The policy also defines the row stores used for the streaming ingestion.


For more information on streaming ingestion see [Streaming ingestion (Preview)](data-ingestion/streaming.md). To learn more about the streaming ingestion policy, see [Streaming ingestion policy](../concepts/streamingingestionpolicy.md).

## .show policy streamingingestion

The `.show policy streamingingestion` command shows the streaming ingestion policy of the database or table.

**Syntax**

`.show` `database` MyDatabase `policy` `streamingingestion`
`.show` `table` MyTable `policy` `streamingingestion`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|PolicyName|`string`|The policy name - StreamingIngestionPolicy
|EntityName|`string`|Database or table name
|Policy    |`string`|A JSON object that defines the streaming ingestion policy, formatted as [streaming ingestion policy object](#streaming-ingestion-policy-object)

**Example**

```kusto
.show database DB1 policy streamingingestion 
.show table T1 policy streamingingestion 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|StreamingIngestionPolicy|DB1|{  "NumberOfRowStores": 4 }

### Streaming ingestion policy object

|Property  |Type    |Description                                                       |
|----------|--------|------------------------------------------------------------------|
|NumberOfRowStores |`int`  |The number of row stores assigned to the entity|
|SealIntervalLimit|`TimeSpan?`|Optional limit for the intervals between seal operations on the table. The valid range is between 1 to 24 hours. Default: 24 hours.|
|SealThresholdBytes|`int?`|Optional limit for data amount to be taken for a single seal operation on the table. The valid range for the value is between 10 to 200 MBs. Default: 200 MBs.|

## .alter policy streamingingestion

The `.alter policy streamingingestion` command sets the streamingingestion policy of the database or table.

**Syntax**

* `.alter` `database` MyDatabase `policy` `streamingingestion` *StreamingIngestionPolicyObject*

* `.alter` `table` MyTable `policy` `streamingingestion` *StreamingIngestionPolicyObject*

*StreamingIngestionPolicyObject* is a JSON object that has the streaming ingestion policy object defined.

**Example**

```kusto
.alter database MyDatabase policy streamingingestion '{  "NumberOfRowStores": 4}'

.alter table MyTable policy streamingingestion '{  "NumberOfRowStores": 4}'
```

## .delete policy streamingingestion

The `.delete policy streamingingestion` command deletes the streamingingestion policy from the database or table.

**Syntax** 

`.delete` `database` MyDatabase `policy` `streamingingestion`

`.delete` `table` MyTable `policy` `streamingingestion`

**Returns**

The command deletes the table or database streamingingestion policy object and then returns the output of the corresponding [.show policy streamingingestion](#show-policy-streamingingestion)
command.

**Example**

```kusto
.delete database MyDatabase policy streamingingestion 
```