---
title:  monthofyear()
description: Learn how to use the monthofyear() function to get the integer representation of the month.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2023
---
# monthofyear()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the integer number from 1-12 representing the month number of the given year.

> The `monthofyear()` and `getmonth()` functions are equivalent

## Syntax

`monthofyear(`*date*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark: | The date for which to find the month number. |

## Returns

An integer from 1-12 representing the month number of the given year.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNzc8rychPq0xNLNJISSxJLcnMTdVQMjIwNNU1NNI1NFHS1AQAVHohRTAAAAA=" target="_blank">Run the query</a>
:::moniker-end

```kusto
print result=monthofyear(datetime("2015-12-14"))
```

**Output**

|result|
|--|
|12|
