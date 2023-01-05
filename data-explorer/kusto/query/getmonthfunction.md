---
title: getmonth() - Azure Data Explorer
description: This article describes getmonth() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/18/2022
---
# getmonth()

Get the month number from a datetime.

Another alias: monthofyear()

## Syntax

`getmonth(`*date*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | datetime | &check; | The date for which to get the month. |

## Returns

An integer between 1-12 representing the month that contains the given *date*.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcjNzyvJULBVSE8tATM1UhJLUksyc1M1jAwMTXUNDXQNjTQ1AZjqpgwsAAAA" target="_blank">Run the query</a>

```kusto
print month = getmonth(datetime(2015-10-12))
```

|month|
|--|
|10|
