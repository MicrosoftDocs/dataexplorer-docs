---
title:  binary_all_or() (aggregation function)
description: Learn how to use the binary_all_or() function to aggregate values using the binary OR operation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/20/2022
---
# binary_all_or() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Accumulates values using the binary `OR` operation for each summarization group, or in total if a group is not specified.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`binary_all_or` `(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `long` |  :heavy_check_mark: | The value used for the binary `OR`  calculation. |

## Returns

Returns an aggregated value using the binary `OR` operation over records for each summarization group, or in total if a group is not specified.

## Example

The following example produces `CAFEF00D` using binary `OR` operations:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjbzSXKuc/Lx0Ta5oLgUFgwoLEDAwsNAB80yMDMAAwjMwMDczR+KBgamOAlcsV41CcWlubmJRZlWqQlFqcWlOiYKtQkl+aUFBapFGSX5GaoVGUmZeYlFlfGJOTnx+EcheTU1NAEGLHNSIAAAA" target="_blank">Run the query</a>
:::moniker-end

```kusto
datatable(num:long)
[
  0x88888008,
  0x42000000,
  0x00767000,
  0x00000005, 
]
| summarize result = toupper(tohex(binary_all_or(num)))
```

**Output**

|result|
|---|
|CAFEF00D|
