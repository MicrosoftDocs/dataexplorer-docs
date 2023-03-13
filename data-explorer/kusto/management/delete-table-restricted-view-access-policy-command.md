---
title: .delete restricted view access policy command - Azure Data Explorer
description: This article describes the .delete restricted view access policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/09/2023
---
# .delete restricted view access policy

Delete the optional table [restricted view access policy](restrictedviewaccesspolicy.md). When this policy is turned on for a table, only principals who have an [UnrestrictedViewer](./access-control/role-based-access-control.md) role in the database can query the data. Deleting a policy is similar to turning off a policy.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `restricted_view_access`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table.|

## Example

```kusto
.delete table MyTable policy restricted_view_access
```
