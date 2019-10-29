---
title: Stored functions management - Azure Data Explorer | Microsoft Docs
description: This article describes Stored functions management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2019
---
# Stored functions management

This article describes control commands used for creating and altering [user-defined functions](../query/functions/user-defined-functions.md).

## .show functions

```kusto
.show functions
```

The `.show functions` command lists all the stored functions
in the currently-selected database.

Requires [Database user permission](../management/access-control/role-based-authorization.md).
 
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters that are required by the function.
|Body  |String |(Zero or more) Let statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder that is used for UI functions categorization. This parameter does not change the way function is invoked
|DocString|String|A description of the function - to be shown for UI purposes.
 
**Output example** 

|Name |Parameters|Body|Folder|DocString
|---|---|---|---|---
|MyFunction1 |() | {StormEvents &#124; limit 100}|MyFolder|Simple demo function|
|MyFunction2 |(myLimit: long)| {StormEvents &#124; limit myLimit}|MyFolder|Demo function with parameter|
|MyFunction3 |() | { StormEvents(100) }|MyFolder|Function calling other function||

## .show function

```kusto
.show function MyFunc1
```

The `.show function` command returns details regarding one
specific stored function. To get a list of all functions,
see [.show functions](#show-functions).

**Syntax**

`.show` `function` *FunctionName*

**Output**

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters that are required by the function.
|Body  |String |(Zero or more) Let statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder that is used for UI functions categorization. This parameter does not change the way function is invoked
|DocString|String|A description of the function - to be shown for UI purposes.
 
**Notes:** 
- If function does not exist - error is returned.
- Requires [Database user permission](../management/access-control/role-based-authorization.md).
 
**Example** 

```kusto
.show function MyFunction1 
```
    
|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction1 |() | {StormEvents &#124; limit 100}|MyFolder|Simple demo function

## .create function

The `.create function` command creates a stored function -- a reusable [`let` statement](../query/letstatement.md)
function with the given name. The function definition is persisted with the database metadata.

Functions can call other functions (recursiveness is not supported), and let statements are allowed as part of the *Function Body*. See [`let` statements](../query/letstatement.md).

Rules for parameter types and CSL-statements are the same as for [`let` statements](../query/letstatement.md).
    
**Syntax**

`.create` `function` [`ifnotexists`] [`with` `(`[`docstring` `=` *Documentation*] [`,` `folder` `=` *FolderName*] `)`] [`,` `skipvalidation` `=` 'true'] `)`]
*FunctionName* `(` *ParamName* `:` *ParamType* [`,` ...] `)` `{` *FunctionBody* `}`

**Output**    
    
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters that are required by the function.
|Body  |String |(Zero or more) Let statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder that is used for UI functions categorization. This parameter does not change the way function is invoked
|DocString|String|A description of the function - to be shown for UI purposes.

**Notes:** 
- If function already exists:
    * If `ifnotexists` flag is specified - command is ignored (no change applied).
    * If `ifnotexists` flag is NOT specificed - error is returned. 
    > For altering existing function - see [.alter function](#alter-function)
- Requires [Database user permission](../management/access-control/role-based-authorization.md).
- Not all data types are currently supported in let statements. supported types are: boolean, string, long, datetime, timespan, double, dynamic.
- Use 'skipvalidation' to skip semantic validation of the function. Useful when functions are created in a wrong order and F1 that uses F2 is created earlier.

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



## .alter function

```kusto
.alter function [with (docstring = '<description>', folder='<name>', skipvalidation='true')] [FunctionName] ([paramName:paramType], ...) { CSL-statement }
```

Alters an existing function and stores it inside the database metadata. 
Rules for parameter types and CSL-statements are the same as for [`let` statements](../query/letstatement.md).
  
    
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters that are required by the function.
|Body  |String |(Zero or more) Let statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder that is used for UI functions categorization. This parameter does not change the way function is invoked
|DocString|String|A description of the function - to be shown for UI purposes.

**Notes:** 
- If function does not exist - error is returned. For creating new function - see [.create function](#create-function)
- Requires [Database admin permission](../management/access-control/role-based-authorization.md)
- Modification of the function is also allowed to [Database user](../management/access-control/role-based-authorization.md) who originally created the function
- Not all kusto types are currently supported in let statements. supported types are: string, long, datetime, timespan, double.
- Use `skipvalidation` to skip semantic validation of the function. Useful when functions are created in a wrong order and F1 that uses F2 is created earlier.

 
**Example** 

```kusto
.alter function
with (docstring = 'Demo function with parameter', folder='MyFolder')
 MyFunction2(myLimit: long)  {StormEvents | limit myLimit}
``` 
    
|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; limit myLimit}|MyFolder|Demo function with parameter|

## .create-or-alter function

```kusto
.create-or-alter function [with (docstring = '<description>', folder='<name>')] [FunctionName] ([paramName:paramType], ...) { CSL-statement }
```
If function with the provided *FunctionName* does not exist in database metadata - command will create a new function. Otherwise (if function already exists) - function will be changed.

**Example**

```kusto
.create-or-alter function  with (docstring = 'Demo function with parameter', folder='MyFolder') TestFunction(myLimit:int)
{
    StormEvents | take myLimit 
} 
```

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|TestFunction|(myLimit:int)|{ StormEvents &#124; take myLimit }|MyFolder|Demo function with parameter|

## .drop function

The `.drop` `function` command drops a function from the database.

**Syntax**

`.drop` `function` *FunctionName* [`ifexists`]

* `ifexists`: If specified, modifies the behavior of the command to
  not fail for a non-existent function.

**Notes:**
- Requires [Database admin permission](../management/access-control/role-based-authorization.md).
- Deletion of the function is also allowed to [Database user](../management/access-control/role-based-authorization.md) who originally created the function  
    
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function that was removed
 
**Example** 

```kusto
.drop function MyFunction1 
```

## .alter function docstring

`.alter` `function` *FunctionName* `docstring` *Documentation*

Alters the DocString value of an existing function. 

**Notes:** 
- Requires [Database admin permission](../management/access-control/role-based-authorization.md)
- Modification of the function is also allowed to [Database user](../management/access-control/role-based-authorization.md) who originally created the function 
- If the function does not exist - error is returned. For creating new function - see [.create function](#create-function)

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters that are required by the function.
|Body  |String |(Zero or more) Let statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder that is used for UI functions categorization. This parameter does not change the way function is invoked
|DocString|String|A description of the function - to be shown for UI purposes.


**Example** 

```kusto
.alter function MyFunction1 docstring "Updated docstring"
```
    
|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; limit myLimit}|MyFolder|Updated docstring|


## .alter function folder

`.alter` `function` *FunctionName* `folder` *Folder*

Alters the Folder value of an existing function. 

**Notes:** 
- Requires [Database admin permission](../management/access-control/role-based-authorization.md)
- Modification of the function is also allowed to [Database user](../management/access-control/role-based-authorization.md) who originally created the function 
- If the function does not exist - error is returned. For creating new function - see [.create function](#create-function)

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters that are required by the function.
|Body  |String |(Zero or more) Let statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder that is used for UI functions categorization. This parameter does not change the way function is invoked
|DocString|String|A description of the function - to be shown for UI purposes.


**Example** 

```kusto
.alter function MyFunction1 folder "Updated Folder"
```
    
|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; limit myLimit}|Updated Folder|Some DocString|

```kusto
.alter function MyFunction1 folder @"First Level\Second Level"
```
    
|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; limit myLimit}|First Level\Second Level|Some DocString|

