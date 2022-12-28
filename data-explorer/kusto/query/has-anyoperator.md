---
title: The case-insensitive has_any string operator - Azure Data Explorer
description: Learn how to use the has_any operator to filter data with any set of case-insensitive strings.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/28/2022
---
# has_any operator

Filters a record set for data with any set of case-insensitive strings. `has` searches for indexed terms, where a [term](datatypes-string-operators.md#what-is-a-term) is three or more characters. If your term is fewer than three characters, the query scans the values in the column, which is slower than looking up the term in the term index.

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

For faster results, use the case-sensitive version of an operator. For example, use `has_cs` instead of `has`.

## Syntax

*T* `|` `where` *col* `has_any` `(`*scalar_expr*`,` [*scalar_expr_2*`,` *scalar_expr3*`,` ... ]`)`
*T* `|` `where` *col* `has_any` `(`*tabular_expr*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input whose records are to be filtered.|
| *col* | string | &check; | The column used to filter the records.|
| *scalar_expr* | scalar | | An expression or list of expressions to search for in *col*.|
| *tabular_expr* | string | | The name of a tabular expression that has a set of values. If the tabular expression has multiple columns, the first column is used.|

> [!NOTE]
> At least one *scalar_expr* or a single *tabular_expr* is required.

## Returns

Rows in *T* for which the predicate is `true`

> [!NOTE]
>
> * The expression list can produce up to 10,000 values.
> * For tabular expressions, the first column of the result set is selected.

## Examples

### Use has_any operator with a list

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksSVXISCyOT8yrVNBQcnYM8vfx9HNU0lFQcnH09g8Bs/xcw5U0wbqKS3NzE4syq1IVkvNL80o0NBWSKiGGAACHltT/YAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State has_any ("CAROLINA", "DAKOTA", "NEW") 
| summarize count() by State
```

|State|count_|
|---|---|
|NEW YORK|1750|
|NORTH CAROLINA|1721|
|SOUTH DAKOTA|1567|
|NEW JERSEY|1044|
|SOUTH CAROLINA|915|
|NORTH DAKOTA|905|
|NEW MEXICO|527|
|NEW HAMPSHIRE|394|

### Use has_any operator with a dynamic array

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoLkksSS1WsFVIqcxLzM1M1ohWL84vLclQ11FQz8svAjJiNa15uYJL8otyXctS80qKFXi5ahTKM1KLUhWCQZoVMhKL4xPzKhU0IGZpguSLS3NzE4syq1IVkvNL80o0NBWSKiHKAZ3v1Dd1AAAA" target="_blank">Run the query</a>

```kusto
let states = dynamic(['south', 'north']);
StormEvents 
| where State has_any (states)
| summarize count() by State
```

|State|count_|
|---|---|
|NORTH CAROLINA|1721|
|SOUTH DAKOTA|1567|
|SOUTH CAROLINA|915|
|NORTH DAKOTA|905|
|ATLANTIC SOUTH|193|
|ATLANTIC NORTH|188|
