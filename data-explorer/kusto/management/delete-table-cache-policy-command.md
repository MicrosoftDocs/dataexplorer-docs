---
title: .delete table policy caching command
description: Learn how to use the `.delete table policy caching` command to delete a table's cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/24/2023
---
# .delete table policy caching command

Delete the table's cache policy. To speed up queries on data, Azure Data Explorer caches it on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` [*DatabaseName* `.`]*TableName* `policy` `caching`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

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
