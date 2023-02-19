---
title: .alter function folder - Azure Data Explorer
description: This article describes .alter function folder in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/19/2023
---
# .alter function folder

Alters the Folder value of an existing function.

> [!NOTE]
> * Requires [database admin permission](./access-control/role-based-access-control.md)
> * The [database user](./access-control/role-based-access-control.md) who originally created the function is allowed to modify the function. 
> * If the function doesn't exist, an error is returned. For creating new function, [`.create function`](create-function.md)

## Syntax

`.alter` `function` *FunctionName* `folder` *Folder*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*FunctionName*|string|&check;|The name of the function to alter.|
|*Folder*|string|&check;|The name of the folder to assign to the function.|

## Returns

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters that are required by the function.
|Body  |String |(Zero or more) Let statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder that is used for UI functions categorization. This parameter does not change the way function is invoked.
|DocString|String|A description of the function for UI purposes.

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