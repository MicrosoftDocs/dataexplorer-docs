---
title:  Overflows
description:  This article describes Overflows.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/13/2020
---
# Overflows

An overflow occurs when the result of a computation is too large for the destination type.
The overflow usually leads to a [partial query failure](partial-query-failures.md).

For example, the following query will result in an overflow.

```kusto
let Weight = 92233720368547758;
range x from 1 to 3 step 1
| summarize percentilesw(x, Weight * 100, 50)
```

Kusto's `percentilesw()` implementation accumulates the `Weight` expression for values that are "close enough".
In this case, the accumulation triggers an overflow because it doesn't fit into a signed 64-bit integer.

Usually, overflows are a result of a "bug" in the query, since Kusto uses 64-bit types for arithmetic computations.
The best course of action is to look at the error message, and identify the function or aggregation that triggered the overflow. Make sure the input arguments evaluate to values that make sense.
