---
title:  dayofmonth()
description: Learn how to use the dayofmonth() function to return an integer representing the day of the month.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# dayofmonth()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Provides the day of the month as an integer from a specified datetime value.

## Syntax

`dayofmonth(`*date*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark: | The datetime used to extract the day number.|

## Returns

Returns an integer representing the day number of the given datetime.

## Examples

The following example shows how to extract the day of the month from a specified datetime value.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAAysoyswrUUhJrMxPy83PK8nQSEksSS3JzE3VMDIwNNU1NNI1NNHUBAAj3TtIJgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
dayofmonth(datetime(2015-12-14))
```

**Output**

|result|
|--|
|14|
