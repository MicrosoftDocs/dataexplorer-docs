---
title: anyif() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes anyif() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/01/2019
---
# anyif() (aggregation function)

Returns random non-empty value from the specified expression values for which *Predicate* evaluates to `true`.

This is useful, for example, when some column has a large number of values
(e.g., an "error text" column) and you want to sample that column once per a unique value of the compound group key.

Note that there are *no guarantees* about which record will be returned; the algorithm for selecting
that record is undocumented and one should not assume it is stable.

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

`summarize` `anyif(`*Expr*, `*Predicate*`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation.
* *Predicate*: predicate that if true, the *Expr* will be used for aggregation calculation.

**Returns**

Randomly selects one row of the group and returns the value of the specified expression for which *Predicate* evaluates to `true`.


**Examples**

Show random continent which has population from 300 million to 600 million:

```kusto
Continents | summarize anyif(Continent, Population between (300000000 .. 600000000))
```

![alt text](./images/aggregations/any1.png "any1")