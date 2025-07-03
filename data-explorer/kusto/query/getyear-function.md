---
title:  getyear()
description: Learn how tow use the getyear() function to return the year of the `datetime` input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# getyear()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the year part of the `datetime` argument.

## Syntax

`getyear(`*date*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark: | The date for which to get the year. |

## Returns

The year that contains the given *date*.

## Examples

The following example returns the year of the given date.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUahMTSxSsFVITy0BsTRSEktSSzJzUzWMDAxNdQ0NdA2NNDUB6MDMlCoAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print year = getyear(datetime(2015-10-12))
```

|year|
|--|
|2015|
