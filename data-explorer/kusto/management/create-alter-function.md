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

## Syntax

.`create-or-alter` `function` [ `with` `(`*PropertyName* `=` *PropertyValue*`,` ...`)`] *FunctionName*`(`*Parameters*`)` `{` *Body* `}`

If the function with the provided *FunctionName* doesn't exist in the database metadata, the command creates a new function. Else, that function will be changed.

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*FunctionName* | string | &check; | The name of the function to create or alter.|
| *PropertyName*, *PropertyValue* | string | | A comma-separated list of properties. See [supported properties](#supported-properties) to learn more about the optional property values.|
|*Parameters*  | string | | A comma-separated list of parameters required by the function. The format for each parameter must be *ParameterName*`:`*ParameterDataType*.|
|*Body*| string | &check; | Zero or more `let` statements followed by a valid CSL expression that is evaluated upon function invocation.|

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`|string|A description of the function for UI purposes.|
|`folder`|string|The name of a folder used for UI functions categorization.|

## Example

```kusto
.create-or-alter function  with (docstring = 'Demo function with parameter', folder='MyFolder') TestFunction(myLimit:int)
{
    StormEvents | take myLimit 
} 
```

**Output**

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|TestFunction|(myLimit:int)|{ StormEvents &#124; take myLimit }|MyFolder|Demo function with parameter|
