---
title: .show encoding policy
description: Learn how to use the `.show encoding policy` command to show the encoding policy.
ms.reviewer: alexans
ms.topic: reference
ms.date: 05/23/2023
---
# .show encoding policy

Shows the encoding policy. For an overview of the encoding policy, see [Encoding policy](encoding-policy.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` *EntityType* *EntityIdentifier* `policy` `encoding`

## Parameters

|Name | Type | Required | Description |
|--|--|--|--|
| *EntityType* | string | &check; | This field determines the type of *EntityIdentifier*. The possible values are `database` or `table` or `column`.|
| *EntityIdentifier* | string | &check; | The identifier for the entity. Column references must include the table name scope. A wildcard `*` to denote all entities for the given *EntityType* is allowed. |

## Example

```kusto
.show database Samples policy encoding
```

## See also

* [Encoding policy](encoding-policy.md)
* [.alter encoding policy](alter-encoding-policy.md)
