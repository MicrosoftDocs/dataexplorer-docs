---
title:  mv-expand operator
description: Learn how to use the mv-expand operator to expand multi-value dynamic arrays or property bags into multiple records.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel "
---
# mv-expand operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)] 


Expands multi-value dynamic arrays or property bags into multiple records.

`mv-expand` can be described as the opposite of the aggregation operators
that pack multiple values into a single [dynamic](scalar-data-types/dynamic.md)-typed
array or property bag, such as `summarize` ... `make-list()` and `make-series`.
Each element in the (scalar) array or property bag generates a new record in the
output of the operator. All columns of the input that aren't expanded are duplicated to all the records in the output.

## Syntax

*T* `|mv-expand` [`kind=`(`bag` | `array`)] [`with_itemindex=` *IndexColumnName*] *ColumnName* [`to typeof(` *Typename*`)`] [`,` *ColumnName* ...] [`limit` *Rowlimit*]

*T* `|mv-expand` [`kind=`(`bag` | `array`)] [*Name* `=`] *ArrayExpression* [`to typeof(`*Typename*`)`] [`,` [*Name* `=`] *ArrayExpression* [`to typeof(`*Typename*`)`] ...] [`limit` *Rowlimit*]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ColumnName*, *ArrayExpression*| `string` | :heavy_check_mark:|A column reference, or a scalar expression with a value of type `dynamic` that holds an array or a property bag. The individual top-level elements of the array or property bag get expanded into multiple records.<br>When *ArrayExpression* is used and *Name* doesn't equal any input column name, the expanded value is extended into a new column in the output. Otherwise, the existing *ColumnName* is replaced.|
|*Name*| `string` | |A name for the new column.|
|*Typename*| `string` | :heavy_check_mark:|Indicates the underlying type of the array's elements, which becomes the type of the column produced by the `mv-expand` operator. The operation of applying type is cast-only and doesn't include parsing or type-conversion. Array elements that don't conform with the declared type become `null` values.|
|*RowLimit*| `int` ||The maximum number of rows generated from each original row. The default is 2147483647. `mvexpand` is a legacy and obsolete form of the operator `mv-expand`. The legacy version has a default row limit of 128.|
|*IndexColumnName*| `string` ||If `with_itemindex` is specified, the output includes another column named *IndexColumnName* that contains the index starting at 0 of the item in the original expanded collection.|

## Returns

For each record in the input, the operator returns zero, one, or many records in the output,
as determined in the following way:

1. Input columns that aren't expanded appear in the output with their original value.
   If a single input record is expanded into multiple output records, the value is duplicated
   to all records.

