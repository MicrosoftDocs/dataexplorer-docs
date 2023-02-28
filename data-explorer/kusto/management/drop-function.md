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

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function that was removed

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
|Name  |String |The name of the function. 
|Parameters  |String |The parameters required by the function.
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way the function is invoked.
|DocString|String|A description of the function for UI purposes.

Requires [function admin permission](./access-control/role-based-access-control.md).

### Example
 
```kusto
.drop functions (Function1, Function2, Function3) ifexists
```
