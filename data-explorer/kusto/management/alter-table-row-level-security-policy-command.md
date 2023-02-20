---
title: .alter table row level security policy command- Azure Data Explorer
description: This article describes the .alter table row level security policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/04/2021
---
# .alter table row level security policy

Enable or disable a table's [row_level_security policy](rowlevelsecuritypolicy.md). The Row Level Security simplifies the design and coding of security. It lets you apply restrictions on data row access in your application. For example, limit user access to rows relevant to their department, or restrict customer access to only the data relevant to their company.

> [!NOTE]
> Even when the policy is disabled, you can force it to apply to a single query. Enter the following line before the query:
>
> `set query_force_row_level_security;`
>
> This is useful if you want to try various queries for row_level_security, but don’t want it to actually take effect on users. Once you’re confident in the query, enable the policy.

For more information about running queries on the row level security policy, see [row_level_security policy](rowlevelsecuritypolicy.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `row_level_security` [`enable` | `disable`] *Query*

## Arguments

- *TableName* - Specify the name of the table.  
- *Query* - Specify the query to be run. For more information about running queries on the row level security policy, see [row_level_security policy](rowlevelsecuritypolicy.md).

### Examples

Enable the policy at the table level:

```kusto
.alter table MyTable policy row_level_security enable "AnonymizeSensitiveData"
```

Disable the policy at the table level:

```kusto
.alter table MyTable policy row_level_security disable "AnonymizeSensitiveData"
```
