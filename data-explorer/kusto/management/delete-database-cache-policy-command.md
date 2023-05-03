---
title: .delete database cache policy command - Azure Data Explorer
description: This article describes the .delete database cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/25/2023
---
# .delete database cache policy

Use this command to delete the database cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) allows your cluster to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `caching`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database.|

## Example

The following example deletes the caching policy.

```kusto
.delete database MyDatabase policy caching
```
