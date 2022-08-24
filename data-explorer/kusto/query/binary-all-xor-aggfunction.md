---
title: binary_all_xor() (aggregation function) - Azure Data Explorer
description: This article describes binary_all_xor() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/24/2022
---
# binary_all_xor() (aggregation function)

Accumulates values using the binary `XOR` operation for each summarization group, or in total if a group is not specified.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

## Syntax

`binary_all_xor` `(`*Expr*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | long | &check; | A long number used for the binary `AND`  calculation. |

## Returns

Returns a value that is aggregated using the binary `XOR` operation over records for each summarization group, or in total if a group is not specified.

## Examples

This example produces 'cafe-food' using binary `XOR` operations:

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA0tJLAHCpJxUjbzSXKuc/Lx0TV6uaF4uBQWDChMTEwMQ1oFwDV0hEMq1NHB0cnI0sIRyDQwMnAwNTB2B3FherhqF4tLc3MSizKpUhaLU4tKcEgVbhZL80oKC1CKNkvyM1AqNpMy8xKLK+MScnPiK/CKQ9ZqamgCFqvREjwAAAA==)**\]**

```kusto
datatable(num:long)
[
  0x44404440,
  0x1E1E1E1E,
  0x90ABBA09,
  0x000B105A,
]
| summarize result = toupper(tohex(binary_all_xor(num)))
```

**Results**

|results|
|--|
|CAFEF00D|
