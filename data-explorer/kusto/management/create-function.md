---
title: .create function - Azure Data Explorer | Microsoft Docs
description: This article describes .create function in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# .create function

Creates a stored function, which is a reusable [`let` statement](../query/letstatement.md)
function with the given name. The function definition is persisted with the database metadata.

Functions can call other functions (recursiveness is not supported), and `let` statements are allowed as part of the *Function Body*. See [`let` statements](../query/letstatement.md).

Rules for parameter types and CSL statements are the same as for [`let` statements](../query/letstatement.md).
    
**Syntax**

`.create` `function` [`ifnotexists`] [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`] [`,` `skipvalidation` `=` 'true'] `)`]
*FunctionName* `(` *ParamName* `:` *ParamType* [`,` ...] `)` `{` *FunctionBody* `}`

**Output**    
    
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters required by the function.
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way function is invoked.
|DocString|String|A description of the function for UI purposes.

> [!NOTE]
> * If function already exists:
>    * If `ifnotexists` flag is specified, the command is ignored (no change applied).
>    * If `ifnotexists` flag is NOT specified, an error is returned.
>    * For altering an existing function, see [.alter function](alter-function.md)
> * Requires [database user permission](../management/access-control/role-based-authorization.md).
> * Not all data types are supported in `let` statements. Supported types are: boolean, string, long, datetime, timespan, double, and dynamic.
> * Use 'skipvalidation' to skip semantic validation of the function. This is useful when functions are created in an incorrect order and F1 that uses F2 is created earlier.

**Examples** 

```kusto
.create function 
with (docstring = 'Simple demo function', folder='Demo')
MyFunction1()  {StormEvents | limit 100}
```

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction1|()|{StormEvents &#124; limit 100}|Demo|Simple demo function|

```kusto
.create function
with (docstring = 'Demo function with parameter', folder='Demo')
 MyFunction2(myLimit: long)  {StormEvents | limit myLimit}
```

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction2|(myLimit:long)|{StormEvents &#124; limit myLimit}|Demo|Demo function with parameter|
