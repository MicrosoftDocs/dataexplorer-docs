---
title:  row_rank_min()
description: Learn how to use the row_rank_min() function to return the current row's minimal rank in a serialized row set.
ms.reviewer: royo
ms.topic: reference
ms.date: 08/11/2024
---
# row_rank_min()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the current row's minimal rank in a [serialized row set](window-functions.md#serialized-row-set).

The rank is the minimal row number that the current row's *Term* appears in.

## Syntax

`row_rank_min` `(` *Term* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*Term*| `string` | :heavy_check_mark:|An expression indicating the value to consider for the rank. The rank is the minimal row number for *Term*.|
| *restart*| `bool` | | Indicates when the numbering is to be restarted to the *StartingIndex* value. The default is `false`.|
  
## Returns

Returns the row rank of the current row as a value of type `long`.

## Example

The following query shows how to rank the `Airline` by the number of departures from the SEA `Airport`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUBQ3HzKKC/KISq+KSosy8dB0FID8nMy8VzndJLUgsKiktSi22ysnPS9fk5Yrm5VJQUAp2dVTSUVDy8QCSxjooQpFA0tDAAEUw1BFDnROINEIRcvUBqeLliuXlqlEoBjpLIakSyQUKicXJIJnUipLUvBSFoMS8bNui/PL4IiAjPjczTwOhVBMA9lGyTeMAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (Airport:string, Airline:string, Departures:long)
[
  "SEA", "LH", 3,
  "SEA", "LY", 100,
  "SEA", "UA", 3,
  "SEA", "BA", 2,
  "SEA", "EL", 3
]
| sort by Departures asc
| extend Rank=row_rank_min(Departures)
```

**Output**

Airport  | Airline  | Departures  | Rank
---------|----------|-------------|------
SEA      | BA       | 2           | 1
SEA      | LH       | 3           | 2
SEA      | UA       | 3           | 2
SEA      | EL       | 3           | 2
SEA      | LY       | 100         | 5
