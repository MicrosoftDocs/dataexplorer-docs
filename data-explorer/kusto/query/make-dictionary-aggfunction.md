---
title: make_dictionary() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes make_dictionary() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# make_dictionary() (aggregation function)

Returns a `dynamic` (JSON) property-bag (dictionary) of all the values of *Expr* in the group.

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

`summarize` `make_dictionary(`*Expr* [`,` *MaxListSize*]`)`

**Arguments**

* *Expr*: Expression of type `dynamic` that will be used for aggregation calculation.
* *MaxListSize* is an optional integer limit on the maximum number of elements returned (default is *128*).

**Returns**

Returns a `dynamic` (JSON) property-bag (dictionary) of all the values of *Expr* in the group which are property-bags (dictionaries).
Non-dictionary values will be skipped.
If a key appears in more than one row- an arbitrary value (out of the possible values for this key) will be chosen.

**See also**

See [bag_unpack()](bag-unpackplugin.md) plugin for expanding dynamic JSON objects into columns using property bag keys. 

**Examples**

```kusto
let T = datatable(prop:string, value:string)
[
    "prop01", "val_a",
    "prop02", "val_b",
    "prop03", "val_c",
];
T
| extend p = pack(prop, value)
| summarize dict=make_dictionary(p)

```

|dict|
|----|
|{ "prop01": "val_a", "prop02": "val_b", "prop03": "val_c" } |