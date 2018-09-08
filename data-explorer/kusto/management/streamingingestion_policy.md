---
title: Streaming Ingestion policy control commands - Azure Kusto | Microsoft Docs
description: This article describes Streaming Ingestion policy control commands in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Streaming Ingestion policy control commands

Streaming Ingestion policy is a policy object that can be attached to a database or a table 
to allow streaming ingestion to it and to define the row stores to be used for the streaming ingestion.
The set of rowstores is defined in the [cluster rowstore policy](rowstore_policy.md)

## Target scenarios

Streaming ingestion is targeted for scenarios where customer has large number of tables (in one or more databases), 
and stream of data into each one is relatively small (few records per sec) while overall data ingestion volume is high (thousands of records per second).

The classic (bulk) ingestion is advised when amount of data grows to more than 1MB/sec.

> [!WARNING]
> As of this writing, Streaming Ingestion is in Beta mode.

If you are interested in trying it out please read [Streaming Ingestion (Beta)](https://kusdoc2.azurewebsites.net/docs/concepts/streamingingestion.html).

## .show policy streamingingestion

This command shows the streamingingestion policy of the database / table.

**Syntax**

* `.show` `database` MyDatabase `policy` `streamingingestion`
* `.show` `table` MyTable `policy` `streamingingestion`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|PolicyName|`string`|The policy name - StreamingIngestionPolicy
|EntityName|`string`|Database / table name                         
|Policy    |`string`|A JSON object that defines the streaming ingestion policy, formatted as [streaming ingestion policy object](#streaming-ingestion-policy-object)

**Example**

```kusto
.show database DB1 policy streamingingestion 

.show table T1 policy streamingingestion 
```

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|StreamingIngestionPolicy|DB1|{  "NumberOfRowStores": 10 }

## Streaming Ingestion policy object

|Property  |Type    |Description                                                       |
|----------|--------|------------------------------------------------------------------|
|NumberOfRowStores |`int`  |The number of row stores assigned to the entity|
|RowStoreIds|`array`|The list of rowstores assigned to the entity|

## .alter policy streamingingestion

This command sets the streamingingestion policy of the database / table.

**Syntax**

* `.alter` `database` MyDatabase `policy` `streamingingestion` *StreamingIngestionPolicyObject*

* `.alter` `table` MyTable `policy` `streamingingestion` *StreamingIngestionPolicyObject*

*StreamingIngestionPolicyObject* is a JSON object that has streaming ingestion policy object defined.

Note: the best practice is to set only the number of the row stores and the system will choose the
row store names automatically.


**Example**

```kusto
.alter database MyDatabase policy streamingingestion '{  "NumberOfRowStores": 10}'
```

## .delete policy streamingingestion

Deletes the the streamingingestion policy from the database / table.

**Syntax**

* `.delete` `database` MyDatabase `policy` `streamingingestion`
* `.delete` `table` MyTable `policy` `streamingingestion`

**Returns**

The command deletes the table's / database's streamingingestion policy object and then returns 
the output of the corresponding [.show policy streamingingestion](#show-policy-streamingingestion)
command.

**Example**

```kusto
.delete database MyDatabase policy streamingingestion 
```