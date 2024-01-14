---
title: .alter function command
description: Learn how to use the `.alter function` command to alter an existing function.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/20/2023
---
# .alter function command

Alters an existing function and stores it inside the database metadata.
Rules for parameter types and CSL statements are the same as for [`let` statements](../query/let-statement.md).

## Permissions

You must have at least [Function Admin](../management/access-control/role-based-access-control.md) permissions to run this command. The principal that creates the function is automatically made a Function Admin.

## Syntax

`.alter` `function` [ `with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`] *functionName*`(`*parameters*`)` `{` *body* `}`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*functionName* | string | &check; | The name of the function to alter.|
| *propertyName*, *propertyValue* | string | | A comma-separated list of key-value property pairs. See [supported properties](#supported-properties).|
|*parameters*  | string | | A comma-separated list of parameters required by the function. The format for each parameter must be *ParameterName*`:`*ParameterDataType*.|
|*body*| string | &check; | Zero or more `let` statements followed by a valid CSL expression that is evaluated upon function invocation.|

> [!NOTE]
>
> * If the function doesn't exist, an error is returned. For creating a new function, see [`.create function`](create-function.md)
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

|Name |Parameters |Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Demo function with parameter|
