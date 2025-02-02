---
title:  Joining within time window
description: Learn how to perform a time window join operation to match between two large datasets.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/28/2025
---
# Time window join

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

It's often useful to join between two large datasets on some high-cardinality key, such as an operation ID or a session ID, and further limit the right-hand-side ($right) records that need to match up with each left-hand-side ($left) record by adding a restriction on the "time-distance" between `datetime` columns on the left and on the right.

The above operation differs from the usual join operation, since for the `equi-join` part of matching the high-cardinality key between the left and right datasets, the system can also apply a distance function and use it to considerably speed up the join.

> [!NOTE]
> A distance function doesn't behave like equality (that is, when both dist(x,y) and dist(y,z) are true it doesn't follow that dist(x,z) is also true.) This is sometimes referred to as a "diagonal join".

## Example to identify event sequences without time window

To identify event sequences within a relatively small time window, this example uses a table `T` with the following schema:

* `SessionId`: A column of type `string` with correlation IDs.
* `EventType`: A column of type `string` that identifies the event type of the record.
* `Timestamp`: A column of type `datetime` indicates when the event described by the record happened.

| SessionId | EventType | Timestamp |
|--|--|--|
| 0 | A | 2017-10-01T00:00:00Z |
| 0 | B | 2017-10-01T00:01:00Z |
| 1 | B | 2017-10-01T00:02:00Z |
| 1 | A | 2017-10-01T00:03:00Z |
| 3 | A | 2017-10-01T00:04:00Z |
| 3 | B | 2017-10-01T00:10:00Z |

The following query creates the dataset and then identifies all the session IDs in which event type `A` was followed by an event type `B` within a `1min` time window.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4WQTWvDMAyG74H8B91iQ1LsdjDI8GGFHnZubmOHdBGdu8YJjlgZ7MdPbsgHtKS2sbD12O8rnZGgAANVSTwPZxR77DrbuLcq78hbd0xh94OOit8Wx5vC1thRWbc5v0Pik4yj9zgCHolKUkheeRtyYq30c6ZVpjQolV+XTOf0doHWc1o/otc39JKTzZzePKKfbugFJ3qo8uMljgqIoz+4fKHHqZtgTNALmdY3J/wkGHufwp5KT2ZsdKBOjXXwbV1lrHPoeyOiD0EhxPsq22TI3lHa8YczncBJaNyETN4Fs5D13iQckC6IDoSq2dhqBZqjXKrnKvYPNlcRxHMCAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let T = datatable(SessionId:string, EventType:string, Timestamp:datetime)
[
    '0', 'A', datetime(2017-10-01 00:00:00),
    '0', 'B', datetime(2017-10-01 00:01:00),
    '1', 'B', datetime(2017-10-01 00:02:00),
    '1', 'A', datetime(2017-10-01 00:03:00),
    '3', 'A', datetime(2017-10-01 00:04:00),
    '3', 'B', datetime(2017-10-01 00:10:00),
];
T
| where EventType == 'A'
| project SessionId, Start=Timestamp
| join kind=inner
    (
    T 
    | where EventType == 'B'
    | project SessionId, End=Timestamp
    ) on SessionId
