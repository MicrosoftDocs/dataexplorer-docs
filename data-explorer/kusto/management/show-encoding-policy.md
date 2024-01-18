---
title: .show policy encoding command
description: Learn how to use the `.show policy encoding` command to show the encoding policy of the specified entity.
ms.reviewer: alexans
ms.topic: reference
ms.date: 05/23/2023
---
# .show policy encoding command

Shows the encoding policy. For an overview of the encoding policy, see [Encoding policy](encoding-policy.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` *EntityType* *EntityIdentifier* `policy` `encoding`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name | Type | Required | Description |
|--|--|--|--|
| *EntityType* | string |  :heavy_check_mark: | This field determines the type of *EntityIdentifier*. The possible values are `database` or `table` or `column`.|
| *EntityIdentifier* | string |  :heavy_check_mark: | The identifier for the entity. Column references must include the table name scope. A wildcard `*` to denote all entities for the given *EntityType* is allowed. |

## Example

```kusto
.show database Samples policy encoding
```

## Related content

* [Encoding policy](encoding-policy.md)
* [.alter encoding policy](alter-encoding-policy.md)
