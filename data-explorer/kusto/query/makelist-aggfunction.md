---
title: make_list() (aggregation function) - Azure Data Explorer
description: This article describes make_list() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/24/2022
adobe-target: true
---
# make_list() (aggregation function)

Creates a `dynamic` JSON array of all the values of *Expr* in the group.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`make_list` `(`*Expr* [`,` *MaxSize*]`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | dynamic | &check; | Expression used for aggregation calculations. |
| *MaxSize* | integer |  | The limit on the maximum number of elements returned. The default is *1048576* and can't exceed *1048576*. |

> [!NOTE]
> `makelist()` has been deprecated in favor of `make_list`. The legacy version has a default *MaxSize* limit of 128.

## Returns

Returns a `dynamic` JSON array of all the values of *Expr* in the group.
If the input to the `summarize` operator is not sorted, the order of elements in the resulting array is undefined.
If the input to the `summarize` operator is sorted, the order of elements in the resulting array tracks that of the input.

> [!TIP]
> Use the [`array_sort_asc()`](./arraysortascfunction.md) or [`array_sort_desc()`](./arraysortdescfunction.md) function to create an ordered list by some key.

## Examples

### One column

The simplest example is to make a list out of a single column:

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA0XPzwrCMAwG8Huh7xB2crCD4v+JJx9DROoWZrFNZ5uBig9v51ZNLuGX7/IZZAhX1WKAPdSK414MwoSUxRICe01NAUHXeHAdcQmaOJfiKAXEyeJfUWMwK2BejBbunfK9LJJ4rDjFftgisWocRVsmu+JjpNWf2hRbJ3MVu4E2icjRmNomqrEaaTaV4rSTYigqxRtCZ63y+oVgn0YHjuWtuuG5v7/d8w9Sjr2JGQEAAA==)**\]**

```kusto
let shapes = datatable (name: string, sideCount: int)
[
    "triangle", 3,
    "square", 4,
    "rectangle", 4,
    "pentagon", 5,
    "hexagon", 6,
    "heptagon", 7,
    "octagon", 8,
    "nonagon", 9,
    "decagon", 10
];
shapes
| summarize mylist = make_list(name)
```

**Results**

|mylist|
|---|
|["triangle","square","rectangle","pentagon","hexagon","heptagon","octagon","nonagon","decagon"]|

### Using the 'by' clause

In the following query, you group using the `by` clause:

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA0XQy2rDMBAF0L1A/3AJFBrwIo82DwevSr6gy1KKYg+OiDVyrHGpSz8+SmMlo81wdDd3GhKEo2kpoEBlJL5DQ3hm4yhHkM5ynSHYit58z5LDsky1+tAKcSbx33Dd0CTDMhstnHvTXeUlSUelpNgdW2Ixtedor8mO9DPS6kFtiq2T+VL8jTaJ2POY2iaqqBxpPtPqc6fVrahWfwi9c6azvwQ3NDZILO/Mib6u+3/3KQ4DbNh/E7+n8jF0PwSesEBRYHYB/AuXlkEBAAA=)**\]**

```kusto
let shapes = datatable (name: string, sideCount: int)
[
    "triangle", 3,
    "square", 4,
    "rectangle", 4,
    "pentagon", 5,
    "hexagon", 6,
    "heptagon", 7,
    "octogon", 8,
    "nonagon", 9,
    "decagon", 10
];
shapes
| summarize mylist = make_list(name) by isEvenSideCount = sideCount % 2 == 0
```

**Results**

|isEvenSideCount| mylist|
|---|---|
|false|["triangle","pentagon","heptagon","nonagon"]|
|true|["square","rectangle","hexagon","octogon","decagon"]|

### Packing a dynamic object

You can [pack](./packfunction.md) a dynamic object in a column before making a list out of it, as seen in the following query:

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA03PTWrDMBAF4L1AdxgMARu8SPrfFK9CT5BlKUWxBkfEGjnWOCSlh++IWGmlhcSnN4LXI0PcmwEjNGANy971CCUZj2uIPDrqaojO4iZMxGtwxJVWH1qBrELeDXU9FjXc17PF42TGJA9ZRmw5x244ILHpAok9ZtvjeaanPxpy7DlbaDlc6SUTBZpTr5kstjOtllp9vml1LarVD+CZkSxYKT2Y9lAWqa8k01FLhdy3+Ne9SoNx8t6M7hvBX3oXWT7w5oBf6V7aCnYXcPH9hLTNY5K4fQELuIOmgeUvfjeowHcBAAA=)**\]**

```kusto
let shapes = datatable (name: string, sideCount: int)
[
    "triangle", 3,
    "square", 4,
    "rectangle", 4,
    "pentagon", 5,
    "hexagon", 6,
    "heptagon", 7,
    "octogon", 8,
    "nonagon", 9,
    "decagon", 10
];
shapes
| extend d = pack("name", name, "sideCount", sideCount)
| summarize mylist = make_list(d) by isEvenSideCount = sideCount % 2 == 0
```

**Results**

|mylist|isEvenSideCount|
|---|---|
|false|[{"name":"triangle","sideCount":3},{"name":"pentagon","sideCount":5},{"name":"heptagon","sideCount":7},{"name":"nonagon","sideCount":9}]|
|true|[{"name":"square","sideCount":4},{"name":"rectangle","sideCount":4},{"name":"hexagon","sideCount":6},{"name":"octogon","sideCount":8},{"name":"decagon","sideCount":10}]|

## See also

[`make_list_if`](./makelistif-aggfunction.md) operator is similar to `make_list`, except it also accepts a predicate.
