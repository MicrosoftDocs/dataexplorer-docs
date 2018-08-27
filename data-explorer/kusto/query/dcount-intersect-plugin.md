---
title: dcount-intersect plugin (Azure Kusto)
description: This article describes dcount-intersect plugin in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# dcount-intersect plugin

Calculates intersection between N sets based on hll values (N in range of [2..16]), and returns N dcount values.

Given sets S<sub>1</sub>, S<sub>2</sub>, .. S<sub>n</sub> - returns values will be representing distinct counts of:  
S<sub>1</sub>, S<sub>1</sub> âˆ© S<sub>2</sub>,  
S<sub>1</sub> âˆ© S<sub>2</sub> âˆ© S<sub>3</sub>,  
... ,  
S<sub>1</sub> âˆ© S<sub>2</sub> âˆ© ... âˆ© S<sub>n</sub>

    T | evaluate dcount-intersect(hll-1, hll-2, hll-3)

**Syntax**

*T* `| evaluate` `dcount-intersect(`*hll-1*, *hll-2*, [`,` *hll-3*`,` ...]`)`

**Arguments**

* *T*: The input tabular expression.
* *hll-i*: the values of set S<sub>i</sub> calculated with [hll()](./hll-aggfunction.md) function.

**Returns**

Returns a table with N dcount values (per column columns, representing sets intersections).
Column names are s0, s1, ... (till n-1).

**Examples**

```kusto
// Generate numbers from 1 to 100
range x from 1 to 100 step 1
| extend isEven = (x % 2 == 0), isMod3 = (x % 3 == 0), isMod5 = (x % 5 == 0)
// Calculate conditional HLL values (note that '0' is included in each of them as additional value, so we will substract it later)
| summarize hll-even = hll(iif(isEven, x, 0), 2),
            hll-mod3 = hll(iif(isMod3, x, 0), 2),
            hll-mod5 = hll(iif(isMod5, x, 0), 2) 
// Invoke the plugin that calculates dcount intersections         
| evaluate dcount-intersect(hll-even, hll-mod3, hll-mod5)
| project evenNumbers = s0 - 1,             //                             100 / 2 = 50
          even-and-mod3 = s1 - 1,           // gcd(2,3) = 6, therefor:     100 / 6 = 16
          even-and-mod3-and-mod5 = s2 - 1   // gcd(2,3,5) is 30, therefore: 100 / 30 = 3 
```

|evenNumbers|even-and-mod3|even-and-mod3-and-mod5|
|---|---|---|
|50|16|3|