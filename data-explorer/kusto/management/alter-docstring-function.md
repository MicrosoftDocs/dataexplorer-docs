---
title: .alter function docstring - Azure Data Explorer
description: This article describes .alter function docstring in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/19/2023
---
# .alter function docstring

Alters the `DocString` value of an existing function.

`DocString` is free text that you can attach to a table/function/column describing the entity. This string is presented in various UX settings next to the entity names.

> [!NOTE]
> * Requires [database admin permission](./access-control/role-based-access-control.md)
> * The [database user](./access-control/role-based-access-control.md) who originally created the function is allowed to modify the function.
> * If the function doesn't exist, an error is returned. For more information on how to create a new function, see [`.create function`](create-function.md).

## Syntax

`.alter` `function` *FunctionName* `docstring` *Documentation*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*FunctionName*|string|&check;|The name of the function to alter.|
|*Documentation*|string|&check;|The new docstring value for the function.|

## Returns

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function
|Parameters  |String |The parameters required by the function
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated when the function is invoked
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way the function is invoked
|DocString|String|A description of the function for UI purposes

## Example

```kusto
.alter function MyFunction1 docstring "Updated docstring"
```

**Output**

|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|MyFolder|Updated docstring|
