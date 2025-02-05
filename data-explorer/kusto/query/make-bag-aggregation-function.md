---
title:  make_bag() (aggregation function)
description: Learn how to use the make_bag() aggregation function to create a dynamic JSON property bag.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/15/2025
---
# make_bag() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a `dynamic` JSON property bag (dictionary) of all the values of *expr* in the group.

[!INCLUDE [ignore-nulls](../includes/ignore-nulls.md)]

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

 `make_bag` `(`*expr* [`,` *maxSize*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `dynamic` |  :heavy_check_mark: | The expression used for the aggregation calculation. |
| *maxSize* | `int` |  | The limit on the maximum number of elements returned. The default and max value is 1048576. |

> [!NOTE]
> `make_dictionary()` has been deprecated in favor of `make_bag()`. The legacy version has a default *maxSize* limit of 128.

## Returns

Returns a `dynamic` JSON property bag (dictionary) of all the values of *Expr* in the group, which are property bags. Nondictionary values are skipped.
If a key appears in more than one row, an arbitrary value, out of the possible values for this key, is selected.

## Example

The following example shows a packed JSON property bag.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNzQrDIAyA7z5F8FTBw35uG32L3saQqKFItRNrxyh9+GWjhS055csHX6QKHbTgsfLaSE0uj3yZagljr+GJcabtUuImgEd+jMNRapD8Nij1Dz7t2P7h844d4/tVdGIFelUaPWSuW+xNRjd841tVsTLNKWEJC4EPrrYJBzLsNlm9AS6AdnS4AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let T = datatable(prop:string, value:string)
[
    "prop01", "val_a",
    "prop02", "val_b",
    "prop03", "val_c",
];
T
| extend p = bag_pack(prop, value)
| summarize dict=make_bag(p)
```

**Output**

|dict|
|----|
|{ "prop01": "val_a", "prop02": "val_b", "prop03": "val_c" } |

Use the [bag_unpack()](bag-unpack-plugin.md) plugin for transforming the bag keys in the make_bag() output into columns.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WNvQrDMAyEdz+F8BSDh/5sLXmLbKUYOREhxHZNYpdS+vCVTQKttJy+O3GOEnTQwoCJ1zpq4vKIlzUtUxg1PNFl2i4lbgJ4ZEkcjlKDZNug1D/4tGP7h8877hnfr6ITH6BXojBA5HaLo4nYz7V8a1UcWbP3uExvKonW40yGRROLRyWFqVomh/rOUn0B38wbbdIAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let T = datatable(prop:string, value:string)
[
    "prop01", "val_a",
    "prop02", "val_b",
    "prop03", "val_c",
];
T
| extend p = bag_pack(prop, value)
| summarize bag=make_bag(p)
| evaluate bag_unpack(bag)
```

**Output**

|prop01|prop02|prop03|
|---|---|---|
|val_a|val_b|val_c|

## Related content

* [Aggregation function types at a glance](aggregation-functions.md)
* [make_bag_if() (aggregation function)](make-bag-if-aggregation-function.md)
* [bag_unpack()](bag-unpack-plugin.md)
* [bag_pack()](pack-function.md)
* [make_list() (aggregation function)](make-list-aggregation-function.md)
* [parse_json()](parse-json-function.md)
