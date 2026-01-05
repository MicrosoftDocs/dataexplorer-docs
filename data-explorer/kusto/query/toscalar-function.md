---
title:  toscalar()
description: Learn how to use the toscalar() function to return a scalar constant value of the evaluated expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/09/2025
---
# toscalar()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a scalar constant value of the evaluated expression.

This function is useful for queries that require staged calculations. For example,
calculate a total count of events, and then use the result to filter groups
that exceed a certain percent of all events.

Any two statements are separated by a semicolon.

## Syntax

`toscalar(`*expression*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *expression* | `string` |  :heavy_check_mark: | The value to convert to a scalar value.|

## Returns

A scalar constant value of the evaluated expression.
If the result is a tabular, then the first column and first row is taken for conversion.

> [!TIP]
> You can use a [let statement](let-statement.md) for readability of the query when using `toscalar()`.

## Limitations

`toscalar()` can't be applied on a scenario that applies the function on each row. This is because the function can only be calculated a constant number of times during the query execution.
Usually, when this limitation is hit, the following error is returned: `can't use '<column name>' as it is defined outside its row-context scope.`

In the following example, the query fails with the error:

> `'toscalar': can't use 'x' as it is defined outside its row-context scope.` 

```kusto
let _dataset1 = datatable(x:long)[1,2,3,4,5];
let _dataset2 = datatable(x:long, y:long) [ 1, 2, 3, 4, 5, 6];
let tg = (x_: long)
{
    toscalar(_dataset2| where x == x_ | project y);
};
_dataset1
| extend y = tg(x)
```

This failure can be mitigated by using the `join` operator, as in the following example:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVGIT0ksSSxOLTFUsFUAMUsSk3JSNSqsFHLy89I1ow11FIx0FIx1FEx0FExjrblykLQYYdOio1AJ1auAqllHwQyoH24dV41CVn5mnoIG3DRNhfw8hQoFoERBUX5WanKJQgXQMAB+d0ZipAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let _dataset1 = datatable(x: long)[1, 2, 3, 4, 5];
let _dataset2 = datatable(x: long, y: long) [1, 2, 3, 4, 5, 6];
_dataset1
| join (_dataset2) on x 
| project x, y
```

**Output**

|x|y|
|---|---|
|1|2|
|3|4|
|5|6|

### Additional mitigation patterns for real-world scenarios

In many practical scenarios, you may want to compute a scalar value per row using
an expression that performs its own aggregation, such as:

```kusto
| extend result = toscalar(T | where Key == key | summarize max(Value))
```

This pattern fails because `toscalar()` cannot be evaluated once per row.
Use one of the supported mitigation patterns below.

1. Pre-aggregate the data once and then join the aggregated results back to the main table for improved efficiency.

```kusto
let summary =
    T
    | summarize maxValue = max(Value) by Key;

Dataset1
| join kind=leftouter summary on Key
| project Key, maxValue
```

2. Use `arg_max()` to retrieve the row with the highest value. This is useful when you need both the maximum value and the associated columns.

```kusto
let summary =
    T
    | summarize arg_max(Timestamp, *) by Key;

Dataset1
| lookup summary on Key
```

3. Use a `lookup` for key/value mappings to avoid row-context violations and ensure efficient dimension-table lookups.

```kusto
let lookupTable =
    T | summarize maxValue = max(Value) by Key;

Dataset1
| lookup lookupTable on Key
```

4. Use window functions or `make-series` for time-window aggregations

```kusto
Dataset1
| make-series maxValue = max(Value)
      on Timestamp
      from ago(1h) to now()
      step 1m
      by Key
```

## Examples

The examples in this section show how to use the syntax to help you get started.

### Set range for evaluation

Evaluate `Start`, `End`, and `Step` as scalar constants, and use the result for `range` evaluation.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02NQQrCQAxF94J3+EuFbupOJEtP0BMMNS3COFPSCIP08M1kELoL/7/3E1kxaBAFQfM6hhjkssg7KQr118f5FI14ptexl5BmRsEk+YPectyxKi92bxjzN+lfHGp6MG+1aPqv6e25TdQfPuLOBi7KHllPTnWwgIzrHKQK7lv8zY7AAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let Start = toscalar(print x=1);
let End = toscalar(range x from 1 to 9 step 1 | count);
let Step = toscalar(2);
range z from Start to End step Step | extend start=Start, end=End, step=Step
```

**Output**

|z|start|end|step|
|---|---|---|---|
|1|1|9|2|
|3|1|9|2|
|5|1|9|2|
|7|1|9|2|
|9|1|9|2|

### Generate fixed and dynamic GUID

The following example shows how `toscalar()` can be used to generate a fixed `guid`, calculated precisely once, and dynamic values for `guid`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0XLsQqAIBRG4T3wHf5RoUXX8FlC8nYJTEONDHr4bGo9HydQBWtY1FQWF1yWka6Zz81LpSYxhM9N9z/3ml1kQsOa0w7dXxiUSge0GB5QqxQ9mmU94rZsXqEZQWVlAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let g1 = toscalar(new_guid());
let g2 = new_guid();
range x from 1 to 2 step 1
| extend x=g1, y=g2
```

**Output**

|x|y|
|---|---|
|e6a15e72-756d-4c93-93d3-fe85c18d19a3|c2937642-0d30-4b98-a157-a6706e217620|
|e6a15e72-756d-4c93-93d3-fe85c18d19a3|c6a48cb3-9f98-4670-bf5b-589d0e0dcaf5|

## Related content

* [Scalar function types at a glance](scalar-functions.md)
