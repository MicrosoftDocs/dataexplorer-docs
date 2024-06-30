---
title:  .alter table policy row_level_security command
description: Learn how to use the `.alter table policy row_level_security` command to enable or disable a table's row level security policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/28/2023
---
# .alter table policy row_level_security command

Turn on or turn off a table's [row_level_security policy](row-level-security-policy.md). The Row Level Security simplifies the design and coding of security. It lets you apply restrictions on data row access in your application. For example, limit user access to rows relevant to their department, or restrict customer access to only the data relevant to their company.

> [!NOTE]
> Even when the policy is disabled, you can force it to apply to a single query. Enter the following line before the query:
>
> `set query_force_row_level_security;`
>
> This is useful if you want to try various queries for row_level_security, but don’t want it to actually take effect on users. Once you’re confident in the query, turn on the policy.

For more information about running queries on the row level security policy, see [row_level_security policy](row-level-security-policy.md).

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `row_level_security` [`enable` | `disable`] *Query*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark:| The name of the table.|
| *Query* | `string` |  :heavy_check_mark: | The query to run. For more information, see [row_level_security policy](row-level-security-policy.md).|

### Examples

#### Turn on the policy at the table level

```kusto
.alter table MyTable policy row_level_security enable "AnonymizeSensitiveData"
```

#### Turn off the policy at the table level

```kusto
.alter table MyTable policy row_level_security disable "AnonymizeSensitiveData"
```
