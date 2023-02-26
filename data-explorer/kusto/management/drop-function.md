---
title: .drop function - Azure Data Explorer
description: This article describes .drop function in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/21/2023
---
# .drop function

Drops a function from the database.
For dropping multiple functions from the database, see [.drop functions](#drop-functions).

## Permissions

You must have at least [Function Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `function` *FunctionName* [`ifexists`]

* `ifexists`: If specified, modifies the behavior of the command to
  not fail for a non-existent function.

### Returns

|Output parameter |Type |Description
|---|---|--- 
|Name  |string |The name of the function that was removed

## Example

```kusto
.drop function MyFunction1
```

## .drop functions

Drops multiple functions from the database.

### Syntax

`.drop` `functions` (*FunctionName1*, *FunctionName2*,..) [ifexists]

### Returns

This command returns a list of the remaining functions in the database.

|Output parameter |Type |Description
|---|---|--- 
|Name  |string |The name of the function. 
|Parameters  |string |The parameters required by the function.
|Body  |string |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|string|A folder used for UI functions categorization. This parameter doesn't change the way the function is invoked.
|DocString|string|A description of the function for UI purposes.

### Example
 
```kusto
.drop functions (Function1, Function2, Function3) ifexists
```
