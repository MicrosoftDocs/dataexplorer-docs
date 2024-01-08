---
title: .show materialized-view policy row_level_security command
description: Learn how to use the `.show materialized-view policy row_level_security` command to show the materialized view's row level security policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/23/2023
---
# .show materialized-view policy row_level_security command

Display the materialized view's [row_level_security policy](row-level-security-policy.md). The Row Level Security simplifies the design and coding of security. It lets you apply restrictions on data row access in your application. For example, limit user access to rows relevant to their department, or restrict customer access to only the data relevant to their company.

For more information about running queries on the row level security policy, see [row_level_security policy](row-level-security-policy.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName* `policy` `row_level_security`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*MaterializedViewName*|string|&check;|The name of the materialized view.|

## Returns

Returns a JSON representation of the policy.

### Example

Display the policy at the materialized-view level:

```kusto
.show materialized-view MyMaterializedView policy row_level_security
```
