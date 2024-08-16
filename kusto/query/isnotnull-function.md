---
title:  isnotnull()
description: Learn how to use the isnotnull() function to check if the argument isn't null.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# isnotnull()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns `true` if the argument isn't null.

> **Deprecated aliases:** notnull()

## Syntax

`isnotnull(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*value*|scalar| :heavy_check_mark:| The value to check if not null.|

## Returns

`true` if *value* isn't null and `false` otherwise.

## Example

Find the storm events for which there's a begin location.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVcgszssvySvNydFwSk3PzPNJLNFUSMxLwRDPz9MEAOSBMshAAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where isnotnull(BeginLat) and isnotnull(BeginLon)
```
