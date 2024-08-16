---
title:  isnotnull()
description: Learn how to use the isnotnull() function to check if the argument isn't null.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/21/2022
---
# isnotnull()

Returns `true` if the argument isn't null.

> **Deprecated aliases:** notnull()

## Syntax

`isnotnull(`*value*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*value*|scalar| :heavy_check_mark:| The value to check if not null.|

## Returns

`true` if *value* isn't null and `false` otherwise.

## Example

Find the storm events for which there's a begin location.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVcgszssvySvNydFwSk3PzPNJLNFUSMxLwRDPz9MEAOSBMshAAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| where isnotnull(BeginLat) and isnotnull(BeginLon)
```
