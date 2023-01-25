---
title: row_rank_min() - Azure Data Explorer
description: Learn how to use the row_rank_min() function to return the current row's minimal rank in a serialized row set.
ms.reviewer: royo
ms.topic: reference
ms.date: 01/18/2023
---
# row_rank_min()

Returns the current row's minimal rank in a [serialized row set](./windowsfunctions.md#serialized-row-set).

The rank is the minimal row number that the current row's *Term* appears in.

## Syntax

`row_rank_min` `(` *Term* `)`

* *Term* is an expression indicating the value to consider for the rank. The rank is the minimal row number for *Term*.
  
## Returns

Returns the row rank of the current row as a value of type `long`.

## Example

This example shows how to rank the `Airline` by the number of departures from the SEA `Airport`:

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

Running this query produces the following result:

Airport  | Airline  | Departures  | Rank
---------|----------|-------------|------
SEA      | BA       | 2           | 1
SEA      | LH       | 3           | 2
SEA      | UA       | 3           | 2
SEA      | EL       | 3           | 2
SEA      | LY       | 100         | 5
