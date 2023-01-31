---
title: .alter function - Azure Data Explorer
description: This article describes .alter function in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/11/2020
---
# .alter function

Alters an existing function and stores it inside the database metadata.
Rules for parameter types and CSL statements are the same as for [`let` statements](../query/letstatement.md).

**Syntax**

```kusto
.alter function [with (docstring = '<description>', folder='<name>', skipvalidation='true')] [FunctionName] ([paramName:paramType], ...) { CSL-statement }
```
    
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function.
|Parameters  |String |The parameters required by the function.
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder used for UI functions categorization. This parameter does not change the way function is invoked.
|DocString|String|A description of the function for UI purposes.

> [!NOTE]
>
> * If the function doesn't exist, an error is returned. For creating a new function, see [`.create function`](create-function.md)
> * Requires [database admin permission](../management/access-control/role-based-authorization.md)
> * The [database user](../management/access-control/role-based-authorization.md) who originally created the function is allowed to modify the function.
> * Not all Kusto types are supported in `let` statements. Supported types are: string, long, datetime, timespan, and double.
> * Use `skipvalidation` to skip semantic validation of the function. This is useful when functions are created in an incorrect order and F1 that uses F2 is created earlier.

## Example

```kusto
.alter function
with (docstring = 'Demo function with parameter', folder='MyFolder')
 MyFunction2(myLimit: long)  {StormEvents | take myLimit}
```

|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Demo function with parameter|
