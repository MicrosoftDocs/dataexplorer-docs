---
title: Overflows - Azure Data Explorer | Microsoft Docs
description: This article describes Overflows in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# Overflows

An overflow occurs when the result of a computation is too large for the destination type.
This phenomenon usually leads to a [partial query failure](partialqueryfailures.md).

For example, the following query will result in an overflow:

```kusto
let Weight = 92233720368547758;
range x from 1 to 3 step 1
| summarize percentilesw(x, Weight * 100, 50)
```

Kusto's `percentilesw()` implementation accumulates the `Weight` expression for values that are "close enough".
In this case, the accumulation triggers an overflow because it doesn't fit into a signed 64 bit integer.

Usually, however, overflows are a result of a "bug" in the query, since Kusto uses 64 bit types for arithmetic computations.
The best course of action in such cases is to identifiy from the error message which function or aggregation triggered an overflow
and to make sure its' input arguments evaluate to values that make sense.
