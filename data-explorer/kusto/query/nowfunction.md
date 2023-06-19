---
title:  now()
description: Learn how to use the now() function to return the current UTC time.
ms.reviewer: alexans
ms.topic: reference
ms.date: 06/19/2023
---
# now()

Returns the current UTC time, optionally offset by a given [timespan](scalar-data-types/timespan.md).

The current UTC time will stay the same across all uses of `now()` in a single query statement, even if there's technically a small time difference between when each `now()` runs.

## Syntax

`now(`[ *offset* ]`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *offset* | timespan | | A timespan to add to the current UTC clock time. The default value is 0.|

## Returns

The current UTC clock time, plus the *offset* time if provided, as a `datetime`.

## Example

## Get the time one hour ago

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcjLL9fQVNBVMMwAAE8xOfIQAAAA" target="_blank">Run the query</a>

```kusto
print now() - 1h
```

## Get the time one month ago

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcjLL9fQVNBVMDZIAQDOLKoPEQAAAA==" target="_blank">Run the query</a>

```kusto
print now() - 30d
```

### Find time elapsed from a given event

The following example shows the time elapsed since the start of the storm events.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRSK0oSc1LUXDNSSwoTk2xzcsv19BU0FUILkksKgnJzE0FKilJzE5VMDQAAK5wFN84AAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| extend Elapsed=now() - StartTime
| take 10
```
