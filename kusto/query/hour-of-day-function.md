---
title:  hourofday()
description: Learn how to use the hourofday() function to return an integer representing the hour of the given date.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/28/2022
---
# hourofday()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the integer number representing the hour number of the given date.

## Syntax

`hourofday(`*date*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*date*| `datetime` | :heavy_check_mark:|The date for which to return the hour number.|

## Returns

An integer between 0-23 representing the hour number of the day for *date*.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcjILy2yBRH5aSmJlRopiSWpJZm5qRpGBoamuoZGuoYmCoYWVqYmmpoAPkfViTAAAAA=" target="_blank">Run the query</a>

```kusto
print hour=hourofday(datetime(2015-12-14 18:54))
```

|hour|
|--|
|18|
