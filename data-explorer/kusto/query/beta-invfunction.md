---
title: beta-inv() (Azure Kusto)
description: This article describes beta-inv() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# beta-inv()

Returns the inverse of the beta cumulative probability beta density function.

    beta-inv(0.1, 10.0, 50.0)

If probability = beta-cdf(x,...), then beta-inv(probability,...) = x. 

The beta distribution can be used in project planning to model probable completion times given an expected completion time and variability.

**Syntax**

`beta-inv(`*probability*`, `*alpha*`, `*beta*`)`

**Arguments**

* *probability*: A probability associated with the beta distribution.
* *alpha*: A parameter of the distribution.
* *beta*: A parameter of the distribution.

**Returns**

* The inverse of the beta cumulative probability density function [beta-cdf()](./beta-cdffunction.md)

**Remarks**

If any argument is nonnumeric, beta-inv() returns null value.

If alpha â‰¤ 0 or beta â‰¤ 0, beta-inv() returns the null value.

If probability â‰¤ 0 or probability > 1, beta-inv() returns the NaN value.

Given a value for probability, beta-inv() seeks that value x such that beta-cdf(x, alpha, beta) = probability.

**Examples**

```kusto
datatable(p:double, alpha:double, beta:double, comment:string)
[
    0.1, 10.0, 20.0, "Valid input",
    1.5, 10.0, 20.0, "p > 1, yields null",
    0.1, double(-1.0), 20.0, "alpha is < 0, yields NaN"
]
| extend b = beta-inv(p, alpha, beta)
```

|p|alpha|beta|comment|b|
|---|---|---|---|---|
|0.1|10|20|Valid input|0.226415022388749|
|1.5|10|20|p > 1, yields null||
|0.1|-1|20|alpha is < 0, yields NaN|NaN|

**See also**

* For computing cumulative beta distribution function, see [beta-cdf()](./beta-cdffunction.md).
* For computing probability beta density function, see [beta-pdf()](./beta-pdffunction.md).
