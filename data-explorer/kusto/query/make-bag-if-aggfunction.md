---
title: make_bag_if() (aggregation function) - Azure Data Explorer
description: This article describes make_bag_if() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/24/2022
---
# make_bag_if() (aggregation function)

Creates a `dynamic` JSON property-bag (dictionary) of all the values of *'Expr'* in the group, for which *Predicate* evaluates to `true`.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`make_bag_if` `(`*Expr*`,` *Predicate* [`,` *MaxSize*]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | dynamic | &check; | Expression used for aggregation calculation. |
| *Predicate* | boolean | &check; | Predicate that evaluates to `true`, in order for *'Expr'* to be added to the result. |
| *MaxSize* | integer |  | Limit on the maximum number of elements returned. The default value is *1048576* and can't exceed 1048576. |

## Returns

Returns a `dynamic` JSON property-bag (dictionary) of all the values of *'Expr'* in the group that are property-bags (dictionaries), for which *Predicate* evaluates to `true`.
Non-dictionary values will be skipped.
If a key appears in more than one row, an arbitrary value, out of the possible values for this key, will be selected.

> [!NOTE]
> This function without the predicate is similar to [`make_bag`](./make-bag-aggfunction.md).

## Examples

This example shows a packed JSON property-bag.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA1WOywqDQAxF9wPzD8GVgos+dhb/wp0UyWiUwVGHMZZS+vGNRYtNNvdyuHAcMRSQQ4MsbxzFPkw+mznYsUvhgW6hX/OBGlsjU2amySValVqBXLRuTucohUgGFUrgsFB6pJedGgktuvkfX3dcb2Ot7jetCq3eQE+msQEvmh7r/mu4qSUrn5dhwGBfBGLH+YA9VQa7yraxP0gnH3QnzZ3sAAAA)**\]**

```kusto
let T = datatable(prop:string, value:string, predicate:bool)
[
    "prop01", "val_a", true,
    "prop02", "val_b", false,
    "prop03", "val_c", true
];
T
| extend p = pack(prop, value)
| summarize dict=make_bag_if(p, predicate)

```

**Results**

|dict|
|----|
|{ "prop01": "val_a", "prop03": "val_c" } |

Use [bag_unpack()](bag-unpackplugin.md) plugin for transforming the bag keys in the make_bag_if() output into columns.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA1WOzQqDMBCE74G8w+JJwUN/bhbfwlspYaOriFFDTEopffhuRIvdvczw7SxjyEMFJTToebWh1LrZFot3/dTl8EQT6Oeso6av0VOh59lkUtylAJ4kZk7nJIeEAwpZeBcoP9LLTjWLFs3yj687rrewFI+bFJUUH6CXp6kByzUt1sPacKuWRb6EcUTXvwk0duWIAykWqm9Te+i8nlJMsYmXKkzrO5bZF6rqf10HAQAA)**\]**

```kusto
let T = datatable(prop:string, value:string, predicate:bool)
[
    "prop01", "val_a", true,
    "prop02", "val_b", false,
    "prop03", "val_c", true
];
T
| extend p = pack(prop, value)
| summarize bag=make_bag_if(p, predicate)
| evaluate bag_unpack(bag)

```

**Results**

|prop01|prop03|
|---|---|
|val_a|val_c|
