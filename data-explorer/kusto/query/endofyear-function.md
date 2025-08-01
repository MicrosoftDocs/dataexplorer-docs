---
title:  endofyear()
description: Learn how to use the endofyear() function to return a datetime representing the end of the year for the given date value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# endofyear()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Provides the end of the year containing the date, shifted by an offset, if provided.

## Syntax

`endofyear(`*date* [, *offset*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark:| The date used to find the end of the year. |
| *offset* | `int` | | The number of offset years from *date*. Default is 0. |

## Returns

Returns a datetime representing the end of the year for the given *date* value, with the &*offset*, if specified.

## Examples

The following example returns the end of the year for the specified date.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy3MMQqAMAxG4d1T/GMLFhoXQXD0IMUmomAjNYvg4VUQvuUtr6ayMFTkZINU3REIpiCcxgeowY2j6saz4eJUp5IxgktW+dLlZGzrzq6L1IdIL1AcPr1v/7F/AESu49RmAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
  range offset from -1 to 1 step 1
 | project yearEnd = endofyear(datetime(2017-01-01 10:10:17), offset) 
```

**Output**

|yearEnd|
|---|
|2016-12-31 23:59:59.9999999|
|2017-12-31 23:59:59.9999999|
|2018-12-31 23:59:59.9999999|

## Related content

* [startofyear function](./startofyear-function.md)
* [endofday function](./endofday-function.md)
* [endofweek function](./endofweek-function.md)
* [endofmonth function](./endofmonth-function.md)