1. For each *ColumnName* or *ArrayExpression* that is expanded, the number of output records
   is determined for each value as explained in [modes of expansion](#modes-of-expansion). For each input record, the maximum number of output records is calculated. All arrays or property bags are expanded "in parallel"
   so that missing values (if any) are replaced by null values. Elements are expanded into rows in the order that they appear in the original array/bag.

1. If the dynamic value is null, then a single record is produced for that value (null).
   If the dynamic value is an empty array or property bag, no record is produced for that value.
   Otherwise, as many records are produced as there are elements in the dynamic value.

The expanded columns are of type `dynamic`, unless they're explicitly typed
by using the `to typeof()` clause.

### Modes of expansion

Two modes of property bag expansions are supported:

* `kind=bag` or `bagexpansion=bag`: Property bags are expanded into single-entry property bags. This mode is the default mode.
* `kind=array` or `bagexpansion=array`: Property bags are expanded into two-element `[`*key*`,`*value*`]` array structures, allowing uniform access to keys and values. This mode also allows, for example, running a distinct-count aggregation over property names.

## Examples

### Single column - array expansion

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUBY1EK4XMvBIdhSQrhZTKvMTczGRNXq5oXi4FIDDUgYlpRBsa6CgYGcRq6kCkjJCk1BPVdRTUk9RjgTpjeblqFHLLdFMrChLzUhSSANALFPlqAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (a: int, b: dynamic)
[
    1, dynamic([10, 20]),
    2, dynamic(['a', 'b'])
]
| mv-expand b
```

**Output**

|a|b|
|---|---|
|1|10|
|1|20|
|2|a|
|2|b|

### Single column - bag expansion

A simple expansion of a single column:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUBY1EK4XMvBIdhSQrhZTKvMTczGRNXq5oXi4FIDDUgYlpVCsVFOUXGCpZKSglGirpKIC5RiBukqFSraYORIMRdg1GqBqMgBp4uWJ5uWoUcst0UysKEvNSFJIAxNVM3ZQAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (a: int, b: dynamic)
[
    1, dynamic({"prop1": "a1", "prop2": "b1"}),
    2, dynamic({"prop1": "a2", "prop2": "b2"})
]
| mv-expand b
```

**Output**

|a|b|
|---|---|
|1|{"prop1": "a1"}|
|1|{"prop2": "b1"}|
|2|{"prop1": "a2"}|
|2|{"prop2": "b2"}|

### Single column - bag expansion to key-value pairs

A simple bag expansion to key-value pairs:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22LsQrDIBiEd8F3OJwSsFAdA3kSyfBbHaSJFZEQafvu1ZYOhd5N9x2fo9JqV4%2BBJoRYJOwEVyNt4TJyZjhDi5JfNtxFyrekxARBSki8p%2B7TKvEc5UfQ%2FwX9K%2BgmcLZw9sC2n%2FyRKDpcQ3Qz5UwVFv3yR%2FGd%2B4oZ1pwXiZ3W2Rq1vADUbch1vwAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (a: int, b: dynamic)
[
    1, dynamic({"prop1": "a1", "prop2": "b1"}),
    2, dynamic({"prop1": "a2", "prop2": "b2"})
]
| mv-expand kind=array b 
| extend key = b[0], val=b[1]
```

**Output**

|a|b|key|val|
|---|---|---|---|
|1|["prop1","a1"]|prop1|a1|
|1|["prop2","b1"]|prop2|b1|
|2|["prop1","a2"]|prop1|a2|
|2|["prop2","b2"]|prop2|b2|

### Zipped two columns

Expanding two columns will first 'zip' the applicable columns and then expand them:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUBY1EK4XMvBIdhSQrhZTKvMTczGQdhWQ4WzOal0sBCAx1YCIa1UoFRfkFhkpWCkqJSjoKYJ4RiJekVKuJUBZtqqNgoqNgHKvJyxXLy1WjkFumm1pRkJiXopAEtAEANvW+roIAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (a: int, b: dynamic, c: dynamic)[
    1, dynamic({"prop1": "a", "prop2": "b"}), dynamic([5, 4, 3])
]
| mv-expand b, c
```

**Output**

|a|b|c|
|---|---|---|
|1|{"prop1":"a"}|5|
|1|{"prop2":"b"}|4|
|1||3|

### Cartesian product of two columns

If you want to get a Cartesian product of expanding two columns, expand one after the other:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUBY1EK4XMvBIdhSQrhZTKvMTczGQdhWQ4W5OXK5qXSwEIDHVgYhrVSgVF+QWGSlYKSolKOgpgnhGIl6RUq4lQFm2qo2AWCzQhlperRiG3TDe1oiAxL0UhCZWbDACXJubPjQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (a: int, b: dynamic, c: dynamic)
[
    1, dynamic({"prop1": "a", "prop2": "b"}), dynamic([5, 6])
]
| mv-expand b
| mv-expand c
```

**Output**

|a|b|c|
|---|---|---|
|1|{  "prop1": "a"}|5|
|1|{  "prop1": "a"}|6|
|1|{  "prop2": "b"}|5|
|1|{  "prop2": "b"}|6|

### Convert output

To force the output of an mv-expand to a certain type (default is dynamic), use `to typeof`:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02MuwoCMRRE+4X8w7BVAtfCBz629TOWFHm5BkyymIu44McbC8WZZjgzjDfcbG8B0gyofI95ItgBfskmRUdwv6xG0aGpP5dc2WTu6VvJcU3YELaEnVZ/eE84EI6Ek1ai06J7IT1W4Tmb7GHbO7iAlzmUi4yZ1WcwBa7uGpJ5A3+651CdAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (a: string, b: dynamic, c: dynamic)[
    "Constant", dynamic([1, 2, 3, 4]), dynamic([6, 7, 8, 9])
]
| mv-expand b, c to typeof(int)
| getschema 
```

**Output**

| ColumnName | ColumnOrdinal | DateType | ColumnType |
|---|---|---|---|
| a | 0 | System.String | `string` |
| b | 1 | System.Object | `dynamic` |
| c | 2 | System.Int32 | `int` |

Notice column `b` is returned as `dynamic` while `c` is returned as `int`.

### Using with_itemindex

Expansion of an array with `with_itemindex`:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzBRKC5JLVAw5OWqUSguzc1NLMqsAqmwVchNzE6Nz8ksLtGo0ATJ5pbpplYUJOalKJRnlmTEZ5ak5mbmpaRW2HqCSIUKAIrdlHpcAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 4 step 1
| summarize x = make_list(x)
| mv-expand with_itemindex=Index x
```

**Output**

|x|Index|
|---|---|
|1|0|
|2|1|
|3|2|
|4|3|

::: moniker range="microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
## Related content

* [mv-apply](mv-apply-operator.md) operator.
* For the opposite of the mv-expand operator, see [summarize make_list()](make-list-aggregation-function.md).
* For expanding dynamic JSON objects into columns using property bag keys, see [bag_unpack()](bag-unpack-plugin.md) plugin.
::: moniker-end