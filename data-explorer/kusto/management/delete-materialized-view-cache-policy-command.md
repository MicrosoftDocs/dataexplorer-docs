---
title: .delete materialized view cache policy command - Azure Data Explorer
description: This article describes the .delete materialized view cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/09/2023
---
# .delete materialized view cache policy

Delete the materialized view cache policy. To speed up queries, data is cached on processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) allows your cluster to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `materialized view` *MaterializedViewName* `policy` `caching`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view.|

## Example

The following example deletes the caching policy.

```kusto
.delete materialized-view MyMaterializedView policy caching 
```
