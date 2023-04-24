---
title: .create-or-alter function - Azure Data Explorer
description: This article describes .create-or-alter function in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/23/2023
---
# .create-or-alter function

Creates a stored function or alters an existing function and stores it inside the database metadata.

Rules for parameter types and CSL statements are the same as for [let statements](../query/letstatement.md).

## Permissions

You must have at least [Database User](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create-or-alter` `function` [ `with` `(`*propertyName* `=` *propertyValue* [`,` ...]`)`] *functionName*`(`*parameters*`)` `{` *body* `}`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*functionName* | string | &check; | The name of the function to create or alter.|
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|
|*parameters*  | string | | A comma-separated list of parameters required by the function. The format for each parameter must be *ParameterName*`:`*ParameterDataType*.|
|*body*| string | &check; | Zero or more `let` statements followed by a valid CSL expression that is evaluated upon function invocation.|

> [!NOTE]
> If the function with the provided *functionName* doesn't exist in the database metadata, the command creates a new function. Else, that function will be changed.

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`|string|A description of the function for UI purposes.|
|`folder`|string|The name of a folder used for UI functions categorization.|

## Example

```kusto
.create-or-alter function with (docstring = 'Demo function with parameter', folder='MyFolder') TestFunction(myLimit:int)
{
    StormEvents | take myLimit 
} 
```

**Output**

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|TestFunction|(myLimit:int)|{ StormEvents &#124; take myLimit }|MyFolder|Demo function with parameter|
