---
title:  endofday()
description: Learn how to use the endofday() function to return a datetime representing the end of the day for the given date value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# endofday()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Provides the end of the day containing the date, shifted by an offset, if provided.

## Syntax

`endofday(`*date* [, *offset*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark:| The date to find the end of. |
| *offset* | `int` | | The number of offset days from *date*. Default is 0. |

## Returns

Returns a datetime representing the end of the day for the given *date* value, with the *offset*, if specified.

## Examples

The following example returns the end of the day for the specified date.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy3MMQqAMAxG4d1T/GMLCo2LIDh6kGITUbCRmkXw8FYQvuUtr8S8MlTkYoMUPdARTEG4jE9Qgwdn0Z0XQ4r3nBMmcE4qtVyKxrYd7PpAQxeoAoXxM/j23/oXglVNRWQAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
  range offset from -1 to 1 step 1
 | project dayEnd = endofday(datetime(2017-01-01 10:10:17), offset) 
```

**Output**

|dayEnd|
|---|
|2016-12-31 23:59:59.9999999|
|2017-01-01 23:59:59.9999999|
|2017-01-02 23:59:59.9999999|
