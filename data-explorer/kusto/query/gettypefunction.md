---
title: gettype() - Azure Kusto | Microsoft Docs
description: This article describes gettype() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# gettype()

Returns the runtime type of its single argument.

The runtime type may be different than the nominal (static) type for expressions
whose nominal type is `dynamic`; in such cases `gettype()` can be useful to reveal
thet type of the actual value (how the value is encoded in memory).

**Syntax**

`gettype(`*Expr*`)`

**Returns**

A string representing the runtime type of its single argument.

**Examples**

|Expression                          |Returns      |
|------------------------------------|-------------|
|`gettype("a")`                      |`string`     |
|`gettype(111)`                      |`long`       |
|`gettype(1==1)`                     |`bool`       |
|`gettype(now())`                    |`datetime`   |
|`gettype(1s)`                       |`timespan`   |
|`gettype(parsejson('1'))`           |`int`        |
|`gettype(parsejson(' "abc" '))`     |`string`     |
|`gettype(parsejson(' {"abc":1} '))` |`dictionary` | 
|`gettype(parsejson(' [1, 2, 3] '))` |`array`      |
|`gettype(123.45)`                   |`real`       |
|`gettype(guid(12e8b78d-55b4-46ae-b068-26d7a0080254))`|`guid`| 
|`gettype(parsejson(''))`            |`null`|