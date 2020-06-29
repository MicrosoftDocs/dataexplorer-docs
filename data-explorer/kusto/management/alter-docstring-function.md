---
title: .alter function docstring - Azure Data Explorer
description: This article describes `.alter function docstring` in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/11/2020
---
# .alter function docstring

Alters the *DocString* value of an existing function.

`.alter` `function` *FunctionName* `docstring` *Documentation*

> [!NOTE]
> * Requires [database admin permission](../management/access-control/role-based-authorization.md)
> * The [database user](../management/access-control/role-based-authorization.md) who originally created the function is allowed to modify the function.
> * If the function doesn't exist, an error is returned. For more information on how to create a new function, see [.create function](create-function.md).

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function
|Parameters  |String |The parameters required by the function
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated when the function invoked
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way the function is invoked
|DocString|String|A description of the function for UI purposes

**Example** 

```kusto
.alter function MyFunction1 docstring "Updated docstring"
```
    
|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction2 |(myLimit: long)| {StormEvents &#124; limit myLimit}|MyFolder|Updated docstring|
