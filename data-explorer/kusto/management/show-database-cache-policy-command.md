---
title: .show database cache policy command - Azure Data Explorer
description: Learn how to use the `.show database cache policy` command to show the database cache policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/22/2023
---
# .show database cache policy

Show the database cache policy. To speed up queries on data, Azure Data Explorer caches it on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority.  

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `policy` `caching`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database.|

## Returns

Returns a JSON representation of the policy.

## Example

The following example shows the table caching policy:

```kusto
.show database MyDatabase policy caching 
```
