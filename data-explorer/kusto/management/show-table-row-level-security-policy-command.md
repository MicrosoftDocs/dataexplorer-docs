---
title: .show table policy row_level_security command
description: Learn how to use the `.show table policy row_level_security` command to display the table's row level security policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 08/11/2024
---
# .show table policy row_level_security command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Display the table's [row_level_security policy](row-level-security-policy.md). The Row Level Security simplifies the design and coding of security. It lets you apply restrictions on data row access in your application. For example, limit user access to rows relevant to their department, or restrict customer access to only the data relevant to their company.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `row_level_security`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

## Example

Display the policy at the table level:

```kusto
.show table MyTable policy row_level_security
```
