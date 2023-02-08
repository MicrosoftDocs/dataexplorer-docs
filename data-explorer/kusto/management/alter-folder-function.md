---
title: .alter function folder - Azure Data Explorer
description: This article describes .alter function folder in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/11/2020
---
# .alter function folder

Alters the Folder value of an existing function.

> [!NOTE]
> If the function doesn't exist, an error is returned. For more information on how to create a new function, see [`.create function`](create-function.md).

## Permissions

You must have [Function Admin](../management/access-control/role-based-access-control.md) permissions to run this command. The principal that creates the function is automatically made a Function Admin.

## Syntax

`.alter` `function` *FunctionName* `folder` *Folder*

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters that are required by the function.
|Body  |String |(Zero or more) Let statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder that is used for UI functions categorization. This parameter does not change the way function is invoked.
|DocString|String|A description of the function for UI purposes.

**Example** 

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