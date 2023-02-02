---
title: .create function - Azure Data Explorer
description: This article describes the .create function in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/15/2022
---
# .create function

Creates a stored function, which is a reusable KQL query,  with the given name. The function definition is persisted with the database metadata.

Functions can call other functions (recursiveness isn't supported). Besides, [`let`](../query/letstatement.md) statements are allowed as part of the *Function Body*. See [`let` statements](../query/letstatement.md).

Rules for parameter types and CSL statements are the same as for [`let` statements](../query/letstatement.md).

## Permissions

This command requires [database user](access-control/role-based-access-control.md) permissions.

## Syntax

`.create` `function` [`ifnotexists`] [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`] [`view` `=` *View*] [`,` `skipvalidation` `=` 'true'] `)`]
*FunctionName* `(` *ParamName* `:` *ParamType* [`,` ...] `)` `{` *FunctionBody* `}`

## Arguments

|Input parameter |Type |Description |
|---|---|---|
|ifnotexists| bool | Will be executed only if the function doesn't exist (when set to `true`).
|docstring|String|A description of the function.
|folder|String|The name of the folder tag.
|view|bool|Designates this function as a stored view.
|skipvalidation|bool|When set to `true`, it will run validation logic on the function and fail if function isn't valid. (Default: `true`)
|FunctionName(ParamName:ParamType)|String (String:datatype)|Name of the function, the parameter name and datatype.
|FunctionBody|   | A user defined function expression.

## Returns

|Output parameter |Type |Description
|---|---|---|
|Name |String |The name of the function.
|Parameters  |String |The parameters required by the function.
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way function is invoked.
|DocString|String|A description of the function for UI purposes.

> [!NOTE]
>
> * If the function already exists:
>    * If `ifnotexists` flag is specified, the command is ignored (no change applied).
>    * If `ifnotexists` flag is NOT specified, an error is returned.
>    * For altering an existing function, see [`.alter function`](alter-function.md)
> * Not all data types are supported in `let` statements. Supported types are: boolean, string, long, datetime, timespan, double, and dynamic.
> * Use `skipvalidation` to skip semantic validation of the function. This is useful when functions are created in an incorrect order and F1 that uses F2 is created earlier.

## Example: Simple demo function

```kusto
.create function 
with (docstring = 'Simple demo function', folder='Demo')
MyFunction1()  {StormEvents | take 100}
```

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction1|()|{StormEvents &#124; take 100}|Demo|Simple demo function|

## Example: Demo function with parameter

```kusto
.create function
with (docstring = 'Demo function with parameter', folder='Demo')
 MyFunction2(myLimit: long)  {StormEvents | take myLimit}
```

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction2|(myLimit:long)|{StormEvents &#124; take myLimit}|Demo|Demo function with parameter|
