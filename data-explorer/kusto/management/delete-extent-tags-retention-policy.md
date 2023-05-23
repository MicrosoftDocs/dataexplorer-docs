---
title:  Delete extent tags retention policy management
description: This article describes the delete extent tags retention policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .delete extent tags retention policy

Deletes a table-level or database-level extent tags retention policy. For more information, see [extent tags retention policy](extent-tags-retention-policy.md).

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `extent_tags_retention`

`.delete` `database` *DatabaseName* `policy` `extent_tags_retention`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table for which to delete the extent tags retention policy.|
|*DatabaseName*|string|&check;|The name of the database for which to delete the extent tags retention policy.|

## Example

The following command deletes the extent tags retention policy for a table named `MyTable`.

```kusto
.delete table MyTable policy extent_tags_retention
```
