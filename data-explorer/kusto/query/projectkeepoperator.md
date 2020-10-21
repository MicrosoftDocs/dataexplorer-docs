---
title: project-keep operator - Azure Data Explorer
description: This article describes project-keep operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 10/21/2020
---
# project-keep operator

Select what columns in the input to keep in the output.

```kusto
T | project-keep price, quantity, zz*
```

The order of the columns in the result is determined by their original order in the table. Only the columns that were specified as arguments are kept. The other columns are excluded from the result. (See also `project`.)

## Syntax

*T* `| project-keep` *ColumnNameOrPattern* [`,` ...]

## Arguments

* *T*: The input table
* *ColumnNameOrPattern:* The name of the column or column wildcard-pattern to be kept in the output.

## Returns

A table with columns that were named as arguments. Contains same number of rows as the input table.

**Tips**

* Use [`project-rename`](projectrenameoperator.md) if your intention is to rename columns.
* Use [`project-reorder`](projectreorderoperator.md) if your intention is to reorder columns.

* You can `project-keep` any columns that are present in the original table or that were computed as part of the query.

## Examples

The input table `T` has three columns of type `long`: `A`, `B`, and `C`.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
datatable(A1:long, A2:long, B:long) [1, 2, 3]
| project-keep A*    // Keeps only columns A1 and A2 in the output
```

|A1|A2|
|---|---|
|1|2|

## See also

To choose what columns in the input to exclude from the output, use [project-away](projectawayoperator.md).
