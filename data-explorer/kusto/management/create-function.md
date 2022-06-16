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
    
**Syntax**

`.create` `function` [`ifnotexists`] [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`] [`view` `=` *View*] [`,` `skipvalidation` `=` 'true'] `)`]
*FunctionName* `(` *ParamName* `:` *ParamType* [`,` ...] `)` `{` *FunctionBody* `}`

**Input**
|Input parameter |Type |Description
|---|---|---
|ifnotexists|   |Verify if the function already exists.
|docstring|String|A description of the function.
|folder|String|The name of the folder where the function is stored.
|view|String|The name of the stored view to be included in the function.
|skipvalidation|Boolean|Validate the function (True or False).
|FunctionName(ParamName:ParamType)|String (String:datatype)|Name of the function, the parameter name and datatype.
|FunctionBody|   |Uses a user defined function or an anonymous function declaration.

**Output**    
    
|Output parameter |Type |Description
|---|---|---
|Name |String |The name of the function.
|Parameters  |String |The parameters required by the function.
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way function is invoked.
|DocString|String|A description of the function for UI purposes.

> [!NOTE]
> * If function already exists:
>    * If `ifnotexists` flag is specified, the command is ignored (no change applied).
>    * If `ifnotexists` flag is NOT specified, an error is returned.
>    * For altering an existing function, see [`.alter function`](alter-function.md)
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
