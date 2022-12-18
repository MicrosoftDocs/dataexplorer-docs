---
title: getmonth() - Azure Data Explorer
description: This article describes getmonth() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/22/2020
---
# getmonth()

Get the month number (1-12) from a datetime.

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

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print month = getmonth(datetime(2015-10-12))
```
