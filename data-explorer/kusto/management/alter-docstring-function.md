---
title:  .alter function docstring command
description: Learn how to use the `.alter function docstring` command to change the `DocString` value of an existing function.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/25/2023
---
# .alter function docstring command

Alters the `DocString` value of an existing function.

`DocString` is free text that you can attach to a table/function/column describing the entity. This string is presented in various UX settings next to the entity names.

> [!NOTE]
> If the function doesn't exist, an error is returned. For more information on how to create a new function, see [`.create function`](create-function.md).

## Permissions

You must have at least [Function Admin](../access-control/role-based-access-control.md) permissions to run this command. The principal that creates the function is automatically made a Function Admin.

## Syntax

`.alter` `function` *FunctionName* `docstring` *Documentation*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*FunctionName*| `string` | :heavy_check_mark:|The name of the function to alter.|
|*Documentation*| `string` | :heavy_check_mark:|The new docstring value for the function.|

## Returns

|Output parameter |Type |Description|
|---|---|---|
|Name  | `string` |The name of the function|
|Parameters  | `string` |The parameters required by the function|
|Body  | `string` |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated when the function is invoked|
|Folder| `string` |A folder used for UI functions categorization. This parameter doesn't change the way the function is invoked|
|DocString| `string` |A description of the function for UI purposes|

## Example

```kusto
.alter function MyFunction1 docstring "Updated docstring"
```

**Output**

|Name |Parameters |Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Updated docstring|
