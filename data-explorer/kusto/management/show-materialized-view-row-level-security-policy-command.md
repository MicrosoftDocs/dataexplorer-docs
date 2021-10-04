---
title: .show materialized view row level security policy command- Azure Data Explorer
description: This article describes the .show materialized view row level security policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/04/2021
---
# .show materialized view row level security policy

Display a materialized view's [row_level_security policy](rowlevelsecuritypolicy.md). The Row Level Security simplifies the design and coding of security. It lets you apply restrictions on data row access in your application. For example, limit user access to rows relevant to their department, or restrict customer access to only the data relevant to their company.

For more information about running queries on the row level security policy, see [row_level_security policy](rowlevelsecuritypolicy.md).

## Syntax

`.display` `materialized-view` *MaterializedViewName* `policy` `row-level-security` [`enable` | `disable`]

## Arguments

*MaterializedViewName* - Specify the name of the materialized view.

## Returns

Returns a JSON representation of the policy.

### Example

Display the policy at the materialized-view level:

```kusto
.show materialized-view MyMaterializeView policy row-level-security
```
