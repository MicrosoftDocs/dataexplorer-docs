---
title: distinct operator - Azure Data Explorer | Microsoft Docs
description: This article describes distinct operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# distinct operator

Produces a table with the distinct combination of the provided columns of the input table. 

```kusto
T | distinct Column1, Column2
```

Produces a table with the distinct combination of all columns in the input table.

```kusto
T | distinct *
```

**Example**

Shows the distinct combination of fruit and price.

```kusto
Table | distinct fruit, price
```

![alt text](./Images/aggregations/distinct.PNG "distinct")

**Remarks**

There are two main semantic differences between the `distinct` operator and
using `summarize by ...`:
* Distinct supports providing an asterisk (`*`) as the group key, making it easier to use for wide tables.
* Distinct doesn't have auto-binning of time columns (to `1h`).

```kusto
let T=(print t=datetime(2008-05-12 06:45));
union
  (T | distinct * | extend Title="Distinct"),
  (T | summarize by t | extend Title="Summarize"),
  (T | summarize by bin(t, 1tick) | extend Title="Summarize-distinct")
```

This query produces the following table:

t                            | Title
-----------------------------|--------------------
2008-05-12 06:45:00.0000000  | Distinct
2008-05-12 06:00:00.0000000  | Summarize
2008-05-12 06:45:00.0000000  | Summarize-distinct