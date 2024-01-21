---
title: .alter function folder command
description: Learn how to use the `.alter function folder` command to alter the folder value of an existing function.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/25/2023
---
# .alter function folder command

Alters the folder value of an existing function.

> [!NOTE]
> If the function doesn't exist, an error is returned. For more information on how to create a new function, see [`.create function`](create-function.md).

## Permissions

You must have at least [Function Admin](../management/access-control/role-based-access-control.md) permissions to run this command. The principal that creates the function is automatically made a Function Admin.

## Syntax

`.alter` `function` *FunctionName* `folder` *Folder*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*FunctionName*|string| :heavy_check_mark:|The name of the function to alter.|
|*Folder*|string| :heavy_check_mark:|The name of the folder to assign to the function.|

## Returns

|Output parameter |Type |Description|
|---|---|---|
|Name  |String |The name of the function.|
|Parameters  |String |The parameters required by the function.|
|Body  |String |Zero or more let statements followed by a valid CSL expression to be evaluated upon function invocation.|
|Folder|String|A folder to use for UI functions categorization. This parameter doesn't change the way function is invoked.|
|DocString|String|A description of the function for UI purposes.|

## Example

```kusto
.alter function MyFunction1 folder "Updated Folder"
```

|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|Updated Folder|Some DocString|

```kusto
.alter function MyFunction1 folder @"First Level\Second Level"
```

|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; take myLimit}|First Level\Second Level|Some DocString|
