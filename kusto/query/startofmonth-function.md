---
title:  startofmonth()
description: Learn how to use the startofmonth() function to return the start of the month for the given date.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# startofmonth()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the start of the month containing the date, shifted by an offset, if provided.

## Syntax

`startofmonth(`*date* [`,` *offset* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark: | The date for which to find the start of month.|
| *offset* | `int` | | The number of months to offset from the input date. The default is 0.|

## Returns

A datetime representing the start of the month for the given *date* value, with the offset, if specified.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy2MSQqAMBAE776ijwoKGS+C4Ct8QdCJC8SR2EcfbxShoKEaKvljUVgIlxIhWUQjoEFwUU9IceNMtutERDu4jvSJGPKb18LnytlTuUUtWydd4yQDcf1LV9V/vXoAr00vemsAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
range offset from -1 to 1 step 1
| project monthStart = startofmonth(datetime(2017-01-01 10:10:17), offset) 
```

**Output**

|monthStart|
|---|
|2016-12-01 00:00:00.0000000|
|2017-01-01 00:00:00.0000000|
|2017-02-01 00:00:00.0000000|
