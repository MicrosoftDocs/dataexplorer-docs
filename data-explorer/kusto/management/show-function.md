---
title: .show functions - Azure Data Explorer | Microsoft Docs
description: This article describes .show functions in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# .show function(s)

Lists all the stored functions in the currently-selected database.
To return only one specific function, see [.show function](#show-function).

## .show functions

```kusto
.show functions
```

Requires [database user permission](../management/access-control/role-based-authorization.md).
 
|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters required by the function.
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way the function is invoked.
|DocString|String|A description of the function for UI purposes.
 
**Output example** 

|Name |Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|MyFunction1 |() | {StormEvents &#124; limit 100}|MyFolder|Simple demo function|
|MyFunction2 |(myLimit: long)| {StormEvents &#124; limit myLimit}|MyFolder|Demo function with parameter|
|MyFunction3 |() | { StormEvents(100) }|MyFolder|Function calling other function|

## .show function

```kusto
.show function MyFunc1
```

Lists the details of one specific stored function. 
For a list of **all** functions, see [.show functions](#show-functions).

**Syntax**

`.show` `function` *FunctionName*

**Output**

|Output parameter |Type |Description
|---|---|--- 
|Name  |String |The name of the function. 
|Parameters  |String |The parameters required by the function.
|Body  |String |(Zero or more) `let` statements followed by a valid CSL expression that is evaluated upon function invocation.
|Folder|String|A folder used for UI functions categorization. This parameter doesn't change the way function is invoked
|DocString|String|A description of the function for UI purposes.
 
> [!NOTE] 
> * If the function does not exist, an error is returned.
> * Requires [database user permission](../management/access-control/role-based-authorization.md).
 
**Example** 

```kusto
.show function MyFunction1 
```
    
|Name |Parameters |Body|Folder|DocString
|---|---|---|---|---
|MyFunction1 |() | {StormEvents &#124; limit 100}|MyFolder|Simple demo function