| where (End - Start) between (0min .. 1min)
| project SessionId, Start, End 
```

**Output**

| SessionId | Start | End |
|--|--|--|
| 0 | 2017-10-01 00:00:00.0000000 | 2017-10-01 00:01:00.0000000 |

## Example optimized with time window

To optimize this query, we can rewrite it to account for the time window. THe time window is expressed as a join key. Rewrite the query so that the `datetime` values are "discretized" into buckets whose size is half the size of the time window. Use *`equi-join`* to compare the bucket IDs.

The query finds pairs of events within the same session (*SessionId*) where an 'A' event is followed by a 'B' event within 1 minute. It projects the session ID, the start time of the 'A' event, and the end time of the 'B' event.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4VUTW/iMBC9I+U/zC2JRCChK61ElUOReljtsUh7WO3BkAm4TWzXdpoi7Y/fcUI+KFkwiIDnjefNex4KtLCFFDJm6bUrMHhBY7gUP7K1sZqLwxyeP1DY7Ulhv7PlJRrLSrWmPLT0K/Rmv70Z0PJjfw7+E310sWAVJ9+jJI7iBOJ43bzD+Ri9uYFOxujkHnp1hb7F5GGMfriH/naFvsEk6br88+jNClK5kPKtUr+4yGRNgiclFxeRDRe0fYFawmoRP8Jyed6GXYPB94oVYCUkyxXIHOwRO0DdJHqzLXizv1AfUeNgH6Spa9BFlJavuLfQmz2HF8u0TXtnz322ixi4wE88gRRtPcwtGJ5hR+BVEjduoGRKYebYMci42Wu0CE4fYJ8UzqUe4KrSShocV+rKpK7XYGAziBQ6/k36GzWbciFQtycE7cP17p7T/W/8LjqhwTMdOK3AtAqaH44TMkSAZVXQvTCArrirCk4X5sYHDG1q56CrNFGEGeA5cAs1ffM1qoLv6bDM/4odxNJMHDC4kCwaX6Wxfld9fV3/Vf5u5tikczN++RHhp2Ii88ESTdPq4rTq6DOt2altAbhobs5eFlUpOqf6I/oUAllyVObB6A/IgUNnzcjRLmEYh4BMJoea6x7CDm2NKCCIaR5hsbgYwPDWqDS35R/DePBWPwUAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let T = datatable(SessionId:string, EventType:string, Timestamp:datetime)
[
    '0', 'A', datetime(2017-10-01 00:00:00),
    '0', 'B', datetime(2017-10-01 00:01:00),
    '1', 'B', datetime(2017-10-01 00:02:00),
    '1', 'A', datetime(2017-10-01 00:03:00),
    '3', 'A', datetime(2017-10-01 00:04:00),
    '3', 'B', datetime(2017-10-01 00:10:00),
];
let lookupWindow = 1min;
let lookupBin = lookupWindow / 2.0;
T 
| where EventType == 'A'
| project SessionId, Start=Timestamp, TimeKey = bin(Timestamp, lookupBin)
| join kind=inner
    (
    T 
    | where EventType == 'B'
    | project SessionId, End=Timestamp,
              TimeKey = range(bin(Timestamp-lookupWindow, lookupBin),
                              bin(Timestamp, lookupBin),
                              lookupBin)
    | mv-expand TimeKey to typeof(datetime)
    ) on SessionId, TimeKey 
| where (End - Start) between (0min .. lookupWindow)
| project SessionId, Start, End 
```

**Output**

| SessionId | Start | End |
|--|--|--|
| 0 | 2017-10-01 00:00:00.0000000 | 2017-10-01 00:01:00.0000000 |

## 5 million data query

The next query emulates an extensive dataset of 5M records and approximately 1M Session IDs and runs the query with the time window technique.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA31STW/CMAy9I/EfrF5ItpY1TNMOWw8wcZh2pNLOhZotQJOqDVCk/fi5zUrDx7AiJbJfbL9nb9BADBEUifpCqGBZ6AwEGA1PYWNQGsxB9Hs/gJVBlcIMy1Jq9Z7abykTFsl9mO5QmfiQYxt6JGcsM4zSxKChBxuF4jkIBR1+zyq4AxFmJXfSuzkWSYmsc7yC8MEbe36/B/+aCx8RfHIb7r15/KXf25AOG63X2/xTqlTvqbjIpDqJTKQi9wnqAUbDkEAx1Az231igSyCCwXhQR/JCr3BhOu18mJmkMFEtjpXoAw+UfS4Vs75jzUaclabiayoaSaWwsIyYveri9X29gcmgjV5pYkoJbblzjbqWmtVgbWOBy9/t8jLFuV3jdnM2tbkyWBrZLsAqp+069kjbaoiuXrJ2zf7AHLRy6bYfumExUgACOwwOczR7RAUspNnDcHgybH5rkI2UTd6F3irzCxRCBCtXAwAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let T = range x from 1 to 5000000 step 1
| extend SessionId = rand(1000000), EventType = rand(3), Time=datetime(2017-01-01)+(x * 10ms)
| extend EventType = case(EventType < 1, "A",
                          EventType < 2, "B",
                          "C");
let lookupWindow = 1min;
let lookupBin = lookupWindow / 2.0;
T 
| where EventType == 'A'
| project SessionId, Start=Time, TimeKey = bin(Time, lookupBin)
| join kind=inner
    (
    T 
    | where EventType == 'B'
    | project SessionId, End=Time, 
              TimeKey = range(bin(Time-lookupWindow, lookupBin), 
                              bin(Time, lookupBin),
                              lookupBin)
    | mv-expand TimeKey to typeof(datetime)
    ) on SessionId, TimeKey 
| where (End - Start) between (0min .. lookupWindow)
| project SessionId, Start, End 
| count 
```

**Output**

| Count |
|--|
| 3344 |

## Related content

* [join operator](join-operator.md)
