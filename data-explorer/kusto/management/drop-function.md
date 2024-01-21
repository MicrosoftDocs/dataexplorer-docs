---
title: .drop function command
description: Learn how to use the `.drop function` command to drop one or more functions from a database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .drop function command

Drops one or more functions from the database.

## Permissions

You must have at least [Function Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `function` *FunctionName* [`ifexists`]

`.drop` `functions` `(` *FunctionName* [`,` ...] `)` [`ifexists`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *FunctionName* | string |  :heavy_check_mark: | The name of the function to drop. |
|`ifexists`| string || If specified, the command won't fail if the function doesn't exist.|

## Returns

When you drop a single function, the command returns the details of the removed function.

| Output parameter | Type | Description |
|--|--|--|
| Name | string | The name of the function that was removed |

When you drop multiple functions, the command returns a list of the remaining functions in the database.

| Output parameter | Type | Description |
|--|--|--|
| Name | String | The name of the function. |
| Parameters | String | The parameters required by the function. |
| Body | String | (Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation. |
| Folder | String | A folder used for UI functions categorization. This parameter doesn't change the way the function is invoked. |
| DocString | String | A description of the function for UI purposes. |

## Examples

### Drop a single function

The following command drops the function `MyFunction1`. If such a function doesn't exist, the command fails.

```kusto
.drop function MyFunction1
```

### Drop multiple functions

The following command drops the functions named `Function1`, `Function2`, and `Function3`. If they don't exist, the command won't fail.

```kusto
.drop functions (Function1, Function2, Function3) ifexists
```
