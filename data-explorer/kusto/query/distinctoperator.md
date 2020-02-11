---
title: distinct operator - Azure Data Explorer | Microsoft Docs
description: This article describes distinct operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/09/2020
---
# distinct operator

Produces a table with the distinct combination of the provided columns of the input table. 

```
T | distinct Column1, Column2
```

Produces a table with the distinct combination of all columns in the input table.


```
T | distinct *
```

**Example**

Shows the distinct combination of fruit and price.


```
Table | distinct fruit, price
```

![alt text](./Images/aggregations/distinct.PNG "distinct")

**Notes**

* Unlike `summarize by ...`, the `distinct` operator supports providing an asterisk (`*`) as the group key, making it easier to use for wide tables.
* If the group by keys are of high cardinalities, using `summarize by ...` with the [shuffle strategy](shufflequery.md) could be useful.