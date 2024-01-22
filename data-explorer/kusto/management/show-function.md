---
title: .show functions command
description: Learn how to use the `.show functions` command to list all the stored functions in the specified database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .show functions command

Lists all the stored functions in the currently-selected database.
To return only one specific function, see [.show function](#show-function).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## .show functions

### Syntax

`.show` `functions`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Returns

|Output parameter |Type |Description|
|---|---|--- |
|Name  |String |The name of the function. |
|Parameters  |String |The parameters required by the function.|
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.|
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way the function is invoked. |
|DocString|String|A description of the function for UI purposes.|

**Output example** 

|Name |Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction1 |() | {StormEvents &#124; take 100}|MyFolder|Simple demo function|
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Demo function with parameter|
|MyFunction3 |() | { StormEvents(100) }|MyFolder|Function calling other function|

## .show function

### Syntax

Lists the details of one specific stored function. 
For a list of **all** functions, see [.show functions](#show-functions).

`.show` `function` *FunctionName* [`with (`*PropertyName* `=` *PropertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*FunctionName* | `string` |  :heavy_check_mark: | The name of stored function.|
|*PropertyName*/*PropertyValue*| `string` | | Indicate additional information to use when showing function details. All properties are optional. See [Supported properties](#supported-properties).|

### Supported properties

| Property name | Property values | Description | Default |
|---|---|---|---|
|`ShowObfuscatedStrings` | `true` or `false`| If `true` and used by principal with proper permissions, [obfuscated strings](../query/scalar-data-types/string.md#obfuscated-string-literals) in function's body will be shown. | Defaults to `false`.|
|`Builtin` | `true` or `false` | If `true` and used by cluster admin, shows built in function(s). | Defaults to `false`.|
| `IncludeHiddenFunctions` | `true` or `false` | If `true`, show hidden function(s). | Defaults to `false`.|

### Returns

|Output parameter |Type |Description|
|---|---|--- |
|Name  |String |The name of the function. |
|Parameters  |String |The parameters required by the function.|
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.|
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way function is invoked|
|DocString|String|A description of the function for UI purposes.|

> [!NOTE]
> If the function does not exist, an error is returned.

### Example

```kusto
.show function MyFunction1 with(ShowObfuscatedStrings = true)
```

|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction1 |() | {StormEvents &#124; take 100}|MyFolder|Simple demo function
