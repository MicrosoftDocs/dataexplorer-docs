---
title:  Null values
description: Learn how to use and understand null values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/13/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# Null values

All scalar data types in Kusto have a special value that represents a missing value.
This value is called the *null value*, or *null*.

> [!NOTE]
> The `string` data type doesn't support null values.

## Null literals

The null value of a scalar type *T* is represented in the query language by the null literal `T(null)`.

The following query returns a single row full of null values:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjKz8/RyCvNydHUUUhJLEktycxNhfMr8xJzM5Nh3PTSzBQYG6gVxszJz0uHsYtSExGm5Zcm5cDNQpgLAOW2JXx4AAAA" target="_blank">Run the query</a>

```kusto
print bool(null), datetime(null), dynamic(null), guid(null), int(null), long(null), real(null), double(null), time(null)
```

## Predicates on null values

The scalar function [`isnull()`](../isnull-function.md) can be used to determine if a scalar value
is the null value. The corresponding function [`isnotnull()`](../isnotnull-function.md) can be used
to determine if a scalar value isn't the null value.

> [!NOTE]
> Because the `string` type doesn't support null values, we recommend using
> the [`isempty()`](../isempty-function.md) and the [`isnotempty()`](../isnotempty-function.md)
> functions.

## Equality and inequality of null values

* **Equality** (`==`): Applying the equality operator to two null values yields `bool(null)`.
  Applying the equality operator to a null value and a non-null value yields `bool(false)`.
* **Inequality** (`!=`): Applying the inequality operator to two null values yields `bool(null)`.
  Applying the inequality operator to a null value and a non-null value yields `bool(true)`.

For example:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjbLEHKvMvBLNaFMdBSCtkVeak6MZy1WjkFpRkpqXouBZ7JSZnp5aFJKRmGesYKsAVK9gp2CMQ4F/kR9QP0KZQn6RQmYxyEyQRZrIulwLSxNzQvKR1NvaIlyArNIvvwRTsSKSYgAsrfz+zgAAAA==" target="_blank">Run the query</a>

```kusto
datatable(val:int)[5, int(null)]
| extend IsBiggerThan3 = val > 3
| extend IsBiggerThan3OrNull = val > 3 or isnull(val)
| extend IsEqualToNull = val == int(null)
| extend IsNotEqualToNull = val != int(null)
```

**Output**

|val |IsBiggerThan3|IsBiggerThan3OrNull|IsEqualToNull|IsNotEqualToNull|
|----|-------------|-------------------|-------------|----------------|
|5   |true         |true               |false        |true            |
|null|null         |true               |null         |null            |

## Null values and aggregation functions

When applying the following operators to entities that include null values, the null values are ignored and don't factor into the calculation:

* [count()](../count-aggregation-function.md)
* [count_distinct()](../count-distinct-aggregation-function.md)
* [countif()](../countif-aggregation-function.md)
* [dcount()](../dcount-aggfunction.md)
* [dcountif()](../dcountif-aggregation-function.md)
* [make_bag()](../make-bag-aggregation-function.md)
* [make_bag_if()](../make-bag-if-aggregation-function.md)
* [make_list()](../make-list-aggregation-function.md)
* [make_list_if()](../make-list-if-aggregation-function.md)
* [make_set()](../make-set-aggregation-function.md)
* [make_set_if()](../make-set-if-aggregation-function.md)
* [stdev()](../stdev-aggregation-function.md)
* [stdevif()](../stdevif-aggregation-function.md)
* [sum()](../sum-aggregation-function.md)
* [sumif()](../sumif-aggregation-function.md)
* [variance()](../variance-aggregation-function.md)
* [varianceif()](../varianceif-aggregation-function.md)

## Null values and the `where` operator

The [where operator](../where-operator.md) use Boolean expressions to determine
if to emit each input record to the output. This operator treats null values as if
they're `bool(false)`. Records for which the predicate returns the null value are dropped and don't appear in the output.

For example:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjcyyxByrzLwSHYViEKu4pCgzL10z2lRHQSlRSUcBKKORV5qTownkJynFctUolGekFqUqgLQpKNoqmAIA+YQGikoAAAA=" target="_blank">Run the query</a>

```kusto
datatable(ival:int, sval:string)[5, "a", int(null), "b"]
| where ival != 5
```

**Output**

|ival|sval|
|----|----|
|null|b   |

## Null values and binary operators

Binary operators are scalar operators that accept two scalar values and produce a third value. For example, greater-than (&gt;) and Boolean AND (&amp;&amp;) are binary operators.

For all binary operators, except as noted in [Exceptions to this rule](#exceptions-to-this-rule), the rule is as follows:

If one or both of the values input to the binary operator are null values, then the output of the binary operator is also the null value.
In other words, the null value is "sticky".

### Exceptions to this rule

* For the equality (`==`) and inequality (`!=`) operators,
  if one of the values is null and the other value isn't null, then the result is either `bool(false)` or `bool(true)`, respectively.
* For the logical AND (&amp;&amp;) operator, if one of
  the values is `bool(false)`, the result is also `bool(false)`.
* For the logical OR (`||`) operator, if one of
  the values is `bool(true)`, the result is also `bool(true)`.

For example:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjbLEHKvMvBLNaFMdBSCtkVeak6MZy1WjkFpRkpqXouCYkqJgqwBUpaCtYGiAEPctzSnJLMiphEpqASUBmujtH1UAAAA=" target="_blank">Run the query</a>

```kusto
datatable(val:int)[5, int(null)]
| extend Add = val + 10
| extend Multiply = val * 10
```

**Output**

|val |Add |Multiply|
|----|----|--------|
|5   |15  |50      |
|null|null|null    |

## Null values and the logical NOT (`!`) operator

The logical NOT operator [not()](../not-function.md) yields the value `bool(null)` if the argument is the null value.

## Null values and the `in` operator

* The [in operator](../in-operator.md) behaves like a logical OR of equality comparisons.
* The `!in` operator behaves like a logical `AND` of inequality comparisons.

## Null values and data ingestion

For most data types, a missing value in the data source produces a null value in the corresponding table cell. However, columns of type `string` and CSV (or CSV-like) data formats are an exception to this rule, and a missing value produces an empty string.

For example:

```kusto
.create table T(a:string, b:int)

.ingest inline into table T
[,]
[ , ]
[a,1]

T
| project a, b, isnull_a=isnull(a), isempty_a=isempty(a), stlen_a=strlen(a), isnull_b=isnull(b)
```

**Output**

|a     |b     |isnull_a|isempty_a|strlen_a|isnull_b|
|------|------|---------|----------|---------|---------|
|&nbsp;|&nbsp;|false    |true      |0        |true     |
|&nbsp;|&nbsp;|false    |false     |1        |true     |
|a     |1     |false    |false     |1        |false    |

::: zone pivot="azuredataexplorer, fabric"

> [!NOTE]
> * If you run the above query in Kusto.Explorer, all `true` values will be displayed as `1`, and all `false` values will be displayed as `0`.
> * Kusto doesn't offer a way to constrain a table's column from having null values. In other words, there's no equivalent to SQL's `NOT NULL` constraint.

::: zone-end

::: zone pivot="azuremonitor"

> [!NOTE]
> Kusto doesn't offer a way to constrain a table's column from having null values. In other words, there's no equivalent to SQL's `NOT NULL` constraint.

::: zone-end
