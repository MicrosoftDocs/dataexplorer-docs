---
title: lookup operator - Azure Data Explorer
description: Learn how to use the lookup operator to extend columns of a fact table.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/12/2023
---
# lookup operator

Extends the columns of a fact table with values looked-up in a dimension table.

```kusto
FactTable | lookup kind=leftouter (DimensionTable) on CommonColumn, $left.Col1 == $right.Col2
```

Here, the result is a table that extends the `FactTable` (`$left`) with data from `DimensionTable` (referenced by `$right`)
 by performing a lookup of each pair (`CommonColumn`,`Col`) from the former table
with each pair (`CommonColumn1`,`Col2`) in the latter table.
For the differences between fact and dimension tables, see [fact and dimension tables](../concepts/fact-and-dimension-tables.md).

The `lookup` operator performs an operation similar to the [join operator](joinoperator.md)
with the following differences:

* The result doesn't repeat columns from the `$right` table that are the basis
  for the join operation.
* Only two kinds of lookup are supported, `leftouter` and `inner`,
  with `leftouter` being the default.
* In terms of performance, the system by default assumes that the `$left` table
  is the larger (facts) table, and the `$right` table is the smaller (dimensions)
  table. This is exactly opposite to the assumption used by the `join` operator.
* The `lookup` operator automatically broadcasts the `$right` table to the `$left`
  table (essentially, behaves as if `hint.broadcast` was specified). This limits the size of the `$right` table.

> [!NOTE]
> If the right side of the lookup is larger than several tens of MBs, the query will fail.
>
> You can run the following query to estimate the size of the right side in bytes:
>
> ```kusto
> rightSide
> | summarize sum(estimate_data_size(*))
> ```

## Syntax

*LeftTable* `|` `lookup` [`kind` `=` (`leftouter`|`inner`)] `(`*RightTable*`)` `on` *Attributes*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*LeftTable*|string|&check;|The table or tabular expression that is the basis for the lookup. Denoted as `$left`.|
|*RightTable*|string|&check;|The table or tabular expression that is used to "populate" new columns in the fact table. Denoted as `$right`.|
|*Attributes*|string|&check;|A comma-delimited list of one or more rules that describe how rows from *LeftTable* are matched to rows from *RightTable*. Multiple rules are evaluated using the `and` logical operator. See [Rules](#rules).|
|`kind`|string||Determines how to treat rows in *LeftTable* that have no match in *RightTable*. By default, `leftouter` is used, which means all those rows will appear in the output with null values used for the missing values of *RightTable* columns added by the operator. If `inner` is used, such rows are omitted from the output. Other kinds of join aren't supported by the `lookup` operator.|

### Rules

| Rule kind | Syntax | Predicate |
|---|---|---|
| Equality by name | *ColumnName* | `where` *LeftTable*.*ColumnName* `==` *RightTable*.*ColumnName* |
| Equality by value | `$left.`*LeftColumn* `==` `$right.`*RightColumn* | `where` `$left.`*LeftColumn* `==` `$right.`*RightColumn |

> [!NOTE]
> In case of 'equality by value', the column names *must* be qualified with the applicable owner table denoted by `$left` and `$right` notations.

## Returns

A table with:

* A column for every column in each of the two tables, including the matching keys.
  The columns of the right side will be automatically renamed if there are name conflicts.
* A row for every match between the input tables. A match is a row selected from one table that has the same value for all the `on` fields as a row in the other table.
* The Attributes (lookup keys) will appear only once in the output table.
* If `kind` is unspecified or `kind=leftouter`, then in addition to the inner matches, there's a row for every row on the left (and/or right), even if it has no match. In that case, the unmatched output cells contain nulls.
* If `kind=inner`, then there's a row in the output for every combination of matching rows from left and right.

## Examples

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32RsW4CMQyG93sKKxOVslDahYoBqOhatWwVQ+4wyMJJqotpVakP3wQ3h2BAGRL7k+X/UxgFVq6TtWsZZ1sn+eTX6C1+T5P0FPb2FfsUg+Nar5wn/vmv7uCjATBjY8EsiDnfuXxxgsnYQu4vyZIpSAzKJjfYQ2Hvgl9YoFk4Zo+9ssfC1uRPY3kuxoNpNk8NZ5ln8tcuNwXsnMmlS5saqXqUJW3u7XX9gIfAijvFNfQ5M5hUeq3yGlxzq4KQ704Kw180v8CZHz/hQGE7Y9xJPAr2gyDEANXMgjr9AbRCGP7OAQAA" target="_blank">Run the query</a>

```kusto
let FactTable=datatable(Row:string,Personal:string,Family:string) [
  "1", "Bill",   "Gates",
  "2", "Bill",   "Clinton",
  "3", "Bill",   "Clinton",
  "4", "Steve",  "Ballmer",
  "5", "Tim",    "Cook"
];
let DimTable=datatable(Personal:string,Family:string,Alias:string) [
  "Bill",  "Gates",   "billg",
  "Bill",  "Clinton", "billc",
  "Steve", "Ballmer", "steveb",
  "Tim",   "Cook",    "timc"
];
FactTable
| lookup kind=leftouter DimTable on Personal, Family
```

Row     | Personal  | Family   | Alias
--------|-----------|----------|--------
1       | Bill      | Gates    | billg
2       | Bill      | Clinton  | billc
3       | Bill      | Clinton  | billc
4       | Steve     | Ballmer  | steveb
5       | Tim       | Cook     | timc
