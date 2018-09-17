---
title: As operator - Azure Data Explorer | Microsoft Docs
description: This article describes As operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# As operator

`As` operator temporarily binds a name to the operator's input tabular expression.

**Syntax**

`T | as *name*`

**Arguments**

* *T*: A tabular expression.
* *name*: A temporary name for the tabular expression. 

**Notes**
* The name given by `as` will be used in the `withsource=` column of [union](./unionoperator.md), the `source-` column of [find](./findoperator.md) and the `$table` column of [search](./searchoperator.md)
* The tabular expression named using 'as' in a [join](./joinoperator.md)'s 'left side' can be used when the [join](./joinoperator.md)'s 'right side'


**Examples**
```kusto
// 1. In the following 2 example the union's generated TableName column will consist of 'T1' and 'T2'
range x from 1 to 10 step 1 
| as T1 
| union withsource=TableName T2

union withsource=TableName (range x from 1 to 10 step 1 | as T1), T2

// 2. In the following example, the 'left side' of the join will be: 
//      MyLogTable filtered by type == "Event" and Name == "Start"
//    and the 'right side' of the join will be: 
//      MyLogTable filtered by type == "Event" and Name == "Stop"
MyLogTable  
| where type == "Event"
| as T
| where Name == "Start"
| join (
    T
    | where Name == "Stop"
) on ActivityId
```