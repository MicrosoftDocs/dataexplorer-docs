---
title: project-reorder operator - Azure Data Explorer | Microsoft Docs
description: This article describes project-reorder operator in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/22/2019
---
# project-reorder operator

Reorders columns in the result output.

```kusto
T | project-reorder Col2, Col1, Col* asc
```

**Syntax**

*T* `| project-reorder` *ColumnNameOrPattern* [`asc`|`desc`] [`,` ...]

**Arguments**

* *T*: The input table.
* *ColumnNameOrPattern:* The name of the column or column wildcard-pattern to be added to the output.
* For wildcard-patterns: specifying `asc` or `desc` keyword will order columns using thier names ascending or descending. Not specifying either `asc` or `desc` will carry-on the order of the matching columns as they appeared in the source table.

**Returns**

A table that has the columns in the order specified by the operator arguments. `project-reorder` does not renames or removes columns from the table, this means that all columns that existed in the source table, will appear in the result table.

**Notes**

- In case of abmigous *ColumnNameOrPattern* matching, the column will appear at the earlies position matching the pattern.
- It is not required to specify all columns for the `project-reorder`. Columns that were not specified explicitely will appear as last columns of the output table.

* Use [`project-away`](projectawayoperator.md) if your intention is to remove columns.
* Use [`project-rename`](projectrenameoperator.md) if your intention is to rename columns.


**Examples**

Reordering table with three columns (a, b, c) so that second column (b) will appear first.

```kusto
print a='a', b='b', c='c'
|  project-reorder b
```

|b|a|c|
|---|---|---|
|b|a|c|

Reordering table with three columns (a, b, c) so that second column (b) will appear first.

```kusto
print b = 'b', a2='a2', a3='a3', a1='a1'
|  project-reorder a* asc
```

|a1|a2|a3|b|
|---|---|---|---|
|a1|a2|a3|b|