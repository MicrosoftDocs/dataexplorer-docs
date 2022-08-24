---
title: binary_all_and() (aggregation function) - Azure Data Explorer
description: This article describes binary_all_and() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/24/2020
---
# binary_all_and() (aggregation function)

Accumulates values using the binary `AND` operation for each summarization group, or in total if a group is not specified.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`binary_all_and` `(`*Expr*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | long | &check; | A long number used for the binary `AND`  calculation. |

## Returns

Returns an aggregated value using the binary `AND` operation over records for each summarization group, or in total if a group is not specified.

## Examples

This example produces 'cafe-food' using binary `AND` operations:

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA0tJLAHCpJxUjbzSXKuc/Lx0TV6uaF4uBQWDCjco0FFA4hsYuOlAuM4QWRco183RzRWsmpcrlperRqG4NDc3sSizKlWhKLW4NKdEwVahJL+0oCC1SKMkPyO1QiMpMy+xqDI+MScnPjEvBWS/pqYmAPUkYL2QAAAA)**\]**

```kusto
datatable(num:long)
[
  0xFFFFFFFF, 
  0xFFFFF00F,
  0xCFFFFFFD,
  0xFAFEFFFF,
]
| summarize result = toupper(tohex(binary_all_and(num)))
```

**Results**

|---|
|CAFEF00D|
