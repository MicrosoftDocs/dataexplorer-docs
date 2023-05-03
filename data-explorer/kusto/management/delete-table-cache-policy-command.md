---
title:  .delete table cache policy command
description: This article describes the .delete table cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .delete table cache policy

Delete the table cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) allows your cluster to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` [*DatabaseName* `.`]*TableName* `policy` `caching`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string||The name of the database. Use when running outside the database context that contains the table for which to delete the cache policy.|
|*TableName*|string|&check;|The name of the table.|

## Example

The following example deletes the caching policy.

```kusto
.delete table MyTable policy 
```
