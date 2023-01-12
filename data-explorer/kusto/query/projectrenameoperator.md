---
title: project-rename operator - Azure Data Explorer
description: Learn how to use the project-rename operator to rename columns in the result output.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/12/2023
---
# project-rename operator

Renames columns in the result output.

```kusto
T | project-rename new_column_name = column_name
```

## Syntax

*T* `| project-rename` *NewColumnName* = *ExistingColumnName* [`,` ...]

## Arguments

* *T*: The input table.
* *NewColumnName:* The new name of a column.
* *ExistingColumnName:* The existing name of a column.

## Returns

A table that has the columns in the same order as in an existing table, with columns renamed.

## Examples

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print a='a', b='b', c='c'
|  project-rename new_b=b, new_a=a
```

**Output**

|new_a|new_b|c|
|---|---|---|
|a|b|c|
