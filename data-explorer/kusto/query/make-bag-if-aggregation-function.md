---
title:  make_bag_if() (aggregation function)
description: Learn how to use the make_bag_if() function to create a dynamic JSON property bag of expression values where the predicate evaluates to true.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# make_bag_if() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a `dynamic` JSON property bag (dictionary) of *expr* values in records for which *predicate* evaluates to `true`.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`make_bag_if(`*expr*`,` *predicate* [`,` *maxSize*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `dynamic` |  :heavy_check_mark: | The expression used for the aggregation calculation. |
| *predicate* | `bool` |  :heavy_check_mark: | The predicate that evaluates to `true`, in order for *expr* to be added to the result. |
| *maxSize* | `int` |  | The limit on the maximum number of elements returned. The default and max value is 1048576. |

## Returns

Returns a `dynamic` JSON property bag (dictionary) of *expr* values in records for which *predicate* evaluates to `true`. Nondictionary values are skipped.
If a key appears in more than one row, an arbitrary value, out of the possible values for this key, are selected.

> [!NOTE]
> This function without the predicate is similar to [`make_bag`](make-bag-aggregation-function.md).

## Example

The following example shows a packed JSON property bag.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOywqDQAxF9/MVwZXCLPrYWfwLd0Uko1EGRx1mYimlH99YtNhkc8O5geOIoYQCWmRZ4yj1YfZ55GCnXsMD3UK/ywdqbYNMuZlnl6m7Aplk/TidEw2J1GuUwGEhfYCXHRoJHbr4R687bbZXVd1Uqd5AT6apBS9+BvvaYzN89TavTCpxGUcM9kUgZlyMOFC9dm2X+oNw9gEXEDu16AAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let T = datatable(prop:string, value:string, predicate:bool)
[
    "prop01", "val_a", true,
    "prop02", "val_b", false,
    "prop03", "val_c", true
];
T
| extend p = bag_pack(prop, value)
| summarize dict=make_bag_if(p, predicate)
```

**Output**

|dict|
|----|
|{ "prop01": "val_a", "prop03": "val_c" } |

Use [bag_unpack()](bag-unpack-plugin.md) plugin for transforming the bag keys in the make_bag_if() output into columns.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOzQqDMBCE73mKxZNCDv25WXwLb6XIxqwSjBpiUkrpw3cjWuzuZZb5ZhlLAWqoQGPgVZZy52dXLsGbqZfwRBvpdzlP2rQYqFTzbAtxF8CTpcTpnEnIGG+QRfCR5MG87KZi0aFd/tzr7rZbVDxuohYfoFegSYPjfgr7xmE7rPW2XgUjSxxH9OZNiahGHKhJqOlyd+ibSEoZ1uurOK3PWBZfye97QAIBAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let T = datatable(prop:string, value:string, predicate:bool)
[
    "prop01", "val_a", true,
    "prop02", "val_b", false,
    "prop03", "val_c", true
];
T
| extend p = bag_pack(prop, value)
| summarize bag=make_bag_if(p, predicate)
| evaluate bag_unpack(bag)
```

**Output**

|prop01|prop03|
|---|---|
|val_a|val_c|

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [make_bag() (aggregation function)](make-bag-aggregation-function.md)
* [bag_unpack()](bag-unpack-plugin.md)
* [bag_pack()](pack-function.md)
* [make_list_if() (aggregation function)](make-list-if-aggregation-function.md)
* [parse_json()](parse-json-function.md)