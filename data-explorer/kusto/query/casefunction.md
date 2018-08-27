---
title: case() (Azure Kusto)
description: This article describes case() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# case()

Evaluates a list of predicates and returns the first result expression whose predicate is satisfied.

If neither of the predicates return `true`, the result of the last expression (the `else`) is returned.
All odd arguments (count starts at 1) must be expressions that evaluate to a  `boolean` value.
All even arguments (the `then`s) and the last argument (the `else`) must be of the same type.

**Syntax**

`case(`*predicate-1*`,` *then-1*,
       *predicate-2*`,` *then-2*,
       *predicate-3*`,` *then-3*,
       *else*`)`

**Arguments**

* *predicate-i*: An expression that evaluates to a `boolean` value.
* *then-i*: An expression that gets evaluated and its value is returned from the function if *predicate-i* is the first predicate that evaluates to `true`.
* *else*: An expression that gets evaluated and its value is returned from the function if neither of the *predicate-i* evaluate to `true`.

**Returns**

The value of the first *then-i* whose *predicate-i* evaluates to `true`, or the value of *else* if neither of the predicates are satisfied.

**Example**

```kusto
range Size from 1 to 15 step 2
| extend bucket = case(Size <= 3, "Small", 
                       Size <= 10, "Medium", 
                       "Large")
```

|Size|bucket|
|---|---|
|1|Small|
|3|Small|
|5|Medium|
|7|Medium|
|9|Medium|
|11|Large|
|13|Large|
|15|Large|
