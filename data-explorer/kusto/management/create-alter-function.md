---
title: .create-or-alter function - Azure Data Explorer
description: This article describes .create-or-alter function in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/11/2020
---
# .create-or-alter function

Creates a stored function or alters an existing function and stores it inside the database metadata.

Rules for parameter types and CSL statements are the same as for [`let` statements](../query/letstatement.md).

## Permissions

This command requires at least [Database User](access-control/role-based-access-control.md) permissions.

## Syntax

.`create-or-alter function [with (docstring = '<description>' folder='<name>')] [FunctionName] ([paramName:paramType], ...) { CSL-statement }`

If the function with the provided *FunctionName* doesn't exist in the database metadata, the command creates a new function. Else, that function will be changed.

**Input**

|Input parameter |Type |Description |
|---|---|---|
|docstring|String|A description of the function.|
|folder|String|The name of the folder tag. |
|FunctionName(ParamName:ParamType)|String (String:datatype)|Name of the function, the parameter name and datatype. |

**Example**

```kusto
.create-or-alter function  with (docstring = 'Demo function with parameter', folder='MyFolder') TestFunction(myLimit:int)
{
    StormEvents | take myLimit 
} 
```

**Results**

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|TestFunction|(myLimit:int)|{ StormEvents &#124; take myLimit }|MyFolder|Demo function with parameter|
