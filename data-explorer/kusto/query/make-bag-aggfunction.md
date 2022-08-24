---
title: make_bag() (aggregation function) - Azure Data Explorer
description: This article describes the make_bag() aggregation function in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/24/2022
---
# make_bag() (aggregation function)

Creates a `dynamic` JSON property-bag (dictionary) of all the values of *`Expr`* in the group.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

 `make_bag` `(`*Expr* [`,` *MaxSize*]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | dynamic | &check; | Expression used for aggregation calculations. |
| *MaxSize* | integer |  | The limit on the maximum number of elements returned. The default is *1048576* and can't exceed *1048576*. |

> [!NOTE]
> `make_dictionary()` has been deprecated in favor of `make_bag()`. The legacy version has a default *MaxSize* limit of 128.

## Returns

Returns a `dynamic` JSON property-bag (dictionary) of all the values of *`Expr`* in the group, which are property-bags.
Non-dictionary values will be skipped.
If a key appears in more than one row, an arbitrary value, out of the possible values for this key, will be selected.

## Examples

This example shows a packed JSON property-bag.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA8tJLVEIUbBVSEksAcKknFSNgqL8AqvikqLMvHQdhbLEnNJUKE+Tlyual0sBCJRAagwMlXQUlIAK4hOVdJDFjWDiSajixjDxZJB4rDUvVwgvV41CakVJal6KQgHQEQWJydlg+6EWa4Lki0tzcxOLMqtSFVIyk0tscxOzU+OTEtM1CjQBmc4RQ7wAAAA=)**\]**

```kusto
let T = datatable(prop:string, value:string)
[
    "prop01", "val_a",
    "prop02", "val_b",
    "prop03", "val_c",
];
T
| extend p = pack(prop, value)
| summarize dict=make_bag(p)

```

**Results**

|dict|
|----|
|{ "prop01": "val_a", "prop02": "val_b", "prop03": "val_c" } |

Use the [bag_unpack()](bag-unpackplugin.md) plugin for transforming the bag keys in the make_bag() output into columns.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA1WOzwrDIAzG74LvEDxV6GF/bht9i97GkNiGUqpOrI4x9vBTaWFLLsnv+8gXQxF66GDEmFsbanx4+Msaw+ymFp5oEm2b5OzGGeQSxXM4ihZENigU7S8/7Vz/8/POh8LvV856zj5Ar0huBJ+f8DgsNX8LlkVfk7UY5jeBxqmzuJDKQ+OrSMWHsWoquXogj/ILUPGHNdcAAAA=)**\]**

```kusto
let T = datatable(prop:string, value:string)
[
    "prop01", "val_a",
    "prop02", "val_b",
    "prop03", "val_c",
];
T
| extend p = pack(prop, value)
| summarize bag=make_bag(p)
| evaluate bag_unpack(bag) 

```

**Results**

|prop01|prop02|prop03|
|---|---|---|
|val_a|val_b|val_c|

## See also

[bag_unpack()](bag-unpackplugin.md)
