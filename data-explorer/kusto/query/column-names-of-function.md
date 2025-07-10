---
title: column_names_of()
description: Learn how to use the column_names_of() function to get the column names of a tabular expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/10/2025
---
# column_names_of()

Returns the column names of a tabular expression.

## Syntax

`column_names_of(`*expression*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expression* | `expression` | :heavy_check_mark: | The tabular expression to evaluate. |

## Returns

Returns a dynamic array of strings, where each element represents a column name of the `expression` schema. If the expression doesn't exist, an error is raised.

## Examples

### Example 1: Get column names from a datatable

The following example returns the columns of the tabular expression `T`. `T` can be a table in the database or defined with a `let` statement.

```kusto
let T = datatable(A:string, B:int) [];
print Columns=column_names_of(T)
```

**Output:**

| Columns |
|---------|
| [<br>  "A",<br>  "B"<br>] |

### Example 2: Get column names from a function

Similarly, you can call `column_names_of()` with functions:

```kusto
let MyFunction1 = () { print A="", B=1 };
print column_names_of(MyFunction1())
```

**Output:**

| print_0 |
|---------|
| [<br>  "A",<br>  "B"<br>] |

### Example 3: Get column names from a function with parameters

If the function has arguments, they can be used when calling `column_names_of()`:

```kusto
let MyFunction1 = (param1:int) { print A="", B=1 };
print column_names_of(MyFunction1(1))
```

**Output:**

| print_0 |
|---------|
| [<br>  "A",<br>  "B"<br>] |


