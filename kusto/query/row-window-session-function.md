---
title:  row_window_session()
description: Learn how to use the row_window_session() function to calculate session start values of a column in a serialized row set.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# row_window_session()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates session start values of a column in a [serialized row set](window-functions.md#serialized-row-set).

## Syntax

`row_window_session` `(` *Expr* `,` *MaxDistanceFromFirst* `,` *MaxDistanceBetweenNeighbors* [`,` *Restart*] `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*Expr* | `datetime` | :heavy_check_mark: | An expression whose values are grouped together in sessions. When *Expr* results in a null value, the next value starts a new session. |
|*MaxDistanceFromFirst* | `timespan` | :heavy_check_mark: | Determines when a new session starts using the maximum distance between the current *Expr* value and its value at the beginning of the session. |
|*MaxDistanceBetweenNeighbors*| `timespan` | :heavy_check_mark: | Another criterion for starting a new session using the maximum distance from one value of *Expr* to the next. |
| *Restart* |`boolean` | | If specified, every value that evaluates to `true` immediately restarts the session. |

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

The function returns the values at the beginning of each session. It uses the following conceptual calculation model:

1. Iterates over the input sequence of *Expr* values in order.

1. For each value, it decides whether to create a new session.

1. If a new session is created, the function returns the current value of *Expr*. Otherwise, it returns the previous value of *Expr*.

>[!NOTE]
>The value represents a new session if it meets the following conditions using the logical OR operation:
>
>* If there was no previous session value, or the previous session value was null.
>* If the value of *Expr* equals or exceeds the previous session value plus
  *MaxDistanceFromFirst*.
>* If the value of *Expr* equals or exceeds the previous value of *Expr*
  plus *MaxDistanceBetweenNeighbors*.
>* If *`Restart`* condition is specified and evaluates to `true`.

## Examples

The following example calculates session start values for a table, `datatable`, with a sequence **ID** column and a **Timestamp** column to record the time of each record. The data is sorted by the sequence IDs and timestamps and then the example returns values for **ID**, **Timestamp**, and a new **SessionStarted** column. A session can't exceed one hour. It continues for as long as records are less than five minutes apart and the ID stays the same. The example includes records that are less than five minutes apart.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc-z5jd0tu7q3s9b5vyt8.northeurope/databases/TestDatabase?query=H4sIAAAAAAAAA42QwQqDMAyG7z5F5kmhQqtuDMGbF8%2FuNsaoa9kKs0ob5gZ7%2BLXIhjsIJoGQ5sufEsHReXuXENVVYdEofSVwUJ20yLuhEBwluiqGYwDOQhYS%2BD5GKU3zhOYJY8BoQX3EZOLSZY7tZ9yiHvvXy5a5bNXebCXn%2FrfzXHAK3mB7g9C%2BoK6A28vsML50fflEqQU00lrV6wa5QSmgBNOP51Fp4ZKdetFvlAC7Edh2xKtuShiMfLjjx%2FEHCP%2BU4YwBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (ID:string, Timestamp:datetime) [
    "1", datetime(2024-04-11 10:00:00),
    "2", datetime(2024-04-11 10:18:00),
    "1", datetime(2024-04-11 11:00:00),
    "3", datetime(2024-04-11 11:30:00),
    "2", datetime(2024-04-11 13:30:00),
    "2", datetime(2024-04-11 10:16:00)
]
| sort by ID asc, Timestamp asc
| extend SessionStarted = row_window_session(Timestamp, 1h, 5m, ID != prev(ID))
```

**Output**

|ID |Timestamp |SessionStarted |
|---------|---------|---------|
|1 | 2024-04-11T10:00:00Z | 2024-04-11T10:00:00Z|
|1 | 2024-04-11T11:00:00Z | 2024-04-11T11:00:00Z|
|2 | 2024-04-11T10:16:00Z| 2024-04-11T10:16:00Z|
|2 | 2024-04-11T10:18:00Z| 2024-04-11T10:16:00Z|
|2 | 2024-04-11T13:30:00Z| 2024-04-11T13:30:00Z|
|3 | 2024-04-11T11:30:00Z| 2024-04-11T11:30:00Z|

## Related content

* [scan operator](scan-operator.md)
