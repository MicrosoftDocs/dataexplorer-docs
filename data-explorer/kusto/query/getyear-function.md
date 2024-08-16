---
title:  getyear()
description: Learn how tow use the getyear() function to return the year of the `datetime` input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/18/2022
---
# getyear()

Returns the year part of the `datetime` argument.

## Syntax

`getyear(`*date*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark: | The date for which to get the year. |

## Returns

The year that contains the given *date*.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUahMTSxSsFVITy0BsTRSEktSSzJzUzWMDAxNdQ0NdA2NNDUB6MDMlCoAAAA=" target="_blank">Run the query</a>

```kusto
print year = getyear(datetime(2015-10-12))
```

|year|
|--|
|2015|
