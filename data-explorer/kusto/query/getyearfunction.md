---
title: getyear() - Azure Data Explorer
description: This article describes getyear() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# getyear()

Returns the year part of the `datetime` argument.

## Syntax

`getyear(`*date*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | datetime | &check; | The date for which to get the year. |

## Returns

The  year that contains the given *date*.

## Example

```kusto
T
| extend year = getyear(datetime(2015-10-12))
// year == 2015
```