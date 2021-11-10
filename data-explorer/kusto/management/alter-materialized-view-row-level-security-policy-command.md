---
title: .alter materialized view row level security policy command- Azure Data Explorer
description: This article describes the .alter materialized view row level security policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/04/2021
---
# .alter materialized view row level security policy

Enable or disable a materialized view's [row_level_security policy](rowlevelsecuritypolicy.md). The Row Level Security simplifies the design and coding of security. It lets you apply restrictions on data row access in your application. For example, limit user access to rows relevant to their department, or restrict customer access to only the data relevant to their company.

> [!NOTE]
> Even when the policy is disabled, you can force it to apply to a single query. Enter the following line before the query:
>
> `set query_force_row_level_security;`
>
> This is useful if you want to try various queries for row_level_security, but don’t want it to actually take effect on users. Once you’re confident in the query, enable the policy.

For more information about running queries on the row level security policy, see [row_level_security policy](rowlevelsecuritypolicy.md).

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `policy` `row-level-security` [`enable` | `disable`]

### Example

Enable the policy at the materialized-view level:

```kusto
.alter materialized-view MyMaterializeView policy row-level-security enable "AnonymizeSensitiveData"
```

Disable the policy at the materialized-view level:

```kusto
.alter materialized-view MyMaterializeView policy row-level-security disable "AnonymizeSensitiveData"
```
