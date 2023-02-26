---
title: .alter function - Azure Data Explorer
description: This article describes .alter function in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/21/2023
---
# .alter function

Alters an existing function and stores it inside the database metadata.
Rules for parameter types and CSL statements are the same as for [`let` statements](../query/letstatement.md).

## Permissions

You must have at least [Function Admin](../management/access-control/role-based-access-control.md) permissions to run this command. The principal that creates the function is automatically made a Function Admin.

## Syntax

```kusto
.alter function [with (docstring = '<description>', folder='<name>', skipvalidation='true')] [FunctionName] ([paramName:paramType], ...) { CSL-statement }
```
    
|Output parameter |Type |Description
|---|---|--- 
|Name  |string |The name of the function.
|Parameters  |string |The parameters required by the function.
|Body  |string |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|string|A folder used for UI functions categorization. This parameter does not change the way function is invoked.
|DocString|string|A description of the function for UI purposes.

> [!NOTE]
>
> * If the function doesn't exist, an error is returned. For creating a new function, see [`.create function`](create-function.md)
> * Not all Kusto types are supported in `let` statements. Supported types are: string, long, datetime, timespan, and double.
> * Use `skipvalidation` to skip semantic validation of the function. This is useful when a function is created before some any of the objects referenced in its body. For example, if Function1 which references Function2 and Table1 is created earlier than those two other objects.

## Example

```kusto
.alter function
with (docstring = 'Demo function with parameter', folder='MyFolder')
 MyFunction2(myLimit: long)  {StormEvents | take myLimit}
```

|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Demo function with parameter|
