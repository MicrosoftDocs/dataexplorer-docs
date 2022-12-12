---
title: extend operator - Azure Data Explorer
description: Learn how to use the extend operator to create calculated columns and append them to the result set.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/11/2022
---
# extend operator

Create calculated columns and append them to the result set.

```kusto
T | extend duration = endTime - startTime
```

## Syntax

*T* `| extend` [*ColumnName* | `(`*ColumnName*[`,` ...]`)` `=`] *Expression* [`,` ...]

## Arguments

* *T*: The input tabular result set.
* *ColumnName:* Optional. The name of the column to add or update. If omitted, the name will be generated. If *Expression* returns more than one column, a list of column names can be specified in parentheses. In this case *Expression*'s output columns will be given the specified names, dropping the rest of the output columns, if there are any. If a list of the column names isn't specified, all *Expression*'s output columns with generated names will be added to the output.
* *Expression:* A calculation over the columns of the input.

## Returns

A copy of the input tabular result set, such that:

* Column names noted by `extend` that already exist in the input are removed and appended as their new calculated values.
* Column names noted by `extend` that don't exist in the input are appended as their new calculated values.

>[!TIP]
>
> The `extend` operator adds a new column to the input result set, which does **not** have an index. In most cases, if the new column is set to be exactly the same as an existing table column that has an index, Kusto can automatically use the existing index. However, in some complex scenarios this propagation is not done. In such cases, if the goal is to rename a column, use the [project-rename operator](projectrenameoperator.md) instead.

## Example

```kusto
Logs
| extend
    Duration = CreatedOn - CompletedOn
    , Age = now() - CreatedOn
    , IsSevere = Level == "Critical" or Level == "Error"
```

You can use the [series_stats](series-statsfunction.md) function to return multiple columns.
