---
title:  lookup operator
description: Learn how to use the lookup operator to extend columns of a fact table.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/04/2024
---
# lookup operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Extends the columns of a fact table with values looked-up in a dimension table.

For example, the following query results in a table that extends the `FactTable` (`$left`) with data from the `DimensionTable` (`$right`) by performing a lookup. The lookup matches each pair (`CommonColumn`, `Col1`) from `FactTable` with each pair (`CommonColumn`, `Col2`) in the `DimensionTable`. For the differences between fact and dimension tables, see [fact and dimension tables](../concepts/fact-and-dimension-tables.md).

```kusto
FactTable | lookup kind=leftouter (DimensionTable) on CommonColumn, $left.Col1 == $right.Col2
```

The `lookup` operator performs an operation similar to the [join operator](join-operator.md)
with the following differences:

* The result doesn't repeat columns from the `$right` table that are the basis
  for the join operation.
* Only two kinds of lookup are supported, `leftouter` and `inner`, with `leftouter` being the default.
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

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*LeftTable*| `string` | :heavy_check_mark:|The table or tabular expression that is the basis for the lookup. Denoted as `$left`.|
|*RightTable*| `string` | :heavy_check_mark:|The table or tabular expression that is used to "populate" new columns in the fact table. Denoted as `$right`.|
|*Attributes*| `string` | :heavy_check_mark:|A comma-delimited list of one or more rules that describe how rows from *LeftTable* are matched to rows from *RightTable*. Multiple rules are evaluated using the `and` logical operator. See [Rules](#rules).|
|`kind`| `string` ||Determines how to treat rows in *LeftTable* that have no match in *RightTable*. By default, `leftouter` is used, which means all those rows appear in the output with null values used for the missing values of *RightTable* columns added by the operator. If `inner` is used, such rows are omitted from the output. Other kinds of join aren't supported by the `lookup` operator.|

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
  The columns of the right side are automatically renamed if there are name conflicts.
* A row for every match between the input tables. A match is a row selected from one table that has the same value for all the `on` fields as a row in the other table.
* The *Attributes* (lookup keys) appear only once in the output table.
* If `kind` is unspecified or `kind=leftouter`, then in addition to the inner matches, there's a row for every row on the left (and/or right), even if it has no match. In that case, the unmatched output cells contain nulls.
* If `kind=inner`, then there's a row in the output for every combination of matching rows from left and right.

## Examples

The following example shows how to perform a left outer join between the  `FactTable` and `DimTable`, based on matching values in the `Personal` and `Family` columns.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA32RPWsDMQxA94P7D8JTA176tSRkKG2zBdqSrXTQJU5rTravPptykB8fuedzQobgRdKzJT1MKsAKt2GDDanlDgMfjm4%2B3N%2B8D17bb%2FmmfO8s0pSv0GgacjaDz7oCELdCguBHaDngfB199zMI%2BQ%2FvEnwl0v0IN9Fb5TO8vwYfElzjgIlx%2F0Zb3iXDxwTfo7bjTBDPaLpGEYm6%2BlrUFbHbizaXald95BNp7C%2FkilfRStN8qpq8SxEo%2B4NQqRbyhSxx5gDCcG0yPXmcNEar30S22an8VV0dgJxrYwettrslqX1wMShflMFZmFwljJZHtRbAkO8BAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let FactTable=datatable(Row:string,Personal:string,Family:string) [
  "1", "Rowan",   "Murphy",
  "2", "Ellis",   "Turner",
  "3", "Ellis",   "Turner",
  "4", "Maya",  "Robinson",
  "5", "Quinn",    "Campbell"
];
let DimTable=datatable(Personal:string,Family:string,Alias:string) [
  "Rowan",  "Murphy",   "rowanm",
  "Ellis",  "Turner", "ellist",
  "Maya", "Robinson", "mayar",
  "Quinn",   "Campbell",    "quinnc"
];
FactTable
| lookup kind=leftouter DimTable on Personal, Family
```

**Output**

| Row | Personal | Family | Alias |
|--|--|--|--|
| 1 | Rowan | Murphy | rowanm |
| 2 | Ellis | Turner | ellist |
| 3 | Ellis | Turner | ellist |
| 4 | Maya | Robinson | mayar |
| 5 | Quinn | Campbell | quinnc |

## Related content

* [Broadcast join](broadcast-join.md)
* [leftouter join](join-leftouter.md)
* [inner join](join-inner.md)
* [join operator](join-operator.md)