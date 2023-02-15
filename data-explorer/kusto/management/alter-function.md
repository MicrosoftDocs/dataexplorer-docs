---
title: .alter function - Azure Data Explorer
description: This article describes .alter function in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/15/2023
---
# .alter function

Alters an existing function and stores it inside the database metadata.
Rules for parameter types and CSL statements are the same as for [`let` statements](../query/letstatement.md).

## Syntax

`.alter` `function` [ `with` `(` *PropertyName* `=` *PropertyValue*`,` ... `)`] *FunctionName*`(`*Parameters*`)` `{` *Body* `}`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*FunctionName* | string | &check; | The name of the function to alter.|
| *PropertyName*, *PropertyValue* | string | | A comma-separated list of properties. See [supported properties](#supported-properties) to learn more about the optional property values.|
|*Parameters*  | string | | A comma-separated list of parameters required by the function. The format for each parameter must be *ParameterName*`:`*ParameterDataType*.|
|*Body*| string | | Zero or more `let` statements followed by a valid CSL expression that is evaluated upon function invocation.|

> [!NOTE]
>
> * If the function doesn't exist, an error is returned. For creating a new function, see [`.create function`](create-function.md)
> * Requires [database admin permission](./access-control/role-based-access-control.md)
> * The [database user](./access-control/role-based-access-control.md) who originally created the function is allowed to modify the function. 
> * Not all Kusto types are supported in `let` statements. Supported types are: string, long, datetime, timespan, and double.

### Supported properties

|Name|Type|Description|
|--|--|--|
|`docstring`|string|A description of the function for UI purposes.|
|`folder`|string|The name of a folder used for UI functions categorization.|
|`skipvalidation`|bool|Determines whether or not to skip semantic validation of the function. This is useful when functions are created in an incorrect order and F1 that uses F2 is created earlier.|

## Example

```kusto
.alter function
with (docstring = 'Demo function with parameter', folder='MyFolder')
 MyFunction2(myLimit: long)  {StormEvents | take myLimit}
```

|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Demo function with parameter|
