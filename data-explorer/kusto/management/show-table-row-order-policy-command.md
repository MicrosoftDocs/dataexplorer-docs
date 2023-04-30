---
title: .show table row order policy command- Azure Data Explorer
description: This article describes the .show table row order policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/09/2023
---
# .show table row order policy

Display a table's [row order policy](roworderpolicy.md). The row order policy is an optional policy set on tables, that suggests the desired ordering of rows in a data shard. The purpose of the policy is to improve performance of queries which are known to be narrowed to a small subset of values in the ordered columns.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `roworder` 

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

## Example

```kusto
.show table events policy roworder 
```
