---
title:  dayofyear()
description: Learn how to use the dayofyear() function to return the day number of the given year.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# dayofyear()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Provides the integer that represents the day of the year for a specified datetime value.

## Syntax

`dayofyear(`*date*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark: | The datetime for which to determine the day number.|

## Returns

The day number of the given year.

## Examples

The following example shows how to extract the day of the year from a specified datetime value.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAAysoyswrUUhJrMxPq0xNLNJISSxJLcnMTdUwMjA01TU00jU00dQEAOQ8/cIlAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
dayofyear(datetime(2015-12-14))
```

**Output**

|result|
|--|
|348|
