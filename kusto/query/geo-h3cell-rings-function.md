---
title:  geo_h3cell_rings()
description: Learn how to use the geo_h3cell_rings() function to calculate the H3 cell rings.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 08/11/2024
---
# geo_h3cell_rings()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the H3 cell Rings.

Read more about [H3 Cell](https://eng.uber.com/h3/).

## Syntax

`geo_h3cell_rings(`*h3cell*`,`*distance*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *h3cell* | `string` |  :heavy_check_mark: | An H3 Cell token value as it was calculated by [geo_point_to_h3cell()](geo-point-to-h3cell-function.md).|
| *distance* | `int` |  :heavy_check_mark: | Defines the maximum ring distance from given cell. Valid distance is in range [0, 142].|

## Returns

An ordered array of ring arrays where first ring contains the original cell, second ring contains neighboring cells, and so on. If either the H3 Cell or distance is invalid, the query produces a null result.

> [!NOTE]
>
> * For H3 Cell immediate neighbors only, please see [geo_h3cell_neighbors()](geo-h3cell-neighbors-function.md).
> * A cell might be not present in the ring if pentagonal distortion was encountered.

## Examples

The following example produces rings up to distance 2.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUQAS6cUKtgrpqfnxGcbJqTk58WAhDXULM8M0CwtLkzQIUNdRMNIEAJ04a1w0AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print rings = geo_h3cell_rings('861f8894fffffff', 2)
```

**Output**

|rings|
|---|
|[<br> ["861f8894fffffff"],<br> ["861f88947ffffff","861f8895fffffff","861f88867ffffff","861f8d497ffffff","861f8d4b7ffffff","861f8896fffffff"],<br> ["861f88967ffffff","861f88977ffffff","861f88957ffffff","861f8882fffffff","861f88877ffffff","861f88847ffffff","861f8886fffffff","861f8d49fffffff","861f8d487ffffff","861f8d4a7ffffff","861f8d59fffffff","861f8d597ffffff"]<br> ]|

The following example produces all cells at level 1 (all neighbors).

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUchLzUzPSMovKlawVUhPzY/PME5OzcmJB8qlF2uoW5gZpllYWJqkQYC6joKhZrRhLACfNYVMOwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print neighbors = geo_h3cell_rings('861f8894fffffff', 1)[1]
```

**Output**

|neighbors|
|---|
|["861f88947ffffff", "861f8895fffffff", "861f88867ffffff", "861f8d497ffffff", "861f8d4b7ffffff","861f8896fffffff"]|

The following example produces list of cells from all rings.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUQAS6cUKtgrpqfnxGcbJqTk58WAhDXULM8M0CwtLkzQIUNdRMNTkqlHILdNNLCjIqYTqzM9T4NLgUlAoLs3NTSzKrEpVAJkBMjE3MTs1PiezuEQDrFKTSxMAkXmI93IAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print rings = geo_h3cell_rings('861f8894fffffff', 1)
| mv-apply rings on 
(
  summarize cells = make_list(rings)
)
```

**Output**

|cells|
|---|
|["861f8894fffffff","861f88947ffffff","861f8895fffffff","861f88867ffffff","861f8d497ffffff","861f8d4b7ffffff","861f8896fffffff"]|

The following example assembles GeoJSON geometry collection of all cells.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1VPS07DMBDd5xSjbGpLZVEVobBgVQm4hWXCJKT1T/a0ahCHZ5yYumRhxe/vECdHwMeY4AVG9Opr36MxaoHEpnvaDV33/Dis32YLO9n8gL086BDMXJzeQSMagHS2VsfpG8HqEyozJRKLQjbFhdeg3SdkZq0A8kBzQD+IRBnJwhD9EXuC4M08cvi/ZeRVwUWNya7aXnhlErG3bin4fQUHH9NS8aFHFXR/yg8BaPOodgvtK2o6R/5dYdZbpDgzdTPctG+FPHhjOHzyLqPFMmHi2900WSJ5SsBIK19DnbZL6Pv+z5Sgr8FS/gJRaHlovAEAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print rings = geo_h3cell_rings('861f8894fffffff', 1)
| mv-apply rings on 
(
  summarize make_list(rings)
)
| mv-expand list_rings to typeof(string)
| project polygon = geo_h3cell_to_polygon(list_rings)
| summarize polygon_lst = make_list(polygon)
| project geojson = bag_pack(
    "type", "Feature",
    "geometry", bag_pack("type", "GeometryCollection", "geometries", polygon_lst),
    "properties", bag_pack("name", "H3 polygons collection"))
```

**Output**

|geojson|
|---|
|{ "type": "Feature", "geometry": { "type": "GeometryCollection", "geometries": [ ... ... ... ]}, "properties": { "name": "H3 polygons collection" }}|

The following example returns true because of the invalid cell.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgsjs8rzclRsAWyQAyN9NT8+Azj5NScnHiggvRiDfXEpGR1HQVjTU0AZygYaTIAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print is_null = isnull(geo_h3cell_rings('abc', 3))
```

**Output**

|is_null|
|---|
|1|

The following example returns true because of the invalid distance.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgsjs8rzclRsAWyQAyN9NT8+Azj5NScnHiggvRiDXULM8M0CwtLkzQIUNdRMDQ10NQEAAa/KwhAAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print is_null = isnull(geo_h3cell_rings('861f8894fffffff', 150))
```

**Output**

|is_null|
|---|
|1|
